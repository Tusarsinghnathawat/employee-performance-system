/**
 * PostgreSQL Database Connection Pool
 * Handles connection pooling and database initialization
 */

const { Pool } = require('pg');

// Create connection pool
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_NAME || 'performance_db',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASS || 'postgres',
  max: 20, // Maximum number of connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

/**
 * Execute a query using the connection pool
 * @param {string} text - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise<object>} Query result
 */
const query = (text, params) => {
  const start = Date.now();
  return pool.query(text, params).then((result) => {
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  }).catch((err) => {
    console.error('Database error:', err.message);
    throw err;
  });
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise<object>} Database client
 */
const getClient = () => {
  return pool.connect();
};

/**
 * Initialize database schema
 * Run this once to create tables if they don't exist
 */
const initializeDB = async () => {
  try {
    const client = await pool.connect();
    
    // Read and execute schema
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, '../../schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await client.query(schema);
    client.release();
    
    console.log('Database initialized successfully');
  } catch (err) {
    if (err.code !== 'EEXIST' && !err.message.includes('already exists')) {
      console.error('Error initializing database:', err.message);
      throw err;
    }
  }
};

module.exports = {
  query,
  getClient,
  initializeDB,
  pool,
};
