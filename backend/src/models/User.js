const { query } = require('../db/db');

/**
 * User Model
 * Handles all database operations for users
 */
class User {
  /**
   * Create a new user
   * @param {string} name - User's name
   * @param {string} email - User's email (must be unique)
   * @param {string} password - Hashed password
   * @returns {Promise<Object>} Created user object (without password)
   */
  static async create(name, email, password) {
    const result = await query(
      `INSERT INTO users (name, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, profile_picture, created_at, updated_at`,
      [name, email, password]
    );
    return result.rows[0];
  }

  /**
   * Find user by email
   * @param {string} email - User's email
   * @returns {Promise<Object|null>} User object with password or null
   */
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   * @param {number} id - User's ID
   * @returns {Promise<Object|null>} User object without password or null
   */
  static async findById(id) {
    const result = await query(
      'SELECT id, name, email, profile_picture, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Update user profile
   * @param {number} id - User's ID
   * @param {Object} updates - Object with name and/or email to update
   * @returns {Promise<Object|null>} Updated user object or null
   */
  static async update(id, { name, email }) {
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE users 
       SET ${updates.join(', ')} 
       WHERE id = $${paramCount} 
       RETURNING id, name, email, profile_picture, created_at, updated_at`,
      values
    );
    return result.rows[0] || null;
  }

  /**
   * Update user profile picture
   * @param {number} id - User's ID
   * @param {string} profilePictureUrl - URL of the profile picture
   * @returns {Promise<Object|null>} Updated user object or null
   */
  static async updateProfilePicture(id, profilePictureUrl) {
    const result = await query(
      `UPDATE users 
       SET profile_picture = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, name, email, profile_picture, created_at, updated_at`,
      [profilePictureUrl, id]
    );
    return result.rows[0] || null;
  }

  /**
   * Update user password
   * @param {number} id - User's ID
   * @param {string} hashedPassword - New hashed password
   * @returns {Promise<boolean>} Success status
   */
  static async updatePassword(id, hashedPassword) {
    const result = await query(
      `UPDATE users 
       SET password = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2`,
      [hashedPassword, id]
    );
    return result.rowCount > 0;
  }
}

module.exports = User;

