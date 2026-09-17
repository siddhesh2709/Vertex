const express = require('express');
const router = express.Router();
const MarketController = require('../controllers/MarketController');
const { verifyToken } = require('../middleware/auth');

router.get('/prices', verifyToken, MarketController.getMarketPrices);

module.exports = router;
