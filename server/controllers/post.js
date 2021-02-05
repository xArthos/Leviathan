// Modules
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import sgMail from '@sendgrid/mail';

// Models
import User from '../model/User.js';


////////////////////////////////////////////////////////////////////////////////////////////////////////
const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
};

// Register Validation
const registerValidation = (data) => {

    const schema = Joi.object().keys({
        userName: Joi.string().trim().strict().min(2).max(20).required().messages({
            'string.empty': `Don\'t forget your Username ;)`,
            'string.min': `Great idea, but the your Username should have at least {#limit} units`,
            'string.max': `Wooh, that Username is a bit hard to remember, it shouldn't be more than {#limit} units`,
            'any.required': `Your Username is required`,
            'string.trim': `Your Username cannot contain empty spaces before or after`
        }),
        firstName: Joi.string().trim().strict().regex(/^[ a-zA-Z]+$/).min(2).max(20).required().messages({
            'string.empty': `Don\'t forget your First Name ;)`,
            'string.min': `Your First Name should have at least {#limit} letters`,
            'string.pattern.base': `Unless you are an android your First Name should only containes letters`,
            'string.max': `Impressive, but your First Name shouldn't be more than {#limit} units`,
            'any.required': `Your First Name is required`,
            'string.trim': `Your First Name cannot contain empty spaces before or after`
        }),
        lastName: Joi.string().trim().strict().regex(/^[ a-zA-Z]+$/).min(2).max(20).required().messages({
            'string.empty': `Don\'t forget your Last Name ;)`,
            'string.min': `Your Last Name should have at least {#limit} letters`,
            'string.pattern.base': `Unless you are an android your Last Name should only containes letters`,
            'string.max': `Impressive, but your Last Name shouldn't be more than {#limit} units`,
            'any.required': `Your Last Name is required`,
            'string.trim': `Your Last Name cannot contain empty spaces before or after`
        }),
        email: Joi.string().trim().strict().min(6).max(40).required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'de', 'it', 'fr', 'en', 'en', 'us', 'ru'] } }).messages({
            'string.empty': `Don\'t forget your E-Mail  ;)`,
            'string.min': `Your E-Mail should have at least {#limit} letters`,
            'string.max': `Impressive, but your E-Mail shouldn't be more than {#limit} units`,
            'any.required': `Your E-Mail is required`,
            'string.trim': `Your E-Mail cannot contain empty spaces before or after`,
            'string.email': `Your E-Mail must be valid`,
        }),
        password: Joi.string().trim().strict().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+*!=]).*$/).min(8).max(20).required().messages({
            'string.empty': `Don\'t forget your Password  ;)`,
            'string.min': `Your Password should have at least {#limit} letters`,
            'string.pattern.base': `Your Password must contain an upper and lower case, a number and a special symbol`,
            'string.max': `That enigma is too long, please your Password shouldn't be more than {#limit} units`,
            'any.required': `Your Password is required`,
            'string.trim': `Your Password cannot contain empty spaces before or after`
        }),
        passwordConfirmation: Joi.string().trim().strict().valid(Joi.ref('password')).required().messages({
            'any.only': `Password doesn't match confirmation`
        }),
        confirmEmail: Joi.string().trim().strict().valid(Joi.ref('email')).required().messages({
            'any.only': `E-mail doesn't match confirmation`
        }),
        profilePicture: Joi.any().meta({ swaggerType: 'file' }).optional().allow('').description('image file')
    });

    return schema.validate(data);
};

// // edit Validation
// const editValidation = (data) => {

//     const schema = Joi.object().keys({
//         userName: Joi.string().trim().strict().min(2).max(20).required().messages({
//             'string.empty': `Don\'t forget your Username ;)`,
//             'string.min': `Great idea, but the your Username should have at least {#limit} units`,
//             'string.max': `Wooh, that Username is a bit hard to remember, it shouldn't be more than {#limit} units`,
//             'any.required': `Your Username is required`,
//             'string.trim': `Your Username cannot contain empty spaces before or after`
//         }),
//         firstName: Joi.string().trim().strict().regex(/^[ a-zA-Z]+$/).min(2).max(20).required().messages({
//             'string.empty': `Don\'t forget your First Name ;)`,
//             'string.min': `Your First Name should have at least {#limit} letters`,
//             'string.pattern.base': `Unless you are an android your First Name should only containes letters`,
//             'string.max': `Impressive, but your First Name shouldn't be more than {#limit} units`,
//             'any.required': `Your First Name is required`,
//             'string.trim': `Your First Name cannot contain empty spaces before or after`
//         }),
//         lastName: Joi.string().trim().strict().regex(/^[ a-zA-Z]+$/).min(2).max(20).required().messages({
//             'string.empty': `Don\'t forget your Last Name ;)`,
//             'string.min': `Your Last Name should have at least {#limit} letters`,
//             'string.pattern.base': `Unless you are an android your Last Name should only containes letters`,
//             'string.max': `Impressive, but your Last Name shouldn't be more than {#limit} units`,
//             'any.required': `Your Last Name is required`,
//             'string.trim': `Your Last Name cannot contain empty spaces before or after`
//         }),
//         email: Joi.string().trim().strict().min(6).max(40).required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'de', 'it', 'fr', 'en', 'en', 'us', 'ru'] } }).messages({
//             'string.empty': `Don\'t forget your E-Mail  ;)`,
//             'string.min': `Your E-Mail should have at least {#limit} letters`,
//             'string.max': `Impressive, but your E-Mail shouldn't be more than {#limit} units`,
//             'any.required': `Your E-Mail is required`,
//             'string.trim': `Your E-Mail cannot contain empty spaces before or after`,
//             'string.email': `Your E-Mail must be valid`,
//         }),
//         password: Joi.string().trim().strict().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+*!=]).*$/).min(8).max(20).required().messages({
//             'string.empty': `Don\'t forget your Password  ;)`,
//             'string.min': `Your Password should have at least {#limit} letters`,
//             'string.pattern.base': `Your Password must contain an upper and lower case, a number and a special symbol`,
//             'string.max': `That enigma is too long, please your Password shouldn't be more than {#limit} units`,
//             'any.required': `Your Password is required`,
//             'string.trim': `Your Password cannot contain empty spaces before or after`
//         }),
//         passwordConfirmation: Joi.string().trim().strict().valid(Joi.ref('password')).required().messages({
//             'any.only': `Password doesn't match confirmation`
//         }),
//         confirmEmail: Joi.string().trim().strict().valid(Joi.ref('email')).required().messages({
//             'any.only': `E-mail doesn't match confirmation`
//         }),
//         profilePicture: Joi.any().meta({ swaggerType: 'file' }).optional().allow('').description('image file')
//     });

