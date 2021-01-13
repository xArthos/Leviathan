// Modules
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

// Setting a Schema
const refreshTokenSchema = new Schema({
    token: {
        type: String
    },
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
module.exports = RefreshTokens;