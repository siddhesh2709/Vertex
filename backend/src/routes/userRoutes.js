const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { verifyToken } = require('../middleware/auth');

router.post('/sync', verifyToken, UserController.syncUser);
router.get('/profile', verifyToken, UserController.getProfile);
router.put('/profile', verifyToken, UserController.updateProfile);

module.exports = router;
