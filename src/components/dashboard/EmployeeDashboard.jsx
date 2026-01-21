import React, { useState, useEffect } from 'react';
import { employeeApi, taskApi } from '../../api';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    progress: { completed: 0, total: 0, percentage: 0 },
    pendingTasks: [],
    recentDocuments: [],
    overdueTasks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, tasksResponse, documentsResponse, overdueResponse] = await Promise.all([
        employeeApi.getDashboard(),
        taskApi.getMyTasks(),
        employeeApi.getDocuments(),
        taskApi.getOverdueTasks()
      ]);

      setDashboardData({
        progress: dashboardResponse.data.progress || { completed: 0, total: 0, percentage: 0 },
        pendingTasks: (tasksResponse.data || []).filter(task => task.status !== 'completed').slice(0, 5),
        recentDocuments: (documentsResponse.data || []).slice(0, 3),
        overdueTasks: overdueResponse.data || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-600">
          Welcome back! Your onboarding progress: {dashboardData.progress.percentage}%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Completion Rate"
          value={`${dashboardData.progress.percentage}%`}
          icon={ChartBarIcon}
          color="bg-green-500"
        />
        <StatCard
          title="Completed Tasks"
          value={`${dashboardData.progress.completed}/${dashboardData.progress.total}`}
          icon={CheckCircleIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Pending Tasks"
          value={dashboardData.pendingTasks.length}
          icon={ClockIcon}
          color="bg-yellow-500"
        />
        <StatCard
          title="Documents"
          value={dashboardData.recentDocuments.length}
          icon={DocumentTextIcon}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Tasks</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {dashboardData.pendingTasks.map((task) => (
              <div key={task.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded">
                    Pending
                  </span>
                </div>
              </div>
            ))}
            {dashboardData.pendingTasks.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                No pending tasks
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {dashboardData.recentDocuments.map((doc) => (
              <div key={doc.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{doc.filename}</h3>
                    <p className="text-sm text-gray-600">
                      Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    doc.status === 'approved' 
                      ? 'text-green-800 bg-green-100'
                      : doc.status === 'rejected'
                      ? 'text-red-800 bg-red-100'
                      : 'text-yellow-800 bg-yellow-100'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
            {dashboardData.recentDocuments.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                No documents uploaded
              </div>
            )}
          </div>
        </div>
      </div>

      {dashboardData.overdueTasks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-sm font-medium text-red-800">Overdue Tasks</h3>
          </div>
          <ul className="mt-2 text-sm text-red-700">
            {dashboardData.overdueTasks.map((task) => (
              <li key={task.id} className="mt-1">
                {task.title} - Due {new Date(task.dueDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;