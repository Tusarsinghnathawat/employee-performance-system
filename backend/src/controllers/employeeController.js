/**
 * Employees Controller
 * Handles CRUD operations for employees
 */

const db = require('../config/db');

/**
 * Get all employees
 * GET /employees
 */
const getAllEmployees = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT e.id, e.user_id, u.name, e.designation, e.department, e.manager_id, e.joining_date FROM employees e JOIN users u ON e.user_id = u.id'
    );

    res.json({
      employees: result.rows,
      count: result.rows.length,
    });
  } catch (err) {
    console.error('Error fetching employees:', err.message);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

/**
 * Get employee by ID
 * GET /employees/:id
 */
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT e.id, e.user_id, u.name, e.designation, e.department, e.manager_id, e.joining_date FROM employees e JOIN users u ON e.user_id = u.id WHERE e.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({
      employee: result.rows[0],
    });
  } catch (err) {
    console.error('Error fetching employee:', err.message);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
};

/**
 * Create new employee
 * POST /employees
 */
const createEmployee = async (req, res) => {
  try {
    const { user_id, designation, department, manager_id, joining_date } = req.body;

    // Validation
    if (!user_id || !designation || !department) {
      return res.status(400).json({ error: 'user_id, designation, and department are required' });
    }

    // Check if user exists
    const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Create employee
    const result = await db.query(
      'INSERT INTO employees (user_id, designation, department, manager_id, joining_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, designation, department, manager_id || null, joining_date || new Date().toISOString().split('T')[0]]
    );

    res.status(201).json({
      message: 'Employee created successfully',
      employee: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating employee:', err.message);
    res.status(500).json({ error: 'Failed to create employee' });
  }
};

/**
 * Update employee
 * PUT /employees/:id
 */
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { designation, department, manager_id } = req.body;

    // Check if employee exists
    const employee = await db.query('SELECT id FROM employees WHERE id = $1', [id]);
    if (employee.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (designation !== undefined) {
      updates.push(`designation = $${paramCount}`);
      values.push(designation);
      paramCount++;
    }
    if (department !== undefined) {
      updates.push(`department = $${paramCount}`);
      values.push(department);
      paramCount++;
    }
    if (manager_id !== undefined) {
      updates.push(`manager_id = $${paramCount}`);
      values.push(manager_id);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE employees SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    const result = await db.query(query, values);

    res.json({
      message: 'Employee updated successfully',
      employee: result.rows[0],
    });
  } catch (err) {
    console.error('Error updating employee:', err.message);
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

/**
 * Delete employee
 * DELETE /employees/:id
 */
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if employee exists
    const employee = await db.query('SELECT id FROM employees WHERE id = $1', [id]);
    if (employee.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Delete employee
    await db.query('DELETE FROM employees WHERE id = $1', [id]);

    res.json({
      message: 'Employee deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting employee:', err.message);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
