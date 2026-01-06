const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get user profile
 * GET /api/user/profile
 */
const getProfile = async (req, res, next) => {
  try {
    // User is attached to request by authenticate middleware
    const user = await User.findById(req.userId);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * PUT /api/user/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // Validate that at least one field is provided
    if (!name && !email) {
      return next(new AppError('Please provide at least one field to update (name or email)', 400));
    }

    // Validate email format if email is being updated
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return next(new AppError('Please provide a valid email address', 400));
      }

      // Check if email is already taken by another user
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== req.userId) {
        return next(new AppError('Email is already taken by another user', 409));
      }
    }

    // Update user profile
    const updatedUser = await User.update(req.userId, { name, email });

    if (!updatedUser) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          createdAt: updatedUser.created_at,
          updatedAt: updatedUser.updated_at,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};

