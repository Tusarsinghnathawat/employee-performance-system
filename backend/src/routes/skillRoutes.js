const express = require('express');
const { body, query, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/rbacMiddleware');
const validateRequest = require('../middleware/validateRequest');
const skillController = require('../controllers/skillController');

const router = express.Router();
router.use(authMiddleware);

router.post(
  '/skills',
  authorizeRoles('admin', 'hr'),
  [
    body('name').trim().notEmpty().withMessage('name is required'),
    body('category').optional().trim(),
  ],
  validateRequest,
  skillController.createSkill
);

router.get(
  '/skills',
  authorizeRoles('admin', 'hr', 'manager', 'employee'),
  [
    query('name').optional().trim(),
    query('category').optional().trim(),
  ],
  validateRequest,
  skillController.getSkills
);

router.get(
  '/skills/:id',
  authorizeRoles('admin', 'hr', 'manager', 'employee'),
  [param('id').isInt({ gt: 0 }).withMessage('Skill id must be a positive integer')],
  validateRequest,
  skillController.getSkillById
);

router.put(
  '/skills/:id',
  authorizeRoles('admin', 'hr'),
  [
    param('id').isInt({ gt: 0 }).withMessage('Skill id must be a positive integer'),
    body('name').optional().trim(),
    body('category').optional().trim(),
  ],
  validateRequest,
  skillController.updateSkill
);

router.delete(
  '/skills/:id',
  authorizeRoles('admin'),
  [param('id').isInt({ gt: 0 }).withMessage('Skill id must be a positive integer')],
  validateRequest,
  skillController.deleteSkill
);

router.post(
  '/employees/:employeeId/skills',
  authorizeRoles('admin', 'hr', 'manager'),
  [
    param('employeeId').isInt({ gt: 0 }).withMessage('employeeId must be a positive integer'),
    body('skill_id').isInt({ gt: 0 }).withMessage('skill_id must be a positive integer'),
    body('proficiency_level').isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']).withMessage('proficiency_level must be Beginner, Intermediate, Advanced, or Expert'),
  ],
  validateRequest,
  skillController.assignSkill
);

router.get(
  '/employees/:employeeId/skills',
  authorizeRoles('admin', 'hr', 'manager', 'employee'),
  [param('employeeId').isInt({ gt: 0 }).withMessage('employeeId must be a positive integer')],
  validateRequest,
  skillController.getEmployeeSkills
);

router.put(
  '/employees/:employeeId/skills/:skillId',
  authorizeRoles('admin', 'hr', 'manager'),
  [
    param('employeeId').isInt({ gt: 0 }).withMessage('employeeId must be a positive integer'),
    param('skillId').isInt({ gt: 0 }).withMessage('skillId must be a positive integer'),
    body('proficiency_level').isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']).withMessage('proficiency_level must be Beginner, Intermediate, Advanced, or Expert'),
  ],
  validateRequest,
  skillController.updateEmployeeSkill
);

router.delete(
  '/employees/:employeeId/skills/:skillId',
  authorizeRoles('admin', 'hr', 'manager'),
  [
    param('employeeId').isInt({ gt: 0 }).withMessage('employeeId must be a positive integer'),
    param('skillId').isInt({ gt: 0 }).withMessage('skillId must be a positive integer'),
  ],
  validateRequest,
  skillController.deleteEmployeeSkill
);

module.exports = router;
