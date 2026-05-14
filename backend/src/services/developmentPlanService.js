const db = require('../config/db');

const createPlan = async ({ employee_id, goal, status, target_date, progress_percentage }) => {
  const result = await db.query(
    `INSERT INTO development_plans (employee_id, goal, status, target_date, progress_percentage)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [employee_id, goal, status, target_date || null, progress_percentage || 0]
  );
  return result.rows[0];
};

const getPlans = async ({ status, employee_id }) => {
  const conditions = [];
  const values = [];
  let idx = 1;
  let query = `SELECT * FROM development_plans`;

  if (status) {
    conditions.push(`status ILIKE $${idx}`);
    values.push(`%${status}%`);
    idx++;
  }
  if (employee_id) {
    conditions.push(`employee_id = $${idx}`);
    values.push(Number(employee_id));
    idx++;
  }

  if (conditions.length) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ' ORDER BY created_at DESC';
  const result = await db.query(query, values);
  return result.rows;
};

const getPlanById = async (id) => {
  const result = await db.query('SELECT * FROM development_plans WHERE id = $1', [id]);
  return result.rows[0];
};

const updatePlan = async (id, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.goal !== undefined) {
    fields.push(`goal = $${idx}`);
    values.push(updates.goal);
    idx++;
  }
  if (updates.status !== undefined) {
    fields.push(`status = $${idx}`);
    values.push(updates.status);
    idx++;
  }
  if (updates.target_date !== undefined) {
    fields.push(`target_date = $${idx}`);
    values.push(updates.target_date);
    idx++;
  }
  if (updates.progress_percentage !== undefined) {
    fields.push(`progress_percentage = $${idx}`);
    values.push(updates.progress_percentage);
    idx++;
  }

  if (!fields.length) {
    return null;
  }

  values.push(id);
  const query = `UPDATE development_plans SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
  const result = await db.query(query, values);
  return result.rows[0];
};

const deletePlan = async (id) => {
  await db.query('DELETE FROM development_plans WHERE id = $1', [id]);
};

const getPlansByEmployee = async ({ employee_id, status }) => {
  return getPlans({ employee_id, status });
};

module.exports = {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  getPlansByEmployee,
};
