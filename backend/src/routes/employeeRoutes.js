/**
 * Employees Routes
 * Handles employee-related endpoints
 */

const express = require('express');
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// CRUD routes
router.get('/', authorizeRoles('admin', 'hr', 'manager'), employeeController.getAllEmployees);
router.get('/:id', authorizeRoles('admin', 'hr', 'manager', 'employee'), employeeController.getEmployeeById);
router.post('/', authorizeRoles('admin', 'hr'), employeeController.createEmployee);
router.put('/:id', authorizeRoles('admin', 'hr'), employeeController.updateEmployee);
router.delete('/:id', authorizeRoles('admin', 'hr'), employeeController.deleteEmployee);

module.exports = router;
