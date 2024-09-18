const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middlewares/authMiddlewares');

// Middleware to check if user is admin (Optional, add logic as needed)
const adminMiddleware = (req, res, next) => {
    // Replace this with your own admin check logic
    if (req.user.isAdmin) {
        return next();
    }
    return res.status(403).json({ error: 'Access denied' });
};

// Ban a user
router.patch('/users/:userId/ban', authMiddleware, adminMiddleware, async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.banned = true;
        await user.save();

        res.status(200).json({ message: 'User banned successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to ban user', details: error.message });
    }
});

module.exports = router;
