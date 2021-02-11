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
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        // Preset Infos
        const preset = JSON.parse(JSON.stringify(req.body));

        // Destination of the file
        const dir = `C:/Users/Arthos/Documents/GitHub/leviathan/client/public/images/profilePicture/${preset.userId}/`;

        // Create a new folder if it doesn't exit
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        };

        // Callback
        cb(null, dir);
    },
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
router.post('/upload', upload.single('file'), imgUpload);

// signUpProcess

// Export
export default router;