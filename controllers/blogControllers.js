const Blog = require('../models/blog');
const multer = require('multer');
const path = require('path');

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const createBlog = async (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.path : null;
    const author = req.user.id;

    try {
        const newBlog = new Blog({ title, content, image, author });
        await newBlog.save();
        res.status(201).json({ message: 'Blog created successfully!', newBlog });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create blog', details: error.message });
    }
};

module.exports = {
    createBlog,
    upload
};
