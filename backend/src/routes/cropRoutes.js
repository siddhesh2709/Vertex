const express = require('express');
const router = express.Router();
const CropController = require('../controllers/CropController');
const { verifyToken } = require('../middleware/auth');

router.get('/recommendations', verifyToken, CropController.getRecommendations);
router.get('/all', CropController.getAllCrops);
router.get('/:id', CropController.getCropById);

module.exports = router;
