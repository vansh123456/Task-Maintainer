require('dotenv').config();
const { query } = require('./db');

//[DNM] used AI to generate this file
/**
 * Add profile_picture column to users table
 * Run this script to add the column to existing database
 */
const addProfilePictureColumn = async () => {
  try {
    // Check if column already exists
    const checkColumn = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='profile_picture'
    `);

    if (checkColumn.rows.length > 0) {
      console.log('profile_picture column already exists');
      process.exit(0);
    }

    // Add profile_picture column
    await query(`
      ALTER TABLE users 
      ADD COLUMN profile_picture VARCHAR(500)
    `);
    console.log('profile_picture column added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding profile_picture column:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  addProfilePictureColumn();
}

module.exports = { addProfilePictureColumn };
