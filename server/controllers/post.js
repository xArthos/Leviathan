// Modules
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import sgMail from '@sendgrid/mail';
import fs from 'fs';
import path from 'path';

// Models
import User from '../model/User.js';
import WikiPage from '../model/WikiPage.js';


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
    const { email, password, userName, firstName, lastName } = JSON.parse(req.body.userData);

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
        const profilePicUrl = `http://localhost:8010/${userName}/profilePicture`
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
                profilePicture: profilePicUrl
            });
        };
        console.log(newUser)

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

export const newProfilePicUpload = async (req, res) => {

    try {
        const { userName } = req.params;

        // Send the image to the front-end
        res.status(200).send({
            imageUploadedUrl: `http://localhost:8010/${userName}/profilePicture/temp`
        });
    } catch (error) {
        res.status(400).send({
            message: 'Error in the file uploading process'
        });
    };
};

export const setProfilePic = async (req, res) => {

    try {
        // User Informations
        const user = JSON.parse(JSON.stringify(req.body));

        // File Paths
        const currentPath = path.join(process.cwd(), "public", 'images', 'profilePicture', user.userName, 'temp', "profile.jpg");
        const destinationPath = path.join(process.cwd(), "public", 'images', 'profilePicture', user.userName, "profile.jpg");

        // Switching file's path function
        fs.rename(currentPath, destinationPath, function (err) {
            if (err) {
                throw err
            } else {
                console.log("Successfully moved the file!");
            };
        });

        // Creating URL and saving in DB
        const url = `http://localhost:8010/${user.userName}/profilePicture`;
        User.findOneAndUpdate({ _id: user.userId }, { profilePicture: url }, { upsert: true }, (err, res) => {
            if (err) { throw err; }
            else { console.log("Profile Picture Updated"); }
        });

        // Positive Response
        res.status(200).send({
            message: 'Profile picture successfully uploaded'
        });
    } catch (error) {
        // Negative Response
        res.status(400).send({
            message: error
        });
    }
};

export const updateAbout = async (req, res) => {

    try {
        // User Informations
        const { data, user } = req.body;

        User.findOneAndUpdate({ userName: user.userName }, { about: data }, { upsert: true }, (err, oldUserData) => {
            if (err) {
                // Negative Response
                res.status(400).send({
                    message: err
                });
            }
            else {
                User.findOne({ userName: oldUserData.userName }, (err, user) => {
                    // Positive Response
                    res.status(200).send({
                        message: 'Changments have been saved!',
                        userUpdated: {
                            user: user,
                            //! To Improve
                            accessToken: null,
                            refreshToken: null
                        }
                    });
                });
            };
        });
    } catch (error) {
        // Negative Response
        res.status(400).send({
            message: error
        });
    };
};

export const createNewWiki = async (req, res) => {
    const userId = req.params.userId;

    const newWiki = new WikiPage({
        author: userId,
    });

    await newWiki.save();

    console.log(newWiki);

    res.status(200).send({
        newWikiId: newWiki._id
    });
};

export const newWikiImageEditorUpload = async (req, res) => {

    const { wikiId } = req.params;

    const picExtension = path.extname(req.file.originalname).slice(1);
    const file = req.file.filename.replace(/\.[^/.]+$/, "");

    res.status(200).json({
        uploaded: true,
        url: `http://localhost:8010/${wikiId}/img/${picExtension}/${file}`
    });

};

export const deleteFile = async (req, res) => {
    try {
        const { wikiId, fileName, fileExt } = req.params;

        WikiPage.findById(wikiId).populate('author', '_id').exec().then((data) => {
            const userId = data.author._id;

            const filePath = `${process.cwd()}/public/images/wikis/${userId}/${wikiId}/${fileName}.${fileExt}`;

            fs.unlinkSync(filePath);

            res.status(200).send({
                message: 'File already removed.',
                alertVariant: 'success'
            });;
        });
    } catch (error) {
        res.status(500).send({
            message: 'File already removed.',
            alertVariant: 'danger'
        });
        // console.log('File already removed from DB');
    }
};

export const publishWiki = async (req, res) => {

    const { content, title, gameSerie, type, genre, relation } = JSON.parse(req.body.body);
    const { userId, wikiId } = req.params;

    WikiPage.findOneAndUpdate({ _id: wikiId }, { content: content, published: true, title: title, gameSerie: gameSerie, type: type, genre: genre, relation: relation, cardBg: req.file }, { upsert: true }, (err, res) => {
        if (err) {
            throw err;
        }
        else {
            console.log("Wiki Page Published");
        };

        User.findByIdAndUpdate((userId), { $push: { "wikiPagesMade": wikiId } }, { upsert: true }, (err, res) => {
            if (err) {
                throw err;
            }
            else {
                console.log("Wiki Page Added to the User's Collection");
            };
        });
    });

    res.status(200).send({
        message: 'Wiki Page Succesfully published'
    });
};

export const deleteWiki = async (req, res) => {
    const { wikiId } = req.params;

    WikiPage.findByIdAndDelete(wikiId).populate('author', '_id').exec((err, data) => {
        const { _id } = data.author;
        // console.log(_id);

        // Folder of the Wiki's images
        const dir = `${process.cwd()}/public/images/wikis/${_id}/${wikiId}`;
        // console.log(dir);

        fs.rm(dir, { recursive: true, force: true }, (err) => {
            if (err) {
                throw err;
            };

            // console.log(`Wiki's folder deleted!`);
        });

        User.findByIdAndUpdate((_id), { $pull: { "wikiPagesMade": wikiId } }, (err, res) => {
            if (err) {
                throw err;
            }
            else {
                console.log("Wiki Page removed from the User's Collection");
            };
        });
    });
    res.status(200).send({
        alertVariant: 'success',
        message: 'Wiki Page Succesfully deleted'
    });
};

//### Functions - Middleware ###
export const validateUserInformations = (req, res, next) => {

    // Take the data from FrontEnd
    const body = JSON.parse(req.body.userData)

    // Validation of the datas
    const { error } = registerValidation(body);

    if (error) return res.status(400).send(error.details[0].message);

    console.log('** All Informations are insert correctly **');
    next();
};

export const checkExitEmail = (req, res, next) => {

    // Take the data from FrontEnd
    const { email } = JSON.parse(req.body.userData);

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
    const { userName } = JSON.parse(req.body.userData);

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