//     return schema.validate(data);
// };

//### Functions ###
export const login = async (req, res) => {

    const { email, password } = req.body;

    if (email === '' && password === '') {
        return res.status(406).send('The form is empty');
    } else if (password === '') {
        return res.status(406).send('Password is empty');
    } else if (email === '') {
        return res.status(406).send('E-mail is empty');
    };

    try {
        await User.findOne({ email: email }, (err, user) => {

            if (err) return res.status(400).send(err);

            ///////////////////////////////////////////////////
            // Check existing User
            if (user === null) {
                return res.sendStatus(204);
            };

            // Check if User is validated
            if (user.active === false) {
                return res.sendStatus(561);
            };
            ///////////////////////////////////////////////////

            // Decrypt password
            let checkpwd = bcrypt.compareSync(password, user.password);
            if (checkpwd) {

                const payload = {
                    user
                };

                // Generate and Assign an Access Token for the Logged User
                const accessToken = generateAccessToken(payload);
                // Generate and Assign a Refresh Token for the Logged User
                const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

                // Send Back the user
                res.status(200).send({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    user: user
                });
            } else {
                return res.status(403).send('Wrong Password.');
            };
        });
    } catch (error) {
        return res.status(401).send(error);
    };
};

export const signUp = async (req, res) => {

    // Destructuring important datas
    const { email, password, userName, firstName, lastName } = JSON.parse(req.body.body);

    try {

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
                    lastName: lastName,
                    firstName: firstName
                },
                email: email,
                password: hashedPassword,
                profilePicture: null
            });
        } else {
            newUser = new User({
                userName: userName,
                name: {
                    lastName: lastName,
                    firstName: firstName
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
                console.log('Message sent');
                res.status(200).send('User Created');
            })
            .catch((error) => {
                console.log(error)
                console.log(error.response.body.errors[0].message)
            });
    } catch (err) {
        res.status(400);
    };
};

export const authenticate = async (req, res) => {

    const token = req.params.token;
    console.log(token);

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) return res.send(400).send('Something went wrong');

            const { email } = decoded;

            User.findOneAndUpdate({ email: email }, { active: true }, (err, data) => {
                if (err) return res.send(400).send('Something went wrong');

                console.log(data)
            });

            res.status(200).send('User activated');
        })
    } else {
        return res.json({ error: 'Something went wrong :(' });
    };
};

//### Functions - Middleware ###
export const validateUserInformations = (req, res, next) => {

    // Take the data from FrontEnd
    const body = JSON.parse(req.body.body)

    // Validation of the datas
    const { error } = registerValidation(body);

    if (error) return res.status(400).send(error.details[0].message);

    console.log('** All Informations are insert correctly **');
    next();
};

export const checkExitEmail = (req, res, next) => {

    // Take the data from FrontEnd
    const { email } = JSON.parse(req.body.body);

    // Check if the e-mail is aleady registred in the DB
    try {
        User.findOne({ email }, (err, data) => {

            if (err) return res.status(400);

            if (data === null) {
                console.log('** Email not registred **');
                next();
            } else if (data.email === email) {
                return res.status(409).send('Email already registred!');
            };
        });
    } catch (error) {
        return res.status(400);
    };
};

export const checkExitUsername = (req, res, next) => {

    // Take the data from FrontEnd
    const { userName } = JSON.parse(req.body.body);

    // Check if the username is aleady registred in the DB
    try {
        User.findOne({ userName }, (err, data) => {

            if (err) return res.status(400);

            if (data === null) {
                console.log('** Username not registred **');
                next();
            } else if (data.userName === userName) {
                return res.status(409).send('Username already registred!');
            };
        });
    } catch (error) {
        return res.status(400);
    };
};