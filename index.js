const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');  // Import the admin routes
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
app.use(express.json());

// Serve static files (images) from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Auth routes for registration and login
app.use('/api/auth', authRoutes);

// Admin routes for banning users
app.use('/api/admin', adminRoutes);  // Use a different prefix to distinguish

// Blog routes (protected)
app.use('/api', blogRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection failed:', error));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
