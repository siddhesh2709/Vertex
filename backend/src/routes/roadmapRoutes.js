const express = require('express');
const router = express.Router();
const RoadmapController = require('../controllers/RoadmapController');
const { verifyToken } = require('../middleware/auth');

router.post('/generate', verifyToken, RoadmapController.generateRoadmap);
router.get('/mine', verifyToken, RoadmapController.getMyRoadmaps);
router.patch('/:id/tasks/:taskId', verifyToken, RoadmapController.toggleTask);
router.delete('/:id', verifyToken, RoadmapController.deleteRoadmap);

module.exports = router;
