const express = require('express');
const router = express.Router();
const multer = require('multer');
const DiseaseController = require('../controllers/DiseaseController');
const { verifyToken } = require('../middleware/auth');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
});

router.get('/model-info', verifyToken, DiseaseController.getModelInfo);
router.post('/detect', verifyToken, upload.single('image'), DiseaseController.detectDisease);

module.exports = router;
