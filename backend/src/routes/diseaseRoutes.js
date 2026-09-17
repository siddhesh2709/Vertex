const express = require('express');
const router = express.Router();
const DiseaseController = require('../controllers/DiseaseController');
const { verifyToken } = require('../middleware/auth');

router.post('/detect', verifyToken, DiseaseController.detectDisease);

module.exports = router;
