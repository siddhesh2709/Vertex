const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/StatsController');
const { verifyToken } = require('../middleware/auth');

router.get('/dashboard', verifyToken, StatsController.getDashboardStats);

module.exports = router;
