const db = require('../config/db');

const createTraining = async ({ employee_id, course_name, provider, completed_at, certification_url }) => {
  const result = await db.query(
    `INSERT INTO training_records (employee_id, course_name, provider, completed_at, certification_url)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [employee_id, course_name, provider || null, completed_at || null, certification_url || null]
  );
  return result.rows[0];
};

const getTrainings = async ({ employee_id, course_name, provider, completed_at }) => {
  const conditions = [];
  const values = [];
  let idx = 1;
  let query = 'SELECT * FROM training_records';

  if (employee_id) {
    conditions.push(`employee_id = $${idx}`);
    values.push(Number(employee_id));
    idx++;
  }
  if (course_name) {
    conditions.push(`course_name ILIKE $${idx}`);
    values.push(`%${course_name}%`);
    idx++;
  }
  if (provider) {
    conditions.push(`provider ILIKE $${idx}`);
    values.push(`%${provider}%`);
    idx++;
  }
  if (completed_at) {
    conditions.push(`completed_at = $${idx}`);
    values.push(completed_at);
    idx++;
  }

  if (conditions.length) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ' ORDER BY completed_at DESC NULLS LAST';
  const result = await db.query(query, values);
  return result.rows;
};

const getTrainingById = async (id) => {
  const result = await db.query('SELECT * FROM training_records WHERE id = $1', [id]);
  return result.rows[0];
};

const updateTraining = async (id, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.course_name !== undefined) {
    fields.push(`course_name = $${idx}`);
    values.push(updates.course_name);
    idx++;
  }
  if (updates.provider !== undefined) {
    fields.push(`provider = $${idx}`);
    values.push(updates.provider);
    idx++;
  }
  if (updates.completed_at !== undefined) {
    fields.push(`completed_at = $${idx}`);
    values.push(updates.completed_at);
    idx++;
  }
  if (updates.certification_url !== undefined) {
    fields.push(`certification_url = $${idx}`);
    values.push(updates.certification_url);
    idx++;
  }

  if (!fields.length) {
    return null;
  }

  values.push(id);
  const query = `UPDATE training_records SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
  const result = await db.query(query, values);
  return result.rows[0];
};

const deleteTraining = async (id) => {
  await db.query('DELETE FROM training_records WHERE id = $1', [id]);
};

const getTrainingsByEmployee = async ({ employee_id, course_name, provider, completed_at }) => {
  return getTrainings({ employee_id, course_name, provider, completed_at });
};

module.exports = {
  createTraining,
  getTrainings,
  getTrainingById,
  updateTraining,
  deleteTraining,
  getTrainingsByEmployee,
};
