const mandiPriceService = require('../services/mandiPriceService');
const User = require('../models/postgres/User');

const DEFAULT_CROPS = ['Rice', 'Wheat', 'Tomato', 'Potato', 'Onion', 'Maize', 'Cotton', 'Soybean'];

// Indian states, so a free-text profile location like "Nashik, Maharashtra"
// can be narrowed to state-level mandi data.
const STATES = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chattisgarh', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Meghalaya', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttrakhand', 'West Bengal', 'NCT of Delhi', 'Goa', 'Manipur', 'Mizoram'
];

const stateFromLocation = (location) => {
    if (!location) return null;
    const lower = location.toLowerCase();
    return STATES.find((s) => lower.includes(s.toLowerCase())) || null;
};

const getMarketPrices = async (req, res) => {
    try {
        // Prefer the farmer's own state when we can infer it; fall back to all-India.
        let state = req.query.state || null;
        if (!state) {
            const user = await User.findOne({ where: { firebaseUid: req.user.uid } });
            state = stateFromLocation(user?.location);
        }

        let payload = await mandiPriceService.getPrices(DEFAULT_CROPS, state);

        // A state with thin coverage can return nothing useful - retry nationally.
        const usable = payload.prices.filter((p) => !p.unavailable).length;
        if (state && usable === 0) {
            payload = await mandiPriceService.getPrices(DEFAULT_CROPS, null);
            payload.note = 'No state-level data available today; showing all-India figures.';
        }

        res.json(payload);
    } catch (error) {
        console.error('Market prices error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getMarketPrices };
