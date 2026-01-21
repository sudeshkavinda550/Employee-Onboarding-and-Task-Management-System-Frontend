import React, { useState, useEffect } from 'react';
import { 
  analyticsApi, 
  employeeApi 
} from '../../api';
import {
  UserGroupIcon,
  CheckCircleIcon,
  CogIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEmployees: 0,
    totalTemplates: 0,
    systemHealth: 100
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersResponse, templatesResponse] = await Promise.all([
        employeeApi.getAllEmployees(),
        { data: { count: 12 } }
      ]);

      const employees = usersResponse.data || [];
      
      setStats({
        totalUsers: employees.length + 5,
        activeEmployees: employees.filter(e => e.status === 'active').length,
        totalTemplates: 12,
        systemHealth: 100
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            System overview and administration
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
            Export Reports
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
            System Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={UserGroupIcon}
          color="bg-blue-500"
          description="Employees + HR + Admins"
        />
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon={CheckCircleIcon}
          color="bg-green-500"
          description="Currently onboarding"
        />
        <StatCard
          title="Onboarding Templates"
          value={stats.totalTemplates}
          icon={DocumentTextIcon}
          color="bg-purple-500"
          description="Custom templates"
        />
        <StatCard
          title="System Health"
          value={`${stats.systemHealth}%`}
          icon={ShieldCheckIcon}
          color="bg-indigo-500"
          description="All systems operational"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent System Activity</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {[
              { user: 'John Doe', action: 'Completed onboarding', time: '2 hours ago' },
              { user: 'HR Team', action: 'Created new template', time: '4 hours ago' },
              { user: 'System', action: 'Nightly backup completed', time: '6 hours ago' },
              { user: 'Jane Smith', action: 'Uploaded documents', time: '1 day ago' },
              { user: 'Admin', action: 'Added new HR user', time: '1 day ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <CogIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50">
              <UserGroupIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Manage Users</p>
            </button>
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50">
              <DocumentTextIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Create Template</p>
            </button>
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50">
              <ChartBarIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">View Analytics</p>
            </button>
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50">
              <ShieldCheckIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">System Settings</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;