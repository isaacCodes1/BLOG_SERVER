const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // Adjust path as needed
const Blog = require('../models/blog');
const User = require('../models/user'); // Import the user model
const authMiddleware = require('../middlewares/authMiddlewares'); // Import the auth middleware

// GET all blogs
router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blogs', details: error.message });
    }
});

// POST a new blog with banned user check (authMiddleware applied here)
router.post('/blogs', authMiddleware, upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    try {
        // Fetch the authenticated user (req.user is populated by authMiddleware)
        const user = await User.findById(req.user._id); // Use req.user._id for MongoDB

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user is banned
        if (user.banned) {
            return res.status(403).json({ error: 'You are banned from posting blogs' });
        }

        // Proceed with creating the blog post if the user is not banned
        const newBlog = new Blog({
            title,
            content,
            image,
            author: user._id  // Attach the user ID as the blog's author
        });

        await newBlog.save();
        res.status(201).json({ message: 'Blog posted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to post blog', details: error.message });
    }
});

module.exports = router;
