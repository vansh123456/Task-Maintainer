const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');
const User = require('../models/User');

/**
 * JWT Authentication Middleware
 * Verifies JWT token from cookies and attaches user to request object
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return next(new AppError('Authentication required. Please log in.', 401));
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Your token has expired. Please log in again.', 401));
      } else if (err.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid token. Please log in again.', 401));
      }
      return next(new AppError('Authentication failed.', 401));
    }

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Attach user to request object
    req.user = user;
    req.userId = decoded.id;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate,
};

