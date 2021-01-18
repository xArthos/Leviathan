// Modules
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

// Setting a Schema
const profilePicture = new Schema({
    fieldname: {
        type: String
    },
    originalname: {
        type: String
    },
    encoding: {
        type: String
    },
    mimetype: {
        type: String
    },
    destination: {
        type: String
    },
    filename: {
        type: String
    },
    path: {
        type: String
    },
    size: {
        type: Number
    }
});

// Converting Schema as a Module
const ProfilePicture = mongoose.model('ProfilePicture', profilePicture);

// Export Module
module.exports = ProfilePicture;