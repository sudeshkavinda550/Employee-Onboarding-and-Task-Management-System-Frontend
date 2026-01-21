import axiosInstance from './axios';

export const taskApi = {
  getMyTasks: () => axiosInstance.get('/tasks/my-tasks'),
  getTaskById: (taskId) => axiosInstance.get(`/tasks/${taskId}`),
  updateTaskStatus: (taskId, data) => axiosInstance.put(`/tasks/${taskId}/status`, data),
  uploadTaskDocument: (taskId, formData) => 
    axiosInstance.post(`/tasks/${taskId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getTaskProgress: () => axiosInstance.get('/tasks/progress'),
  markTaskAsRead: (taskId) => axiosInstance.post(`/tasks/${taskId}/mark-read`),
  getOverdueTasks: () => axiosInstance.get('/tasks/overdue'),
  
  // HR endpoints
  getAllTasks: () => axiosInstance.get('/hr/tasks'),
  getEmployeeTasks: (employeeId) => axiosInstance.get(`/hr/employees/${employeeId}/tasks`),
  assignTask: (data) => axiosInstance.post('/hr/tasks/assign', data),
  updateTask: (taskId, data) => axiosInstance.put(`/hr/tasks/${taskId}`, data),
  deleteTask: (taskId) => axiosInstance.delete(`/hr/tasks/${taskId}`),
  getTaskAnalytics: () => axiosInstance.get('/hr/tasks/analytics'),
};