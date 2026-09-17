const express = require('express');
const router = express.Router();
const RoadmapController = require('../controllers/RoadmapController');
const { verifyToken } = require('../middleware/auth');

router.post('/generate', verifyToken, RoadmapController.generateRoadmap);

module.exports = router;
