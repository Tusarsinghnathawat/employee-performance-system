import api from '../api/axios.js'

export const getReviews = () => api.get('/api/reviews').then((response) => response.data)

export const getReviewById = (id) => api.get(`/api/reviews/${id}`).then((response) => response.data)

export const getReviewsByEmployee = (employeeId) =>
  api.get(`/api/reviews/employee/${employeeId}`).then((response) => response.data)

export const createReview = (payload) =>
  api.post('/api/reviews', payload).then((response) => response.data)

export const updateReview = (id, payload) =>
  api.put(`/api/reviews/${id}`, payload).then((response) => response.data)

export const deleteReview = (id) => api.delete(`/api/reviews/${id}`).then((response) => response.data)
