const express = require('express');
const { getProfile, updateProfile, uploadProfilePicture } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

/**
 * @route   GET /api/user/profile
 * @desc    Get user profile
 * @access  Private (requires authentication)
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile
 * @access  Private (requires authentication)
 */
router.put('/profile', authenticate, updateProfile);

/**
 * @route   POST /api/user/profile/picture
 * @desc    Upload user profile picture
 * @access  Private (requires authentication)
 */
router.post('/profile/picture', authenticate, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;


