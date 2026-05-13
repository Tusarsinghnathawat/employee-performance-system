/**
 * Authentication Service
 * Encapsulates user-related database operations
 */

const db = require('../config/db');

const findUserByEmail = async (email) => {
  return db.query('SELECT * FROM users WHERE email = $1', [email]);
};

const createUser = async ({ name, email, passwordHash, role }) => {
  return db.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [name, email, passwordHash, role]
  );
};

const getUserById = async (id) => {
  return db.query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [id]);
};

module.exports = {
  findUserByEmail,
  createUser,
  getUserById,
};
