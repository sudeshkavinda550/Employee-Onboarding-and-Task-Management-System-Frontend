import apiClient from './apiClient';

/**
 * Dashboard API endpoints
 */
export const dashboardApi = {
  /**
   * Get employee dashboard data
   * @returns {Promise} Employee dashboard with progress, tasks, documents
   */
  getEmployeeDashboard: () => apiClient.get('/employee'),

  /**
   * Get HR dashboard data
   * @returns {Promise} HR dashboard with stats and recent employees
   */
  getHRDashboard: () => apiClient.get('/hr'),

  /**
   * Get admin dashboard data
   * @returns {Promise} Admin dashboard with stats and analytics
   */
  getAdminDashboard: () => apiClient.get('/admin'),
};