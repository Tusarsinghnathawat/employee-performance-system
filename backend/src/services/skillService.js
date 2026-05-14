const db = require('../config/db');

const createSkill = async ({ name, category }) => {
  const result = await db.query(
    'INSERT INTO skills (name, category) VALUES ($1, $2) RETURNING *',
    [name, category || null]
  );
  return result.rows[0];
};

const getSkills = async ({ name, category }) => {
  const conditions = [];
  const values = [];
  let idx = 1;
  let query = 'SELECT * FROM skills';

  if (name) {
    conditions.push(`name ILIKE $${idx}`);
    values.push(`%${name}%`);
    idx++;
  }
  if (category) {
    conditions.push(`category ILIKE $${idx}`);
    values.push(`%${category}%`);
    idx++;
  }

  if (conditions.length) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ' ORDER BY name';
  const result = await db.query(query, values);
  return result.rows;
};

const getSkillById = async (id) => {
  const result = await db.query('SELECT * FROM skills WHERE id = $1', [id]);
  return result.rows[0];
};

const updateSkill = async (id, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.name !== undefined) {
    fields.push(`name = $${idx}`);
    values.push(updates.name);
    idx++;
  }
  if (updates.category !== undefined) {
    fields.push(`category = $${idx}`);
    values.push(updates.category);
    idx++;
  }

  if (!fields.length) {
    return null;
  }

  values.push(id);
  const query = `UPDATE skills SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
  const result = await db.query(query, values);
  return result.rows[0];
};

const deleteSkill = async (id) => {
  await db.query('DELETE FROM skills WHERE id = $1', [id]);
};

const assignSkill = async ({ employee_id, skill_id, proficiency_level }) => {
  const result = await db.query(
    `INSERT INTO employee_skills (employee_id, skill_id, proficiency_level)
      VALUES ($1, $2, $3)
      ON CONFLICT (employee_id, skill_id) DO UPDATE SET proficiency_level = EXCLUDED.proficiency_level
      RETURNING *`,
    [employee_id, skill_id, proficiency_level]
  );
  return result.rows[0];
};

const getEmployeeSkills = async ({ employee_id, category, name }) => {
  const conditions = ['es.employee_id = $1'];
  const values = [Number(employee_id)];
  let idx = 2;

  let query = `SELECT es.employee_id, s.id AS skill_id, s.name, s.category, es.proficiency_level
    FROM employee_skills es
    JOIN skills s ON s.id = es.skill_id`;

  if (name) {
    conditions.push(`s.name ILIKE $${idx}`);
    values.push(`%${name}%`);
    idx++;
  }
  if (category) {
    conditions.push(`s.category ILIKE $${idx}`);
    values.push(`%${category}%`);
    idx++;
  }

  query += ` WHERE ${conditions.join(' AND ')}`;
  const result = await db.query(query, values);
  return result.rows;
};

const updateEmployeeSkill = async ({ employee_id, skill_id, proficiency_level }) => {
  const result = await db.query(
    `UPDATE employee_skills SET proficiency_level = $1 WHERE employee_id = $2 AND skill_id = $3 RETURNING *`,
    [proficiency_level, employee_id, skill_id]
  );
  return result.rows[0];
};

const deleteEmployeeSkill = async ({ employee_id, skill_id }) => {
  await db.query('DELETE FROM employee_skills WHERE employee_id = $1 AND skill_id = $2', [employee_id, skill_id]);
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
