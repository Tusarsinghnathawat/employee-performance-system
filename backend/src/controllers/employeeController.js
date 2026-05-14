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
      'SELECT e.id, e.user_id, u.name, u.email, u.role, e.designation, e.department, e.manager_id, e.joining_date FROM employees e JOIN users u ON e.user_id = u.id'
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
      'SELECT e.id, e.user_id, u.name, u.email, u.role, e.designation, e.department, e.manager_id, e.joining_date FROM employees e JOIN users u ON e.user_id = u.id WHERE e.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const employee = result.rows[0];

    if (req.user.role === 'employee' && Number(req.user.id) !== Number(employee.user_id)) {
      return res.status(403).json({ error: 'Forbidden: access to this employee is denied' });
    }

    res.json({
      employee,
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
    const { name, email, title, department, role, manager_id, joining_date } = req.body;

    // Validation
    if (!name || !email || !title || !department || !role) {
      return res.status(400).json({ error: 'name, email, title, department, and role are required' });
    }

    // Check if email already exists
    const emailCheck = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Start transaction
    await db.query('BEGIN');

    try {
      // Create user
      const userResult = await db.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [name, email, 'temp_password', role] // TODO: Generate proper password or handle auth separately
      );

      const userId = userResult.rows[0].id;

      // Create employee
      const employeeResult = await db.query(
        'INSERT INTO employees (user_id, designation, department, manager_id, joining_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [userId, title, department, manager_id || null, joining_date || new Date().toISOString().split('T')[0]]
      );

      // Get complete employee data with user info
      const completeResult = await db.query(
        'SELECT e.id, e.user_id, u.name, u.email, u.role, e.designation, e.department, e.manager_id, e.joining_date FROM employees e JOIN users u ON e.user_id = u.id WHERE e.id = $1',
        [employeeResult.rows[0].id]
      );

      await db.query('COMMIT');

      res.status(201).json({
        message: 'Employee created successfully',
        employee: completeResult.rows[0],
      });
    } catch (innerErr) {
      await db.query('ROLLBACK');
      throw innerErr;
    }
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
    const { name, email, title, department, role, manager_id } = req.body;

    // Check if employee exists and get current data
    const employeeQuery = await db.query(
      'SELECT e.*, u.name, u.email, u.role FROM employees e JOIN users u ON e.user_id = u.id WHERE e.id = $1',
      [id]
    );

    if (employeeQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const currentEmployee = employeeQuery.rows[0];

    // Start transaction for potential user updates
    await db.query('BEGIN');

    try {
      // Update user data if provided
      if (name || email || role) {
        const userUpdates = [];
        const userValues = [];
        let userParamCount = 1;

        if (name !== undefined) {
          userUpdates.push(`name = $${userParamCount}`);
          userValues.push(name);
          userParamCount++;
        }
        if (email !== undefined) {
          // Check if new email conflicts with existing users
          if (email !== currentEmployee.email) {
            const emailCheck = await db.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, currentEmployee.user_id]);
            if (emailCheck.rows.length > 0) {
              await db.query('ROLLBACK');
              return res.status(400).json({ error: 'Email already exists' });
            }
          }
          userUpdates.push(`email = $${userParamCount}`);
          userValues.push(email);
          userParamCount++;
        }
        if (role !== undefined) {
          userUpdates.push(`role = $${userParamCount}`);
          userValues.push(role);
          userParamCount++;
        }

        if (userUpdates.length > 0) {
          userValues.push(currentEmployee.user_id);
          const userQuery = `UPDATE users SET ${userUpdates.join(', ')} WHERE id = $${userParamCount}`;
          await db.query(userQuery, userValues);
        }
      }

      // Update employee data
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (title !== undefined) {
        updates.push(`designation = $${paramCount}`);
        values.push(title);
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

      if (updates.length > 0) {
        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `UPDATE employees SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        await db.query(query, values);
      }

      // Get updated complete employee data
      const updatedResult = await db.query(
        'SELECT e.id, e.user_id, u.name, u.email, u.role, e.designation, e.department, e.manager_id, e.joining_date FROM employees e JOIN users u ON e.user_id = u.id WHERE e.id = $1',
        [id]
      );

      await db.query('COMMIT');

      res.json({
        message: 'Employee updated successfully',
        employee: updatedResult.rows[0],
      });
    } catch (innerErr) {
      await db.query('ROLLBACK');
      throw innerErr;
    }
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
