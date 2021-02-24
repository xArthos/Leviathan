// Modules
import mongoose from 'mongoose';

// Setting a Schema
const wikiPageSchema = mongoose.Schema({
    content: String,
    published: {
        type: Boolean,
        required: true,
        default: false
    },
    author: { 
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title : { type: String, required: true, default: 'New Wiki' },
    gameSerie: { type: String, required: true, default: 'None' },
    genre: { type: String, required: true, default: 'None' },
    type: { type: String, required: true, default: 'Wiki'},
    relation: { type: String, required: true, default: 'General' }
}, { timestamps: true });

// Converting Schema as a Module
const WikiPage = mongoose.model('WikiPage', wikiPageSchema);

// Export Module
export default WikiPage;