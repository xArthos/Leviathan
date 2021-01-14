// Modules
const router = require('express').Router();
const multer = require('multer');
const path = require('path');

// Controls
const { 
    loginProcess,
    signUpProcess,
    logOutProcess,
    checkRegistredEmail,
    checkRegistredUsername,
    authenticateAccount,
    validateUserInformations
    } = require('../controllers/userProcess');

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

// GET Routes
router.get('/signUp', (req, res) => {
    res.render('signUp', {
        signUpError: req.flash('signUpError')
    });
});

router.get('/signIn', (req, res) => {
    res.render('signIn', {
        errorMsg: req.flash('errorMsg')
    });
});

router.get('/logOut', logOutProcess);

////////////////////////////////////////////////
// POST Routes
////////////////////////////////////////////////

// Sign Up / Register
router.post('/signUp', upload.single('profilePicture'), validateUserInformations, checkRegistredEmail, checkRegistredUsername, signUpProcess);

// Login
router.post('/login', loginProcess);

// Authenticate
router.get('/auth/:token', authenticateAccount);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Export
module.exports = router