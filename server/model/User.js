// Modules
import mongoose from 'mongoose';

// Setting a Schema
const userSchema = mongoose.Schema({
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
        fieldname: String,
        originalname: String,
        encoding: String,
        mimetype: String,
        destination: String,
        filename: String,
        path: String,
        size: Number
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
export default User;