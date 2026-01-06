const { query } = require('../db/db');

/**
 * Task Model
 * Handles all database operations for tasks
 */
class Task {
  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @param {string} taskData.title - Task title
   * @param {string} taskData.description - Task description
   * @param {string} taskData.status - Task status (pending, in_progress, completed)
   * @param {number} taskData.userId - User ID who owns the task
   * @returns {Promise<Object>} Created task object
   */
  static async create({ title, description, status = 'pending', userId }) {
    const result = await query(
      `INSERT INTO tasks (title, description, status, user_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [title, description, status, userId]
    );
    return result.rows[0];
  }

  /**
   * Find all tasks for a user
   * @param {number} userId - User ID
   * @param {Object} filters - Optional filters (status, search)
   * @returns {Promise<Array>} Array of task objects
   */
  static async findByUserId(userId, filters = {}) {
    let sql = 'SELECT * FROM tasks WHERE user_id = $1';
    const values = [userId];
    let paramCount = 2;

    // Add status filter if provided
    if (filters.status) {
      sql += ` AND status = $${paramCount++}`;
      values.push(filters.status);
    }

    // Add search filter if provided (search in title and description)
    if (filters.search) {
      sql += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Find task by ID
   * @param {number} taskId - Task ID
   * @param {number} userId - User ID (for ownership verification)
   * @returns {Promise<Object|null>} Task object or null
   */
  static async findById(taskId, userId) {
    const result = await query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );
    return result.rows[0] || null;
  }

  /**
   * Update a task
   * @param {number} taskId - Task ID
   * @param {number} userId - User ID (for ownership verification)
   * @param {Object} updates - Object with fields to update
   * @returns {Promise<Object|null>} Updated task object or null
   */
  static async update(taskId, userId, { title, description, status }) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      return await this.findById(taskId, userId);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(taskId, userId);

    const result = await query(
      `UPDATE tasks 
       SET ${updates.join(', ')} 
       WHERE id = $${paramCount} AND user_id = $${paramCount + 1} 
       RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  /**
   * Delete a task
   * @param {number} taskId - Task ID
   * @param {number} userId - User ID (for ownership verification)
   * @returns {Promise<boolean>} Success status
   */
  static async delete(taskId, userId) {
    const result = await query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );
    return result.rowCount > 0;
  }
}

module.exports = Task;

