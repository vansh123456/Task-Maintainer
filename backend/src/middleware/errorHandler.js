/**
 * Centralized Error Handling Middleware
 * Handles all errors in the application and sends appropriate responses
 */

/**
 * Custom App Error class
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle database errors (PostgreSQL specific)
 */
const handleDatabaseError = (err) => {
  // Handle unique constraint violation (duplicate email, etc.)
  if (err.code === '23505') {
    const field = err.detail.match(/\(([^)]+)\)=/)?.[1] || 'field';
    return new AppError(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`, 409);
  }

  // Handle foreign key constraint violation
  if (err.code === '23503') {
    return new AppError('Invalid reference: related record does not exist', 400);
  }

  // Handle not null constraint violation
  if (err.code === '23502') {
    const field = err.column || 'field';
    return new AppError(`${field} is required`, 400);
  }

  return new AppError('Database error occurred', 500);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401);
};

/**
 * Handle JWT expired error
 */
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again.', 401);
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (err.code === '23505' || err.code === '23503' || err.code === '23502') {
      error = handleDatabaseError(err);
    } else if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    } else if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
};

/**
 * Handle 404 errors for undefined routes
 */
const notFoundHandler = (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
};

