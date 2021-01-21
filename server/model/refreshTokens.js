// Modules
import mongoose from 'mongoose';
import Schema from 'mongoose';

// Setting a Schema
const refreshTokenSchema = mongoose.Schema({
    token: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    expiresAt: { 
        type: Date,
        expires: '12h' }
},
{timestamps: true}); // Set Automatically Creation and Update time

// Set Autoerasing time of the file
refreshTokenSchema.index( {"expire_at": 1 }, { expireAfterSeconds: 5 } );

// Converting Schema as a Module
const RefreshTokens = mongoose.model('RefreshTokens', refreshTokenSchema);

// Export Module
export default RefreshTokens;