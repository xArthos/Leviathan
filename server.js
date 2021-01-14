// Modules
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
require('dotenv').config();

// Server Settings
app.use(express.static(`${__dirname}/public`));             // Static Folder
app.set('view engine', 'hbs');                              // View Engine
app.use(cookieParser());                                    // CookieParser
app.use(bodyParser.urlencoded({ extended: false }));        // BodyParser
app.use(bodyParser.json());                                 // BodyParser Json
app.use(express.json());                                    // Use Json files
app.use(flash());                                           // Flash
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 60000 * 60 * 24 // 1 day
    },
    resave: true,
    saveUninitialized: true
}));                                                        // Session
sgMail.setApiKey(process.env.SENDGRID_API_KEY);             // SendGrid

// URL Setting
const PORT = process.env.PORT;
const host = process.env.URL_DOMAIN;

// Connect to DB
mongoose.connect(process.env.linkDB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(console.log('MongoDB is connected'))
.catch(err => console.log(err.message))

// Routes Modules
const index = require('./routes/index');
const user = require('./routes/user');
const profile = require('./routes/profile');

// Server Routes
app.use('/', index);
app.use('/user', user);
app.use('/profile', profile);

// Server Listening
app.listen(PORT, host, () => {
    console.log(`Server is running on ${host}:${PORT}`);
});