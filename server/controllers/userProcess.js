// Modules
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Models
import User from '../model/User.js';
import RefreshTokens from '../model/refreshTokens.js';

// Controllers
import { registerValidation } from './validation.js';
import { generateAccessToken } from './jwtToken.js';


////////////////////////////////////////////////////////////////////////////////////////////////////////


//### Functions - POST Routes ###
export const loginProcess = async (req, res) => {

    // user input data
    const { email, password } = req.body;

    User.findOne({ email: email }, (err, user) => {
        if (err) throw err;

        // console.log(user);

        if (user == null) {
            req.flash('errorMsg', 'No account found.');
            return res.redirect('/user/signIn');
        };

        if (user.active === false) {
            req.flash('errorMsg', 'Activate your account.');
            return res.redirect('/user/signIn');
        };

        let checkpwd = bcrypt.compareSync(password, user.password);
        if (checkpwd) {

            const payload = {
                user
            };

            // Generate and Assign an Access Token for the Logged User
            const accessToken = generateAccessToken(payload);
            // Generate and Assign a Refresh Token for the Logged User
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

            // Generate Expiration Date
            const expirationDate = new Date(Date.now());
            expirationDate.setHours(expirationDate.getHours() + 12);

            // Save the Refresh Token in DB
            const newRefreshToken = new RefreshTokens({
                token: refreshToken,
                user: user._id,
                expiresAt: expirationDate
            });

            return newRefreshToken.save(() => {
                req.session.user = user;
                req.session.refreshToken = refreshToken;
                req.session.accessToken = accessToken;
                res.redirect('/');
            });
        } else {
            req.flash('errorMsg', 'Incorrect password! please try it again.');
            return res.redirect('/user/signIn');
        };
    });
};

export const signUpProcess = async (req, res) => {

    // Destructuring important datas
    const { email, password, userName } = req.session.newUserData;

    try {
        User.findOne({ email, userName }, (err, user) => {

            /////////////////////////////////////////////////////////
            // * Hash Password Before Save it Into DB
            // Setting a Salt Rounds
            const saltRounds = 15;

            // Create a Random Value Called salt/header
            const salt = bcrypt.genSaltSync(saltRounds);

            // Create Hash Result
            const hashedPassword = bcrypt.hashSync(password, salt);
            /////////////////////////////////////////////////////////

            // * Create New User
            let newUser;
            if (!req.file) {
                newUser = new User({
                    userName: userName,
                    name: {
                        lastName: req.session.newUserData.lastName,
                        firstName: req.session.newUserData.firstName
                    },
                    email: email,
                    password: hashedPassword,
                    profilePicture: null
                });
            } else {
                newUser = new User({
                    userName: userName,
                    name: {
                        lastName: req.session.newUserData.lastName,
                        firstName: req.session.newUserData.firstName
                    },
                    email: email,
                    password: hashedPassword,
                    profilePicture: req.file
                });
            };

            // * Save New User in DB
            newUser.save();

            // * Create an Activation Token
            const token = jwt.sign(req.body, process.env.JWT_SECRET_KEY, { expiresIn: '20m' });

            // * Create an Activation Email
            const msg = {
                to: `${email}`,
                from: "giampaololocascio@gmail.com",
                subject: "Your registration on Leviathan",
                text: "just a sample text with no reason XD",
                html: `
                    <h2>Click this link for activate your account</h2>
                    <a href='${process.env.URL_DOMAIN}:${process.env.PORT}/user/auth/${token}'>${process.env.URL_DOMAIN}:${process.env.PORT}/user/auth/${token}</a>
                `
            };

            // * Send Activation Email to the New User
            sgMail.send(msg)
            .then(() => {
                req.session.destroy();
                console.log('Message sent');
                res.redirect('/');
            })
            .catch((error) => {
                //console.log(error)
                console.log(error.response.body.errors[0].message)
            });
        })
    } catch (err) {
        res.status(400).send(err);
    };
};

export const authenticateAccount = async (req, res) => {
    const token = req.params.token;
    console.log(token);

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) throw err

            const { email, password, userName } = decoded;

            User.findOneAndUpdate({ email: email }, { active: true }, (err, data) => {
                if (err) throw err;

                console.log(data)
            });

            res.redirect('/');
        })
    } else {
        return res.json({ error: 'Something is wrong' });
    };
};


////////////////////////////////////////////////////////////////////////////////////////////////////////


//### Functions GET Routes ###
export const logOutProcess = (req, res) => {

    // Erase the Refresh Token from DB
    const refreshToken = req.session.refreshToken;
    RefreshTokens.findOneAndDelete({ token: refreshToken }, () => {
        console.log('** Refresh Token deleted from DB **');
    });

    // Erase the Whole Session
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }

        console.log('** User Logged out **');
        res.redirect('/');
    });
};


////////////////////////////////////////////////////////////////////////////////////////////////////////


//### Functions - Middleware ###
export const validateUserInformations = (req, res, next) => {

    // Validation of the datas
    const { error } = registerValidation(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    console.log('** All Informations are insert correctly **');
    req.session.newUserData = req.body;
    next();
};

export const checkRegistredEmail = (req, res, next) => {
    const { email } = req.session.newUserData;

    // Check if email exits
    User.findOne({ email }, (err, data) => {

        if (err) throw err

        if (data === null) {
            console.log('** Email not registred **');
            next();
        } else if (data.email === email) {
            req.flash('signUpError', 'This email is already used.');
            return res.redirect('/user/signUp');
        };
    });
};

export const checkRegistredUsername = (req, res, next) => {
    const { userName } = req.session.newUserData;

    // Check if username exits
    User.findOne({ userName }, (err, data) => {
        if (err) throw err

        if (data === null) {
            console.log('** Username not used **');
            next();
        } else if (data.userName === userName) {
            req.flash('signUpError', 'This username is already used.');
            return res.redirect('/user/signUp');
        };
    });
};