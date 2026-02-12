const express = require('express');
const router = express.Router();
const { getWeather } = require('../services/weatherService');
const { verifyToken } = require('../middleware/auth');

router.get('/current', verifyToken, async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and Longitude are required' });
        }
        const data = await getWeather(lat, lon);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
