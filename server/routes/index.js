// Modules
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

// Controllers
import { usersList, userProfilePic } from '../controllers/get.js'
import {
    validateUserInformations,
    signUp,
    login,
    checkExitEmail,
    checkExitUsername,
    imgUpload
} from '../controllers/post.js'


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Setting the router
const router = express.Router();

// Setting the favicon
const favicon = fs.readFileSync(`${process.cwd()}/public/images/ico/favicon.ico`);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Server Storage Uploaded Files - Settings
// Profile Pictures Storage
const storageProfilePic = multer.diskStorage({

    destination: (req, file, cb) => {

        // User infos
        const user = JSON.parse(JSON.stringify(req.body));

        // Destination of the file
        const dir = `${process.cwd()}/public/images/profilePicture/${user.userName}/`;

        // Create a new folder if it doesn't exit
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        };

        // Callback
        cb(null, dir);
    },

    filename: (req, file, cb) => {
        // console.log(file)
        cb(null, `profile${path.extname(file.originalname)}`);
    }

});

const uploadProfilePic = multer({
    storage: storageProfilePic
});


// New Wiki Page Storage
const storageNewWikiPagePics = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(req)

        // Preset Infos
        const preset = JSON.parse(JSON.stringify(req.body));

        // Destination of the file
        const dir = `${process.cwd()}/images/wikis/${preset.userName}/`;

        // Create a new folder if it doesn't exit
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        };

        // Callback
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `image${path.extname(file.originalname)}`);
    }
});
const uploadNewWikiPagePics = multer({
    storage: storageNewWikiPagePics
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// GET
router.get('/usersList', usersList);
router.get('/:userName/profilePicture', userProfilePic);

// POST
router.post('/login', login);
router.post('/register', uploadProfilePic.single('profilePicture'), validateUserInformations, checkExitEmail, checkExitUsername, signUp);
router.post('/upload', uploadProfilePic.single('editProfilePicture'), imgUpload);
router.post('/wiki', uploadNewWikiPagePics.array('upload'), (req, res) => {
    console.log(req.body)
});


// Export
export default router;