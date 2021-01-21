// Modules
import express from 'express';
import multer from 'multer';
import path from 'path';

// Controls
import { 
    loginProcess,
    signUpProcess,
    logOutProcess,
    checkRegistredEmail,
    checkRegistredUsername,
    authenticateAccount,
    validateUserInformations
    } from '../controllers/userProcess.js';

import { userList } from '../controllers/jsonResponse.js';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Setting the router
const router = express.Router();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Server Storage Uploaded Files - Settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${process.cwd()}/public/images/uploadedPics`);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_profilePic${path.extname(file.originalname)}`);
    }
});
const upload = multer({
    storage: storage
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//           GET Routes
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SignUp Page
router.get('/signUp', (req, res) => {

    if (req.session.newUserData) {
        req.session.destroy();
    };

    res.render('signUp', {
        signUpError: req.flash('signUpError')
    });
});

// SignIn Page
router.get('/signIn', (req, res) => {
    res.render('signIn', {
        errorMsg: req.flash('errorMsg')
    });
});

// Logout Page
router.get('/logOut', logOutProcess);

// JSON - All user list
router.get('/all', userList);

////////////////////////////////////////////////
//           POST Routes
////////////////////////////////////////////////

// Sign Up / Register
router.post('/signUp', upload.single('profilePicture'), validateUserInformations, checkRegistredEmail, checkRegistredUsername, signUpProcess);

// Login
router.post('/login', loginProcess);

// Authenticate
router.get('/auth/:token', authenticateAccount);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Export
export default router;