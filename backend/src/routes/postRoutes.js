const express = require('express');
const router = express.Router();
const multer = require('multer');
const PostController = require('../controllers/PostController');
const { verifyToken } = require('../middleware/auth');

// Multer for temporary memory storage before uploading to S3
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/feed', PostController.getFeed);
router.post('/posts', verifyToken, upload.single('image'), PostController.createPost);
router.post('/posts/:id/like', verifyToken, PostController.likePost);
router.post('/posts/:id/comment', verifyToken, PostController.addComment);

module.exports = router;
