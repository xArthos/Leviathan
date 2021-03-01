// Modules
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

// Controllers
import { 
    allUsersList,
    allWikisList,
    authenticate,
    userProfilePic,
    userProfilePicTemp,
    wikiPagePicture,
    wikiPagePublished,
    userWikiPages,
    formSelectArrowIcon,
    lastPublishedWikisList,
    wikiPageCardBackground
} from '../controllers/get.js'

import {
    validateUserInformations,
    signUp,
    login,
    checkExitEmail,
    checkExitUsername,
    newProfilePicUpload,
    newWikiImageEditorUpload,
    setProfilePic,
    publishWiki,
    deleteFile,
    createNewWiki,
    deleteWiki,
    updateAbout
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
        const dir = `${process.cwd()}/public/images/profilePicture/${user.userName}/temp`;

        // Create a new folder if it doesn't exit
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
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

// Profile Pictures Storage
const storageWikiCardBg = multer.diskStorage({

    destination: (req, file, cb) => {

        const { userId, wikiId } = req.params;

        // Destination of the file
        const dir = `${process.cwd()}/public/images/wikis/${userId}/${wikiId}/`;

        // Create a new folder if it doesn't exit
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        };

        // Callback
        cb(null, dir);
    },

    filename: (req, file, cb) => {
        // console.log(file)
        cb(null, `card-bg${path.extname(file.originalname)}`);
    }

});
const uploadWikiCardBg = multer({
    storage: storageWikiCardBg
});

// New Wiki Page Storage
const storageNewWikiPagePics = multer.diskStorage({
    destination: (req, file, cb) => {

        const { userId, wikiId } = req.params;

        // Destination of the file
        const dir = `${process.cwd()}/public/images/wikis/${userId}/${wikiId}/`;

        // Create a new folder if it doesn't exit
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        };

        // Callback
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});
const uploadNewWikiPagePics = multer({
    storage: storageNewWikiPagePics
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// GET
router.get('/allUsersList', allUsersList);
router.get('/allWikisList', allWikisList);
router.get('/user/auth/:token', authenticate);
router.get('/:userName/profilePicture', userProfilePic);
router.get('/:userName/profilePicture/temp', userProfilePicTemp);
router.get('/:userName/wikis', userWikiPages);
router.get('/:wikiId/img/:picExtension/:fileName', wikiPagePicture);
router.get('/img/bg/:wikiId/:picExtension', wikiPageCardBackground);
router.get('/wiki/:wikiId', wikiPagePublished);
router.get('/style/selectArrow', formSelectArrowIcon);
router.get('/lastPublishedWikis', lastPublishedWikisList);


// POST
router.post('/login', login);
router.post('/register', uploadProfilePic.single('profilePicture'), validateUserInformations, checkExitEmail, checkExitUsername, signUp);

router.post('/profile::userName/edit/newProfilePicUpload', uploadProfilePic.single('editProfilePicture'), newProfilePicUpload);
router.post('/profile::userName/edit/about', updateAbout);

router.post('/newWiki/picturesUpload/:userId/:wikiId', uploadNewWikiPagePics.single('upload'), newWikiImageEditorUpload);
router.post('/confirm', setProfilePic);
router.post('/newWiki/publish/:userId/:wikiId', uploadWikiCardBg.single('cardBackGroundImage'), publishWiki);
router.post('/deletePhoto/:wikiId/:fileName/:fileExt', deleteFile);
router.post('/wiki/create/:userId', createNewWiki);
router.post('/wiki/delete/:wikiId', deleteWiki);


// Export
export default router;