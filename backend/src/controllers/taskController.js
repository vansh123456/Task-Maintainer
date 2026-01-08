const Task = require('../models/Task');
const { AppError } = require('../middleware/errorHandler');

/**
 * Create a new task
 * POST /api/tasks
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const userId = req.userId;

    // Validate input
    if (!title) {
      return next(new AppError('Title is required', 400));
    }

    // Validate status if provided
    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return next(
        new AppError(`Status must be one of: ${validStatuses.join(', ')}`, 400)
      );
    }

    // Create task
    const task = await Task.create({
      title,
      description: description || null,
      status: status || 'pending',
      userId,
    });

    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: {
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all tasks for the authenticated user
 * GET /api/tasks?status=pending&search=keyword
 */
const getTasks = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { status, search } = req.query;

    // Build filters object
    const filters = {};
    if (status) {
      const validStatuses = ['pending', 'in_progress', 'completed'];
      if (!validStatuses.includes(status)) {
        return next(
          new AppError(`Status must be one of: ${validStatuses.join(', ')}`, 400)
        );
      }
      filters.status = status;
    }
    if (search) {
      filters.search = search;
    }

    // Get tasks
    const tasks = await Task.findByUserId(userId, filters);

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: {
        tasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a task
 * PUT /api/tasks/:id
 */
const updateTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    const userId = req.userId;
    const { title, description, status } = req.body;

    // Validate task ID
    if (isNaN(taskId)) {
      return next(new AppError('Invalid task ID', 400));
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['pending', 'in_progress', 'completed'];
      if (!validStatuses.includes(status)) {
        return next(
          new AppError(`Status must be one of: ${validStatuses.join(', ')}`, 400)
        );
      }
    }

    // Validate that at least one field is provided
    if (!title && description === undefined && !status) {
      return next(
        new AppError(
          'Please provide at least one field to update (title, description, or status)',
          400
        )
      );
    }

    // Update task
    const updatedTask = await Task.update(taskId, userId, {
      title,
      description,
      status,
    });

    if (!updatedTask) {
      return next(
        new AppError('Task not found or you do not have permission to update it', 404)
      );
    }

    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: {
        task: updatedTask,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a task
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    const userId = req.userId;

    // Validate task ID
    if (isNaN(taskId)) {
      return next(new AppError('Invalid task ID', 400));
    }

    // Delete task
    const deleted = await Task.delete(taskId, userId);

    if (!deleted) {
      return next(
        new AppError('Task not found or you do not have permission to delete it', 404)
      );
    }

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};


