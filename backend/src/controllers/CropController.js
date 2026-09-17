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

        // Rule-based matching: soilType is required; season (if supplied) narrows further.
        const query = { suitableSoil: { $in: [user.soilType] } };
        const { season } = req.query;
        if (season) {
            query.growingSeason = { $in: [season] };
        }

        const recommendations = await Crop.find(query);

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
