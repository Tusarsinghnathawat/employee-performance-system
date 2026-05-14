const developmentPlanService = require('../services/developmentPlanService');

const createDevelopmentPlan = async (req, res) => {
  try {
    const plan = {
      employee_id: Number(req.body.employee_id),
      goal: req.body.goal,
      status: req.body.status,
      target_date: req.body.target_date,
      progress_percentage: Number(req.body.progress_percentage || 0),
    };

    const created = await developmentPlanService.createPlan(plan);
    res.status(201).json({ message: 'Development plan created successfully', plan: created });
  } catch (err) {
    console.error('Error creating development plan:', err.message);
    res.status(500).json({ error: 'Failed to create development plan' });
  }
};

const getDevelopmentPlans = async (req, res) => {
  try {
    const plans = await developmentPlanService.getPlans({
      status: req.query.status,
      employee_id: req.query.employee,
    });
    res.json({ plans });
  } catch (err) {
    console.error('Error fetching development plans:', err.message);
    res.status(500).json({ error: 'Failed to fetch development plans' });
  }
};

const getDevelopmentPlanById = async (req, res) => {
  try {
    const plan = await developmentPlanService.getPlanById(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Development plan not found' });
    }
    res.json({ plan });
  } catch (err) {
    console.error('Error fetching development plan:', err.message);
    res.status(500).json({ error: 'Failed to fetch development plan' });
  }
};

const updateDevelopmentPlan = async (req, res) => {
  try {
    const updated = await developmentPlanService.updatePlan(req.params.id, {
      goal: req.body.goal,
      status: req.body.status,
      target_date: req.body.target_date,
      progress_percentage: req.body.progress_percentage !== undefined ? Number(req.body.progress_percentage) : undefined,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Development plan not found or no changes provided' });
    }
    res.json({ message: 'Development plan updated successfully', plan: updated });
  } catch (err) {
    console.error('Error updating development plan:', err.message);
    res.status(500).json({ error: 'Failed to update development plan' });
  }
};

const deleteDevelopmentPlan = async (req, res) => {
  try {
    await developmentPlanService.deletePlan(req.params.id);
    res.json({ message: 'Development plan deleted successfully' });
  } catch (err) {
    console.error('Error deleting development plan:', err.message);
    res.status(500).json({ error: 'Failed to delete development plan' });
  }
};

const getPlansByEmployee = async (req, res) => {
  try {
    const employeeId = Number(req.params.employeeId);
    const userId = Number(req.user.id);

    if (req.user.role === 'employee' && employeeId !== userId) {
      return res.status(403).json({ error: 'Forbidden: access to this employee plans is denied' });
    }

    const plans = await developmentPlanService.getPlansByEmployee({
      employee_id: employeeId,
      status: req.query.status,
    });
    res.json({ plans });
  } catch (err) {
    console.error('Error fetching employee plans:', err.message);
    res.status(500).json({ error: 'Failed to fetch employee plans' });
  }
};

module.exports = {
  createDevelopmentPlan,
  getDevelopmentPlans,
  getDevelopmentPlanById,
  updateDevelopmentPlan,
  deleteDevelopmentPlan,
  getPlansByEmployee,
};