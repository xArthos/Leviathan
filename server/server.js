// Modules
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
const app = express();

// Server Settings
dotenv.config();                                                        // .env file
app.use(express.static(`${process.cwd()}/public`));                     // Static Folder
app.use(cors());                                                        // Cross connection
app.use(cookieParser());                                                // CookieParser
app.use(bodyParser.urlencoded({ extended: false }));                    // BodyParser
app.use(bodyParser.json());                                             // BodyParser Json
app.use(express.json());                                                // Use Json files
sgMail.setApiKey(process.env.SENDGRID_API_KEY);                         // SendGrid

// URL Setting
const PORT = process.env.PORT || 8010;
const host = process.env.URL_DOMAIN || 'localhost';

// Connect to DB
mongoose.connect(process.env.linkDB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(console.log('MongoDB is connected'))
.catch(err => console.log(err.message));

mongoose.set('useFindAndModify', false);

// Routes Modules
import index from './routes/index.js';

// Server Routes
app.use('/', index);

// Server Listening
app.listen(PORT, host, () => {
    console.log(`Server is running on ${host}:${PORT}`);
});