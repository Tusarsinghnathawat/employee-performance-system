const reviewService = require('../services/reviewService');

const createReview = async (req, res) => {
  try {
    const review = {
      employee_id: Number(req.body.employee_id),
      reviewer_id: Number(req.user.id),
      rating: Number(req.body.rating),
      feedback: req.body.feedback,
      review_period: req.body.review_period,
    };

    const created = await reviewService.createReview(review);
    res.status(201).json({ message: 'Review created successfully', review: created });
  } catch (err) {
    console.error('Error creating review:', err.message);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getReviews({
      rating: req.query.rating,
      review_period: req.query.review_period,
      employee_id: req.query.employee,
    });
    res.json({ reviews });
  } catch (err) {
    console.error('Error fetching reviews:', err.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ review });
  } catch (err) {
    console.error('Error fetching review:', err.message);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
};

const updateReview = async (req, res) => {
  try {
    const updated = await reviewService.updateReview(req.params.id, {
      rating: req.body.rating,
      feedback: req.body.feedback,
      review_period: req.body.review_period,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Review not found or no changes provided' });
    }

    res.json({ message: 'Review updated successfully', review: updated });
  } catch (err) {
    console.error('Error updating review:', err.message);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err.message);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

const getReviewsByEmployee = async (req, res) => {
  try {
    const employeeId = Number(req.params.employeeId);
    const userId = Number(req.user.id);

    if (req.user.role === 'employee' && employeeId !== userId) {
      return res.status(403).json({ error: 'Forbidden: access to this employee reviews is denied' });
    }

    const reviews = await reviewService.getReviewsByEmployee({
      employee_id: employeeId,
      rating: req.query.rating,
      review_period: req.query.review_period,
    });
    res.json({ reviews });
  } catch (err) {
    console.error('Error fetching employee reviews:', err.message);
    res.status(500).json({ error: 'Failed to fetch employee reviews' });
  }
};

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByEmployee,
};