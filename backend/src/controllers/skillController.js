const skillService = require('../services/skillService');

const createSkill = async (req, res) => {
  try {
    const created = await skillService.createSkill({
      name: req.body.name,
      category: req.body.category,
    });
    res.status(201).json({ message: 'Skill created successfully', skill: created });
  } catch (err) {
    console.error('Error creating skill:', err.message);
    res.status(500).json({ error: 'Failed to create skill' });
  }
};

const getSkills = async (req, res) => {
  try {
    const skills = await skillService.getSkills({
      name: req.query.name,
      category: req.query.category,
    });
    res.json({ skills });
  } catch (err) {
    console.error('Error fetching skills:', err.message);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
};

const getSkillById = async (req, res) => {
  try {
    const skill = await skillService.getSkillById(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json({ skill });
  } catch (err) {
    console.error('Error fetching skill:', err.message);
    res.status(500).json({ error: 'Failed to fetch skill' });
  }
};

const updateSkill = async (req, res) => {
  try {
    const updated = await skillService.updateSkill(req.params.id, {
      name: req.body.name,
      category: req.body.category,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Skill not found or no changes provided' });
    }

    res.json({ message: 'Skill updated successfully', skill: updated });
  } catch (err) {
    console.error('Error updating skill:', err.message);
    res.status(500).json({ error: 'Failed to update skill' });
  }
};

const deleteSkill = async (req, res) => {
  try {
    await skillService.deleteSkill(req.params.id);
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error('Error deleting skill:', err.message);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
};

const assignSkill = async (req, res) => {
  try {
    const assigned = await skillService.assignSkill({
      employee_id: Number(req.params.employeeId),
      skill_id: Number(req.body.skill_id),
      proficiency_level: req.body.proficiency_level,
    });
    res.status(201).json({ message: 'Skill assigned successfully', assignment: assigned });
  } catch (err) {
    console.error('Error assigning skill:', err.message);
    res.status(500).json({ error: 'Failed to assign skill' });
  }
};

const getEmployeeSkills = async (req, res) => {
  try {
    const employeeId = Number(req.params.employeeId);
    const userId = Number(req.user.id);

    if (req.user.role === 'employee' && employeeId !== userId) {
      return res.status(403).json({ error: 'Forbidden: access to this employee skills is denied' });
    }

    const skills = await skillService.getEmployeeSkills({
      employee_id: employeeId,
      category: req.query.category,
      name: req.query.name,
    });
    res.json({ skills });
  } catch (err) {
    console.error('Error fetching employee skills:', err.message);
    res.status(500).json({ error: 'Failed to fetch employee skills' });
  }
};

const updateEmployeeSkill = async (req, res) => {
  try {
    const updated = await skillService.updateEmployeeSkill({
      employee_id: Number(req.params.employeeId),
      skill_id: Number(req.params.skillId),
      proficiency_level: req.body.proficiency_level,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Employee skill not found' });
    }

    res.json({ message: 'Employee skill updated successfully', assignment: updated });
  } catch (err) {
    console.error('Error updating employee skill:', err.message);
    res.status(500).json({ error: 'Failed to update employee skill' });
  }
};

const deleteEmployeeSkill = async (req, res) => {
  try {
    await skillService.deleteEmployeeSkill({
      employee_id: Number(req.params.employeeId),
      skill_id: Number(req.params.skillId),
    });
    res.json({ message: 'Employee skill removed successfully' });
  } catch (err) {
    console.error('Error removing employee skill:', err.message);
    res.status(500).json({ error: 'Failed to remove employee skill' });
  }
};

module.exports = {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  assignSkill,
  getEmployeeSkills,
  updateEmployeeSkill,
  deleteEmployeeSkill,
};