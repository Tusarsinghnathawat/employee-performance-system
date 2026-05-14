const express = require('express');
const { body, query, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');
const validateRequest = require('../middleware/validateRequest');
const reviewController = require('../controllers/reviewController');

const router = express.Router();
router.use(authMiddleware);

router.post(
  '/reviews',
  authorizeRoles('admin', 'hr', 'manager'),
  [
    body('employee_id').isInt({ gt: 0 }).withMessage('employee_id must be a positive integer'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('rating must be between 1 and 5'),
    body('feedback').trim().notEmpty().withMessage('feedback is required'),
    body('review_period').trim().notEmpty().withMessage('review_period is required'),
  ],
  validateRequest,
  reviewController.createReview
);

router.get(
  '/reviews',
  authorizeRoles('admin', 'hr', 'manager'),
  [
    query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('rating must be between 1 and 5'),
    query('review_period').optional().trim(),
    query('employee').optional().isInt({ gt: 0 }).withMessage('employee must be a positive integer'),
  ],
  validateRequest,
  reviewController.getReviews
);

router.get(
  '/reviews/employee/:employeeId',
  authorizeRoles('admin', 'hr', 'employee'),
  [param('employeeId').isInt({ gt: 0 }).withMessage('employeeId must be a positive integer')],
  validateRequest,
  reviewController.getReviewsByEmployee
);

router.get(
  '/reviews/:id',
  authorizeRoles('admin', 'hr', 'manager', 'employee'),
  [param('id').isInt({ gt: 0 }).withMessage('Review id must be a positive integer')],
  validateRequest,
  reviewController.getReviewById
);

router.put(
  '/reviews/:id',
  authorizeRoles('admin', 'hr', 'manager'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Review id must be a positive integer'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('rating must be between 1 and 5'),
    body('feedback').optional().trim(),
    body('review_period').optional().trim(),
  ],
  validateRequest,
  reviewController.updateReview
);

router.delete(
  '/reviews/:id',
  authorizeRoles('admin'),
  [param('id').isInt({ gt: 0 }).withMessage('Review id must be a positive integer')],
  validateRequest,
  reviewController.deleteReview
);

module.exports = router;
