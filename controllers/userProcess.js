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
    // Hash Password Before Save it Into DB

    // Setting a Salt Rounds
    const saltRounds = 15;

    // Create a Random Value Called salt/header
    const salt = bcrypt.genSaltSync(saltRounds);

    // Create Hash Result
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    let cryptedPassword = hashedPassword;

    // Create New User
    let newUser;
    if (!req.file) {
        newUser = new User({
            userName: req.body.userName,
            name: {
                lastName: req.body.lastName,
                firstName: req.body.firstName
            },
            email: req.body.email,
            password: cryptedPassword,
            profilePicture: null,
            profilePictureUrl: null
        });
    } else {
        newUser = new User({
            userName: req.body.userName,
            name: {
                lastName: req.body.lastName,
                firstName: req.body.firstName
            },
            email: req.body.email,
            password: cryptedPassword,
            profilePicture: req.file,
            profilePictureUrl: req.file.path.split('C:\\Users\\Arthos\\Documents\\GitHub\\Leviathan\\public\\')[1]
        });
    }

    try {

        // Save New User in DB
        newUser.save(() => {
            res.redirect('/');
        });

        jwt.sign(newUser, process.env.EMAIL_SECRET, { expiresIn: '5m' });

        // SendGrid Settings
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: `${newUser.email}`,
            from: "giampaololocascio@gmail.com",
            subject: "Your registration on Leviathan",
            text: "just a sample text with no reason XD",
            html: "<strong>Signore</strong>"
        };

        sgMail.send(msg).then(() => {
            console.log('Message sent')
        }).catch((error) => {
            console.log(error.response.body)
            // console.log(error.response.body.errors[0].message)
        });
    } catch (err) {
        res.status(400).send(err);
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
exports.checkRegistredUser = (req, res, next) => {

    // Check if user exits
    User.findOne({ email: req.body.email }, (err, data) => {
        if (err) throw err

        if (data) {
            req.flash('signUpError', 'User already exits.');
            res.redirect('/user/signUp');
        } else {
            next();
        };
    });
};

exports.validateUserInformations = (req, res, next) => {
    // Validation of the datas
    console.log(req.body)
    console.log(req.file)
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    next();
};