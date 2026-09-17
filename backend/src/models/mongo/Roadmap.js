const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
    userId: {
        type: String, // Firebase UID
        required: true,
        index: true
    },
    cropName: {
        type: String,
        required: true
    },
    landArea: Number,
    startDate: Date,
    totalWeeks: Number,
    tasks: [{
        week: Number,
        task: String,
        description: String,
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending'
        },
        completedAt: Date
    }]
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', RoadmapSchema);
