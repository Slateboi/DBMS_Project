import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export const studentAPI = {
  getAll: () => api.get('/students'),
  getOne: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

export const departmentAPI = {
  getAll: () => api.get('/departments'),
  create: (data) => api.post('/departments', data),
  delete: (id) => api.delete(`/departments/${id}`),
};

export const courseAPI = {
  getAll: () => api.get('/courses'),
  create: (data) => api.post('/courses', data),
  delete: (id) => api.delete(`/courses/${id}`),
};

export const enrollmentAPI = {
  getByStudent: (id) => api.get(`/enrollments/${id}`),
  create: (data) => api.post('/enrollments', data),
  delete: (studentId, courseId) => api.delete(`/enrollments/${studentId}/${courseId}`),
};

export const gradeAPI = {
  getByStudent: (id) => api.get(`/grades/${id}`),
  create: (data) => api.post('/grades', data),
  update: (studentId, courseId, semesterNo, data) => 
    api.put(`/grades/${studentId}/${courseId}/${semesterNo}`, data),
};

export default api;