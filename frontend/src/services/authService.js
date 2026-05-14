import api from '../api/axios.js'

export const loginUser = (payload) => api.post('/api/auth/login', payload).then((response) => response.data)
export const registerUser = (payload) => api.post('/api/auth/register', payload).then((response) => response.data)
export const fetchCurrentUser = () => api.get('/api/auth/me').then((response) => response.data)
