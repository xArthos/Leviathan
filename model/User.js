// Modules
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

// Setting a Schema
const userSchema = new Schema({
    type: {
        type: String,
        default: 'user'
    },
    userName: {
        type: String,
        required: [true, 'Please write your username.'],
        min: 2,
        max: 255
    },
    name: {
        firstName: {
            type: String,
            required: [true, 'Please write your first name.'],
            min: 2,
            max: 255
        },
        lastName: {
            type: String,
            required: [true, 'Please write your last name.'],
            min: 2,
            max: 255
        }
    },
    email: {
        type: String,
        required: [true, 'Please write your e-mail address.'],
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: [true, 'Please write your password.'],
        min: 6,
        max: 1024
    },
    profilePicture: {
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
    },
    profilePictureUrl: {
        type: String
    },

    active: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

// Virtual
userSchema.virtual('fullName').get(() => {
    return `${this.name.firstName} ${this.name.lastName}`;
});

// Converting Schema as a Module
const User = mongoose.model('User', userSchema);

// Export Module
module.exports = User;