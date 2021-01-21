// Modules
import mongoose from 'mongoose';

// Setting a Schema
const profilePicture = mongoose.Schema({
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number
});

// Converting Schema as a Module
const ProfilePicture = mongoose.model('ProfilePicture', profilePicture);

// Export Module
export default ProfilePicture;