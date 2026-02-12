const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    suitableSoil: [String],
    growingSeason: [String],
    harvestTime: String,
    description: String,
    benefits: [String],
    careInstructions: String,
    imageURL: String
});

module.exports = mongoose.model('Crop', CropSchema);
