const Post = require('../models/mongo/Post');
const s3 = require('../config/s3');

const createPost = async (req, res) => {
    try {
        const { content } = req.body;
        const { uid, name, picture } = req.user;
        let imageURL = null;

        if (req.file) {
            const params = {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: `posts/${Date.now()}_${req.file.originalname}`,
                Body: req.file.buffer,
                ACL: 'public-read',
                ContentType: req.file.mimetype
            };

            const upload = await s3.upload(params).promise();
            imageURL = upload.Location;
        }

        const newPost = new Post({
            userId: uid,
            userName: name || 'Farmer',
            userPhoto: picture,
            content,
            image: imageURL
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getFeed = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).limit(20);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const { uid } = req.user;

        if (post.likes.includes(uid)) {
            post.likes = post.likes.filter(id => id !== uid);
        } else {
            post.likes.push(uid);
        }

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { uid, name } = req.user;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        post.comments.push({
            userId: uid,
            userName: name || 'Farmer',
            text
        });

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createPost,
    getFeed,
    likePost,
    addComment
};
