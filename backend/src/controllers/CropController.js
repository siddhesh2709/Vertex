const Crop = require('../models/mongo/Crop');
const User = require('../models/postgres/User');

const getRecommendations = async (req, res) => {
    try {
        const user = await User.findOne({ where: { firebaseUid: req.user.uid } });
        if (!user || !user.soilType) {
            // Return generic crops if profile incomplete
            const crops = await Crop.find().limit(5);
            return res.json(crops);
        }

        // Simple matching algorithm: soilType and current season
        // In production, this would be more complex (using weather, humidity, etc.)
        const recommendations = await Crop.find({
            suitableSoil: { $in: [user.soilType] }
        });

        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllCrops = async (req, res) => {
    try {
        const crops = await Crop.find();
        res.json(crops);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCropById = async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id);
        if (!crop) return res.status(404).json({ error: 'Crop not found' });
        res.json(crop);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getRecommendations,
    getAllCrops,
    getCropById
};
