const trainingService = require('../services/trainingService');

const createTraining = async (req, res) => {
  try {
    const created = await trainingService.createTraining({
      employee_id: Number(req.body.employee_id),
      course_name: req.body.course_name,
      provider: req.body.provider,
      completed_at: req.body.completed_at,
      certification_url: req.body.certification_url,
    });
    res.status(201).json({ message: 'Training record created successfully', training: created });
  } catch (err) {
    console.error('Error creating training record:', err.message);
    res.status(500).json({ error: 'Failed to create training record' });
  }
};

const getTrainings = async (req, res) => {
  try {
    const trainings = await trainingService.getTrainings({
      course_name: req.query.course_name,
      provider: req.query.provider,
      completed_at: req.query.completed_at,
    });
    res.json({ trainings });
  } catch (err) {
    console.error('Error fetching trainings:', err.message);
    res.status(500).json({ error: 'Failed to fetch trainings' });
  }
};

const getTrainingById = async (req, res) => {
  try {
    const training = await trainingService.getTrainingById(req.params.id);
    if (!training) {
      return res.status(404).json({ error: 'Training record not found' });
    }
    res.json({ training });
  } catch (err) {
    console.error('Error fetching training record:', err.message);
    res.status(500).json({ error: 'Failed to fetch training record' });
  }
};

const updateTraining = async (req, res) => {
  try {
    const updated = await trainingService.updateTraining(req.params.id, {
      course_name: req.body.course_name,
      provider: req.body.provider,
      completed_at: req.body.completed_at,
      certification_url: req.body.certification_url,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Training record not found or no changes provided' });
    }
    res.json({ message: 'Training record updated successfully', training: updated });
  } catch (err) {
    console.error('Error updating training record:', err.message);
    res.status(500).json({ error: 'Failed to update training record' });
  }
};

const deleteTraining = async (req, res) => {
  try {
    await trainingService.deleteTraining(req.params.id);
    res.json({ message: 'Training record deleted successfully' });
  } catch (err) {
    console.error('Error deleting training record:', err.message);
    res.status(500).json({ error: 'Failed to delete training record' });
  }
};

const getTrainingsByEmployee = async (req, res) => {
  try {
    const employeeId = Number(req.params.employeeId);
    const userId = Number(req.user.id);

    if (req.user.role === 'employee' && employeeId !== userId) {
      return res.status(403).json({ error: 'Forbidden: access to this employee training history is denied' });
    }

    const trainings = await trainingService.getTrainingsByEmployee({
      employee_id: employeeId,
      course_name: req.query.course_name,
      provider: req.query.provider,
      completed_at: req.query.completed_at,
    });
    res.json({ trainings });
  } catch (err) {
    console.error('Error fetching employee training:', err.message);
    res.status(500).json({ error: 'Failed to fetch employee training' });
  }
};

module.exports = {
  createTraining,
  getTrainings,
  getTrainingById,
  updateTraining,
  deleteTraining,
  getTrainingsByEmployee,
};