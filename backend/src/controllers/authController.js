/**
 * Authentication Controller
 * Handles user registration, login, and profile retrieval
 */

const bcrypt = require('bcryptjs');
const authService = require('../services/authService');
const { generateToken } = require('../utils/jwt');

/**
 * Register a new user
 * POST /auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user exists
    const existingUser = await authService.findUserByEmail(email);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await authService.createUser({
      name,
      email,
      passwordHash: hashedPassword,
      role: role || 'employee',
    });

    const user = result.rows[0];

    // Generate token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * Login user
 * POST /auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await authService.findUserByEmail(email);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * Get current user info
 * GET /auth/me
 */
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user info
    const result = await authService.getUserById(userId);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      user,
    });
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
