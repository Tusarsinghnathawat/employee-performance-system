const express = require('express');
const { body, query, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');
const validateRequest = require('../middleware/validateRequest');
const trainingController = require('../controllers/trainingController');

const router = express.Router();
router.use(authMiddleware);

router.post(
  '/training',
  authorizeRoles('admin', 'hr'),
  [
    body('employee_id').isInt({ gt: 0 }).withMessage('employee_id must be a positive integer'),
    body('course_name').trim().notEmpty().withMessage('course_name is required'),
    body('provider').trim().notEmpty().withMessage('provider is required'),
    body('completed_at').optional().isISO8601().withMessage('completed_at must be a valid date'),
    body('certification_url').optional().trim().isURL().withMessage('certification_url must be a valid URL'),
  ],
  validateRequest,
  trainingController.createTraining
);

router.get(
  '/training',
  authorizeRoles('admin', 'hr'),
  [
    query('course_name').optional().trim(),
    query('provider').optional().trim(),
    query('completed_at').optional().isISO8601().withMessage('completed_at must be a valid date'),
  ],
  validateRequest,
  trainingController.getTrainings
);

router.get(
  '/training/employee/:employeeId',
  authorizeRoles('admin', 'hr', 'employee'),
  [param('employeeId').isInt({ gt: 0 }).withMessage('employeeId must be a positive integer')],
  validateRequest,
  trainingController.getTrainingsByEmployee
);

router.get(
  '/training/:id',
  authorizeRoles('admin', 'hr', 'manager', 'employee'),
  [param('id').isInt({ gt: 0 }).withMessage('Training id must be a positive integer')],
  validateRequest,
  trainingController.getTrainingById
);

router.put(
  '/training/:id',
  authorizeRoles('admin', 'hr'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Training id must be a positive integer'),
    body('course_name').optional().trim(),
    body('provider').optional().trim(),
    body('completed_at').optional().isISO8601().withMessage('completed_at must be a valid date'),
    body('certification_url').optional().trim().isURL().withMessage('certification_url must be a valid URL'),
  ],
  validateRequest,
  trainingController.updateTraining
);

router.delete(
  '/training/:id',
  authorizeRoles('admin', 'hr'),
  [param('id').isInt({ gt: 0 }).withMessage('Training id must be a positive integer')],
  validateRequest,
  trainingController.deleteTraining
);

module.exports = router;
