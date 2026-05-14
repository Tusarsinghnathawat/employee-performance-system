const db = require('../config/db');

const createReview = async ({ employee_id, reviewer_id, rating, feedback, review_period }) => {
  const result = await db.query(
    `INSERT INTO reviews (employee_id, reviewer_id, rating, feedback, review_period)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [employee_id, reviewer_id, rating, feedback, review_period]
  );
  return result.rows[0];
};

const getReviews = async ({ rating, review_period, employee_id }) => {
  const conditions = [];
  const values = [];
  let idx = 1;

  let query = `SELECT r.*, e.user_id AS employee_user_id, u.name AS reviewer_name, u.role AS reviewer_role
    FROM reviews r
    JOIN employees e ON e.id = r.employee_id
    JOIN users u ON u.id = r.reviewer_id`;

  if (rating) {
    conditions.push(`r.rating = $${idx}`);
    values.push(Number(rating));
    idx++;
  }
  if (review_period) {
    conditions.push(`r.review_period ILIKE $${idx}`);
    values.push(`%${review_period}%`);
    idx++;
  }
  if (employee_id) {
    conditions.push(`r.employee_id = $${idx}`);
    values.push(Number(employee_id));
    idx++;
  }

  if (conditions.length) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ' ORDER BY r.created_at DESC';
  const result = await db.query(query, values);
  return result.rows;
};

const getReviewById = async (id) => {
  const result = await db.query('SELECT * FROM reviews WHERE id = $1', [id]);
  return result.rows[0];
};

const updateReview = async (id, updates) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.rating !== undefined) {
    fields.push(`rating = $${idx}`);
    values.push(updates.rating);
    idx++;
  }
  if (updates.feedback !== undefined) {
    fields.push(`feedback = $${idx}`);
    values.push(updates.feedback);
    idx++;
  }
  if (updates.review_period !== undefined) {
    fields.push(`review_period = $${idx}`);
    values.push(updates.review_period);
    idx++;
  }

  if (!fields.length) {
    return null;
  }

  values.push(id);
  const query = `UPDATE reviews SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
  const result = await db.query(query, values);
  return result.rows[0];
};

const deleteReview = async (id) => {
  await db.query('DELETE FROM reviews WHERE id = $1', [id]);
};

const getReviewsByEmployee = async ({ employee_id, rating, review_period }) => {
  return getReviews({ employee_id, rating, review_period });
};

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByEmployee,
};
