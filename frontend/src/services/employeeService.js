import api from '../api/axios.js'

export const getEmployees = () => api.get('/api/employees').then((response) => response.data)
export const getEmployeeById = (id) => api.get(`/api/employees/${id}`).then((response) => response.data)
export const createEmployee = (payload) => api.post('/api/employees', payload).then((response) => response.data)
export const updateEmployee = (id, payload) => api.put(`/api/employees/${id}`, payload).then((response) => response.data)
export const deleteEmployee = (id) => api.delete(`/api/employees/${id}`).then((response) => response.data)
