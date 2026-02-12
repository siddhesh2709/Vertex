const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: String, // Firebase UID or PostgreSQL ID
        required: true
    },
    userName: String,
    userPhoto: String,
    content: {
        type: String,
        required: true
    },
    image: String, // S3 URL
    likes: [String], // Array of User IDs
    comments: [{
        userId: String,
        userName: String,
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
