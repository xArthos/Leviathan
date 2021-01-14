// Modules
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');

// Models
const User = require('../model/User');
const RefreshTokens = require('../model/refreshTokens');

// Controllers
const { registerValidation } = require('./validation');
const { generateAccessToken } = require('./jwtToken');

// SendGrid Settings
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


////////////////////////////////////////////////////////////////////////////////////////////////////////


//### Functions - POST Routes ###
exports.loginProcess = async (req, res) => {

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

exports.signUpProcess = async (req, res) => {

    // Destructuring important datas
    const { email, password, userName } = req.body;

    try {
        User.findOne({ email, userName }, (err, user) => {
            if (user) {
                return res.status(400).json({ error: 'Email already registred' })
            }

            // Hash Password Before Save it Into DB

            // Setting a Salt Rounds
            const saltRounds = 15;

            // Create a Random Value Called salt/header
            const salt = bcrypt.genSaltSync(saltRounds);

            // Create Hash Result
            const hashedPassword = bcrypt.hashSync(password, salt);

            // console.log('User infos');
            // console.log(decoded);

            // Create New User
            let newUser;
            if (!req.file) {
                newUser = new User({
                    userName: userName,
                    name: {
                        lastName: req.body.lastName,
                        firstName: req.body.firstName
                    },
                    email: email,
                    password: hashedPassword,
                    profilePicture: null,
                    profilePictureUrl: null
                });
            } else {
                newUser = new User({
                    userName: userName,
                    name: {
                        lastName: req.body.lastName,
                        firstName: req.body.firstName
                    },
                    email: email,
                    password: hashedPassword,
                    profilePicture: req.body,
                    profilePictureUrl: req.body.path.split('C:\\Users\\Arthos\\Documents\\GitHub\\Leviathan\\public\\')[1]
                });
            };

            // Save New User in DB
            newUser.save(() => {
                res.redirect('/');
            });

            const token = jwt.sign(req.body, process.env.JWT_SECRET_KEY, { expiresIn: '20m' });

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

            sgMail.send(msg).then(() => {
                console.log('Message sent');
                res.redirect('/');
            }).catch((error) => {
                console.log(error)
                // console.log(error.response.body.errors[0].message)
            });
        })
    } catch (err) {
        res.status(400).send(err);
    };
};

exports.authenticateAccount = async (req, res) => {
    const token = req.params.token;
    console.log(token)

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
exports.logOutProcess = (req, res) => {
    // Erase the Refresh Token from DB
    const refreshToken = req.session.refreshToken;
    RefreshTokens.findOneAndDelete({ token: refreshToken }, () => {
        console.log('Refresh Token deleted from DB');
    });

    // Erase the Whole Session
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
};


////////////////////////////////////////////////////////////////////////////////////////////////////////


//### Functions - Middleware ###
exports.checkRegistredEmail = (req, res, next) => {

    // Check if email exits
    User.findOne(req.body, (err, data) => {
        console.log(data)
        if (err) throw err

        if (data === null) {
            next();
        } else if (data.email === req.body.email) {
            req.flash('signUpError', 'This email is already used.');
            return res.redirect('/user/signUp');
        };
    });
};

exports.checkRegistredUsername = (req, res, next) => {

    // Check if username exits
    User.findOne(req.body, (err, data) => {
        if (err) throw err

        if (data === null) {
            next();
        } else if (data.userName === req.body.userName) {
            req.flash('signUpError', 'This username is already used.');
            return res.redirect('/user/signUp');
        };
    });
};

exports.validateUserInformations = (req, res, next) => {
    // Validation of the datas
    // console.log(req.body)
    // console.log(req.file)
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    next();
};