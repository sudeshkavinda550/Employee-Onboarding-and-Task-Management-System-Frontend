import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // DEBUG: Log outgoing requests
    console.log('API Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // DEBUG: Log successful responses
    console.log('API Success:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // ENHANCED ERROR LOGGING
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      // IMPORTANT: Show validation errors
      errors: error.response?.data?.errors || null,
      validationErrors: error.response?.data?.validationErrors || null,
      data: error.response?.data || null,
    };
    
    console.error('API Error:', errorDetails);
    
    // Show detailed validation errors in console
    if (error.response?.status === 400 && error.response?.data?.errors) {
      console.error('Validation Errors:', error.response.data.errors);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Template API
export const templateAPI = {
  getAll: (params = {}) => {
    return api.get('/templates', { params });
  },
  
  getById: (id) => {
    return api.get(`/templates/${id}`);
  },
  
  create: (data) => {
    // DEBUG: Log the exact data being sent
    console.log('Creating template with data:', JSON.stringify(data, null, 2));
    return api.post('/templates', data);
  },
  
  update: (id, data) => {
    console.log('🔧 Updating template with data:', JSON.stringify(data, null, 2));
    return api.put(`/templates/${id}`, data);
  },
  
  delete: (id) => {
    return api.delete(`/templates/${id}`);
  },
  
  duplicate: (id) => {
    return api.post(`/templates/${id}/duplicate`);
  },
  
  getTasks: (id) => {
    return api.get(`/templates/${id}/tasks`);
  },
  
  getEmployeesForAssignment: () => {
    return api.get('/templates/employees/for-assignment');
  },
  
  assignToEmployee: (templateId, employeeId) => {
    return api.post(`/templates/${templateId}/assign/${employeeId}`);
  },
  
  getTemplateAssignments: (id) => {
    return api.get(`/templates/${id}/assignments`);
  },
  
  getAllEmployeesProgress: () => {
    return api.get('/templates/employees/progress');
  },
  
  getTemplateAnalytics: (id) => {
    return api.get(`/templates/${id}/analytics`);
  },
};

// Document API
export const documentAPI = {
  upload: (formData) => {
    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getByTask: (taskId) => {
    return api.get(`/documents/task/${taskId}`);
  },
  
  getByEmployee: (employeeId) => {
    return api.get(`/documents/employee/${employeeId}`);
  },
  
  review: (id, data) => {
    return api.put(`/documents/${id}/review`, data);
  },
  
  delete: (id) => {
    return api.delete(`/documents/${id}`);
  },
  
  download: (id) => {
    return api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
  },
};

// Employee Task API
export const employeeTaskAPI = {
  getMyTasks: () => {
    return api.get('/employee-tasks/my-tasks');
  },
  
  getMyProgress: () => {
    return api.get('/employee-tasks/my-progress');
  },
  
  updateTaskStatus: (id, status) => {
    return api.put(`/employee-tasks/${id}/status`, { status });
  },
  
  getEmployeeTasks: (employeeId) => {
    return api.get(`/employee-tasks/${employeeId}/tasks`);
  },
  
  getEmployeeProgress: (employeeId) => {
    return api.get(`/employee-tasks/${employeeId}/progress`);
  },
};

export default api;