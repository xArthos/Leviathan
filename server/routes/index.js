// Modules
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

// Controllers
import { usersList } from '../controllers/get.js'
import { 
    validateUserInformations,
    signUp,
    login,
    checkExitEmail,
    checkExitUsername } from '../controllers/post.js'

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Setting the router
const router = express.Router();

// Setting the favicon
const favicon = fs.readFileSync(`${process.cwd()}/public/images/ico/favicon.ico`);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Server Storage Uploaded Files - Settings
const storage = multer.diskStorage({
    destination: `${process.cwd()}/public/images/uploadedPics`,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_profilePic${path.extname(file.originalname)}`);
    }
});
const upload = multer({
    storage: storage
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// GET
router.get('/usersList', usersList);

// POST
router.post('/login', login);
router.post('/register', upload.single('profilePicture'), validateUserInformations, checkExitEmail, checkExitUsername, signUp);

// signUpProcess

// Export
export default router;