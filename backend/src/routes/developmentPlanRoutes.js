const express = require('express');
const { body, query, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');
const validateRequest = require('../middleware/validateRequest');
const developmentPlanController = require('../controllers/developmentPlanController');

const router = express.Router();
router.use(authMiddleware);

router.post(
  '/development-plans',
  authorizeRoles('admin', 'hr', 'manager'),
  [
    body('employee_id').isInt({ gt: 0 }).withMessage('employee_id must be a positive integer'),
    body('goal').trim().notEmpty().withMessage('goal is required'),
    body('status').isIn(['Pending', 'In Progress', 'Completed']).withMessage('status must be Pending, In Progress, or Completed'),
    body('progress_percentage').optional().isInt({ min: 0, max: 100 }).withMessage('progress_percentage must be between 0 and 100'),
  ],
  validateRequest,
  developmentPlanController.createDevelopmentPlan
);

router.get(
  '/development-plans',
  authorizeRoles('admin', 'hr', 'manager'),
  [query('status').optional().isIn(['Pending', 'In Progress', 'Completed'])],
  validateRequest,
  developmentPlanController.getDevelopmentPlans
);

router.get(
  '/development-plans/employee/:employeeId',
  [param('employeeId').isInt({ gt: 0 }).withMessage('employeeId must be a positive integer')],
  validateRequest,
  developmentPlanController.getPlansByEmployee
);

router.get(
  '/development-plans/:id',
  authorizeRoles('admin', 'hr', 'manager', 'employee'),
  [param('id').isInt({ gt: 0 }).withMessage('Plan id must be a positive integer')],
  validateRequest,
  developmentPlanController.getDevelopmentPlanById
);

router.put(
  '/development-plans/:id',
  authorizeRoles('admin', 'hr', 'manager'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Plan id must be a positive integer'),
    body('goal').optional().trim(),
    body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('status must be Pending, In Progress, or Completed'),
    body('progress_percentage').optional().isInt({ min: 0, max: 100 }).withMessage('progress_percentage must be between 0 and 100'),
  ],
  validateRequest,
  developmentPlanController.updateDevelopmentPlan
);

router.delete(
  '/development-plans/:id',
  authorizeRoles('admin'),
  [param('id').isInt({ gt: 0 }).withMessage('Plan id must be a positive integer')],
  validateRequest,
  developmentPlanController.deleteDevelopmentPlan
);

module.exports = router;
