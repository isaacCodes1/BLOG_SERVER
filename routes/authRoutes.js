const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authControllers');
const User = require('../models/user'); // Import the user model

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Ban user route (PUT request)
router.put('/ban/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.banned = true;  // Set the banned status to true
        await user.save();

        res.status(200).json({ message: `User ${user.username} has been banned` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
