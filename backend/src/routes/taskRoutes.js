const express = require('express');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private (requires authentication)
 */
router.post('/', createTask);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the authenticated user (with optional filters: ?status=pending&search=keyword)
 * @access  Private (requires authentication)
 */
router.get('/', getTasks);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private (requires authentication)
 */
router.put('/:id', updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private (requires authentication)
 */
router.delete('/:id', deleteTask);

module.exports = router;

