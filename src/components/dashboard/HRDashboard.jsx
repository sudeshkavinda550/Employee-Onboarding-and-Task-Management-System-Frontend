import React, { useState, useEffect } from 'react';
import { 
  analyticsApi, 
  employeeApi 
} from '../../api';
import {
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import AnalyticsChart from '../hr/AnalyticsChart';

const HRDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    onboardingInProgress: 0,
    onboardingCompleted: 0,
    overdueTasks: 0,
    averageCompletionDays: 0,
    completionRate: 0
  });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, employeesResponse] = await Promise.all([
        analyticsApi.getDashboardStats(),
        employeeApi.getAllEmployees()
      ]);

      setStats(statsResponse.data || {
        totalEmployees: 0,
        onboardingInProgress: 0,
        onboardingCompleted: 0,
        overdueTasks: 0,
        averageCompletionDays: 0,
        completionRate: 0
      });
      
      setRecentEmployees((employeesResponse.data || []).slice(0, 5));
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
          <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Overview of onboarding activities and employee progress
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={UserGroupIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Onboarding Completed"
          value={stats.onboardingCompleted}
          icon={CheckCircleIcon}
          color="bg-green-500"
          description={`${stats.completionRate}% completion rate`}
        />
        <StatCard
          title="In Progress"
          value={stats.onboardingInProgress}
          icon={ClockIcon}
          color="bg-yellow-500"
        />
        <StatCard
          title="Overdue Tasks"
          value={stats.overdueTasks}
          icon={ExclamationCircleIcon}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          type="bar"
          title="Onboarding Completion Rate"
          data={{
            labels: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'],
            datasets: [{
              label: 'Completion Rate (%)',
              data: [95, 78, 82, 100, 89],
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1
            }]
          }}
        />
        <AnalyticsChart
          type="pie"
          title="Task Status Distribution"
          data={{
            labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
            datasets: [{
              data: [45, 25, 20, 10],
              backgroundColor: [
                'rgba(34, 197, 94, 0.5)',
                'rgba(59, 130, 246, 0.5)',
                'rgba(251, 191, 36, 0.5)',
                'rgba(239, 68, 68, 0.5)'
              ],
              borderColor: [
                'rgb(34, 197, 94)',
                'rgb(59, 130, 246)',
                'rgb(251, 191, 36)',
                'rgb(239, 68, 68)'
              ],
              borderWidth: 1
            }]
          }}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Onboarding Activities</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentEmployees.map((employee) => (
            <div key={employee.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {employee.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{employee.name || 'Unknown'}</h3>
                    <p className="text-sm text-gray-600">{employee.position || 'No position'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {employee.progressPercentage || 0}%
                    </p>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full"
                        style={{ width: `${employee.progressPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    employee.onboardingStatus === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : employee.onboardingStatus === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {employee.onboardingStatus?.replace('_', ' ') || 'unknown'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {recentEmployees.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              No employee data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;