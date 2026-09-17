const mongoose = require('mongoose');

// Each task belongs to a cultivation plan.
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    completedAt: {
        type: Date,
        default: null
    }
});

// A farmer can create multiple cultivation plans.
const CultivationSchema = new mongoose.Schema({
    userId: {
        type: String, // Firebase UID; set by the authenticated backend
        required: true,
        index: true
    },
    crop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crop',
        required: true
    },
    areaAcres: {
        type: Number,
        required: true,
        min: 0.01
    },
    startDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    tasks: {
        type: [TaskSchema],
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cultivation', CultivationSchema);