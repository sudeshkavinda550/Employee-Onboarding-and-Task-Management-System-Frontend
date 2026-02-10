import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  ArrowTrendingUpIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

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
  const [departmentData, setDepartmentData] = useState({
    labels: [],
    data: []
  });
  const [taskStatusData, setTaskStatusData] = useState({
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [chartReady, setChartReady] = useState(false);

  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.async = true;
    script.onload = () => {
      console.log('Chart.js loaded successfully');
      setChartReady(true);
    };
    script.onerror = () => {
      console.error('Failed to load Chart.js');
      setError('Failed to load chart library');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!analyticsApi) {
        throw new Error('analyticsApi is not defined. Check your API import path.');
      }

      if (!employeeApi) {
        throw new Error('employeeApi is not defined. Check your API import path.');
      }

      let statsResponse = { data: null };
      if (typeof analyticsApi.getDashboardStats === 'function') {
        statsResponse = await analyticsApi.getDashboardStats();
      }

      let employeesResponse = { data: [] };
      if (typeof employeeApi.getAllEmployees === 'function') {
        employeesResponse = await employeeApi.getAllEmployees();
      }

      let departmentResponse = { data: null };
      if (typeof analyticsApi.getDepartmentCompletion === 'function') {
        departmentResponse = await analyticsApi.getDepartmentCompletion();
      }

      let taskStatusResponse = { data: null };
      if (typeof analyticsApi.getTaskStatusDistribution === 'function') {
        taskStatusResponse = await analyticsApi.getTaskStatusDistribution();
      }

      if (statsResponse.data) {
        setStats({
          totalEmployees: statsResponse.data.totalEmployees || 0,
          onboardingInProgress: statsResponse.data.onboardingInProgress || 0,
          onboardingCompleted: statsResponse.data.onboardingCompleted || 0,
          overdueTasks: statsResponse.data.overdueTasks || 0,
          averageCompletionDays: statsResponse.data.averageCompletionDays || 0,
          completionRate: statsResponse.data.completionRate || 0
        });
      }

      if (employeesResponse.data && Array.isArray(employeesResponse.data)) {
        const sortedEmployees = [...employeesResponse.data]
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 5);
        setRecentEmployees(sortedEmployees);
      }

      if (departmentResponse?.data) {
        setDepartmentData({
          labels: departmentResponse.data.labels || [],
          data: departmentResponse.data.data || []
        });
      }

      if (taskStatusResponse?.data) {
        setTaskStatusData({
          completed: taskStatusResponse.data.completed || 0,
          inProgress: taskStatusResponse.data.inProgress || 0,
          pending: taskStatusResponse.data.pending || 0,
          overdue: taskStatusResponse.data.overdue || 0
        });
      }

      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!chartReady || !window.Chart) return;
    renderCharts();
  }, [chartReady, departmentData, taskStatusData]);

  const renderCharts = () => {
    if (!window.Chart) {
      console.warn('Chart.js not loaded yet');
      return;
    }

    const Chart = window.Chart;

    Chart.getChart(barChartRef.current)?.destroy();
    Chart.getChart(pieChartRef.current)?.destroy();

    if (barChartRef.current && departmentData.labels.length > 0) {
      new Chart(barChartRef.current, {
        type: 'bar',
        data: {
          labels: departmentData.labels,
          datasets: [{
            label: 'Completion Rate (%)',
            data: departmentData.data,
            backgroundColor: [
              'rgba(99, 102, 241, 0.7)',
              'rgba(59, 130, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(168, 85, 247, 0.7)',
              'rgba(251, 191, 36, 0.7)'
            ],
            borderColor: [
              'rgb(99, 102, 241)',
              'rgb(59, 130, 246)',
              'rgb(16, 185, 129)',
              'rgb(168, 85, 247)',
              'rgb(251, 191, 36)'
            ],
            borderWidth: 2,
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              borderRadius: 8,
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 13 },
              callbacks: {
                label: function(context) {
                  return `${context.parsed.y.toFixed(1)}%`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                },
                font: { size: 11 }
              },
              grid: { 
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
              }
            },
            x: { 
              grid: { display: false },
              ticks: { font: { size: 11 } }
            }
          },
          animation: {
            duration: 2000,
            easing: 'easeInOutQuart',
            delay: (context) => {
              let delay = 0;
              if (context.type === 'data' && context.mode === 'default') {
                delay = context.dataIndex * 150;
              }
              return delay;
            }
          }
        }
      });
    }

    // Render Pie Chart
    const totalTasks = taskStatusData.completed + taskStatusData.inProgress + 
                       taskStatusData.pending + taskStatusData.overdue;
    
    if (pieChartRef.current && totalTasks > 0) {
      new Chart(pieChartRef.current, {
        type: 'pie',
        data: {
          labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
          datasets: [{
            data: [
              taskStatusData.completed,
              taskStatusData.inProgress,
              taskStatusData.pending,
              taskStatusData.overdue
            ],
            backgroundColor: [
              'rgba(34, 197, 94, 0.7)',
              'rgba(59, 130, 246, 0.7)',
              'rgba(251, 191, 36, 0.7)',
              'rgba(239, 68, 68, 0.7)'
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(59, 130, 246)',
              'rgb(251, 191, 36)',
              'rgb(239, 68, 68)'
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 15,
                font: { size: 12 },
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            title: { display: false },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              borderRadius: 8,
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 13 },
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 2000,
            easing: 'easeInOutQuart',
            delay: (context) => {
              let delay = 0;
              if (context.type === 'data' && context.mode === 'default') {
                delay = context.dataIndex * 200;
              }
              return delay;
            }
          }
        }
      });
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never';
    const seconds = Math.floor((new Date() - lastUpdated) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 120) return '1 minute ago';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    return lastUpdated.toLocaleTimeString();
  };

  const StatCard = ({ title, value, icon: Icon, bgColor, gradient, iconBg, description, delay }) => (
    <div
      className={`group relative ${bgColor} rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-white/20`}
      style={{
        animationDelay: `${delay}ms`,
        animation: 'slideUp 0.6s ease-out forwards',
        opacity: 0
      }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 ${gradient} opacity-10`}></div>
      </div>

      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/80 mb-1 tracking-wide uppercase">{title}</p>
            <p className="text-3xl font-bold text-white mt-2 tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-white/60 mt-1">{description}</p>
            )}
          </div>
          <div className={`p-3.5 rounded-xl ${iconBg} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="mt-4 flex items-center text-xs text-white/70">
          <ArrowTrendingUpIcon className="h-3.5 w-3.5 mr-1 text-white/90" />
          <span>{formatLastUpdated()}</span>
        </div>
      </div>
    </div>
  );

  // Loading spinner
  if (loading && !lastUpdated) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent absolute inset-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .task-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .task-item:hover {
          transform: translateX(4px);
        }
        .progress-bar-shimmer {
          background: linear-gradient(90deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.25) 50%, rgba(99, 102, 241, 0.1) 100%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .chart-glass {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .chart-container {
          position: relative;
          height: 300px;
          width: 100%;
        }
      `}</style>

      <div className="space-y-6 p-6">

        {/* ERROR BANNER */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">Error Loading Dashboard</p>
                <p className="text-xs text-red-600 mt-1">{error}</p>
              </div>
              <button
                onClick={fetchDashboardData}
                className="ml-auto text-sm font-semibold text-red-700 hover:text-red-800 px-3 py-1 bg-red-100 rounded-lg"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ animation: 'slideUp 0.6s ease-out forwards', opacity: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              HR Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Overview of onboarding activities and employee progress
            </p>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={UserGroupIcon}
            bgColor="bg-gradient-to-br from-blue-500 to-indigo-600"
            gradient="bg-gradient-to-br from-blue-400 to-indigo-500"
            iconBg="bg-white/20 backdrop-blur-sm"
            delay={0}
          />
          <StatCard
            title="Onboarding Completed"
            value={stats.onboardingCompleted}
            icon={CheckCircleIcon}
            bgColor="bg-gradient-to-br from-emerald-500 to-teal-600"
            gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
            iconBg="bg-white/20 backdrop-blur-sm"
            description={`${Math.round(stats.completionRate)}% completion rate`}
            delay={100}
          />
          <StatCard
            title="In Progress"
            value={stats.onboardingInProgress}
            icon={ClockIcon}
            bgColor="bg-gradient-to-br from-amber-500 to-orange-600"
            gradient="bg-gradient-to-br from-amber-400 to-orange-500"
            iconBg="bg-white/20 backdrop-blur-sm"
            delay={200}
          />
          <StatCard
            title="Overdue Tasks"
            value={stats.overdueTasks}
            icon={ExclamationCircleIcon}
            bgColor="bg-gradient-to-br from-red-500 to-rose-600"
            gradient="bg-gradient-to-br from-red-400 to-rose-500"
            iconBg="bg-white/20 backdrop-blur-sm"
            delay={300}
          />
        </div>

        {/* CHARTS ROW */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          style={{ animation: 'slideUp 0.6s ease-out 0.4s forwards', opacity: 0 }}
        >
          {/* Bar Chart */}
          <div className="chart-glass rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5 text-indigo-600" />
                  Completion by Department
                </h2>
                <span className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full">
                  {departmentData.labels.length || 0} Departments
                </span>
              </div>
            </div>
            <div className="p-6">
              {departmentData.labels.length > 0 ? (
                <div className="chart-container">
                  <canvas ref={barChartRef}></canvas>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium">No department data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="chart-glass rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5 text-emerald-600" />
                  Task Status Distribution
                </h2>
                <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-full">
                  Live
                </span>
              </div>
            </div>
            <div className="p-6">
              {(taskStatusData.completed + taskStatusData.inProgress + taskStatusData.pending + taskStatusData.overdue) > 0 ? (
                <div className="chart-container">
                  <canvas ref={pieChartRef}></canvas>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium">No task data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITIES */}
        <div
          className="chart-glass rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          style={{ animation: 'slideUp 0.6s ease-out 0.55s forwards', opacity: 0 }}
        >
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UserGroupIcon className="h-5 w-5 text-purple-600" />
                Recent Onboarding Activities
              </h2>
              <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
                {recentEmployees.length} Employees
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {recentEmployees.map((employee, index) => (
              <div
                key={employee.id || index}
                className="task-item px-6 py-4 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 cursor-pointer"
                style={{
                  animationDelay: `${600 + index * 60}ms`,
                  animation: 'slideUp 0.5s ease-out forwards',
                  opacity: 0
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-sm">
                      <span className="text-sm font-bold text-white">
                        {employee.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {employee.name || 'Unknown Employee'}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {employee.position || employee.department || 'No position'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 mb-1">
                        {Math.round(employee.progressPercentage || 0)}%
                      </p>
                      <div className="w-36 h-2.5 bg-gray-100 rounded-full overflow-hidden progress-bar-shimmer">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${employee.progressPercentage || 0}%`,
                            background: 'linear-gradient(90deg, #6366f1, #a855f7)'
                          }}
                        ></div>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border whitespace-nowrap ${
                        employee.onboardingStatus === 'completed'
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : employee.onboardingStatus === 'in_progress'
                          ? 'text-blue-700 bg-blue-50 border-blue-200'
                          : 'text-amber-700 bg-amber-50 border-amber-200'
                      }`}
                    >
                      {employee.onboardingStatus?.replace('_', ' ').toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {recentEmployees.length === 0 && (
              <div className="px-6 py-12 text-center">
                <UserGroupIcon className="h-12 w-12 text-purple-300 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">No employee data available</p>
                <p className="text-sm text-gray-500 mt-1">Employees will appear here once data is loaded from the backend</p>
              </div>
            )}
          </div>
        </div>

        {/* OVERDUE ALERT */}
        {stats.overdueTasks > 0 && (
          <div
            className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-2xl p-6 shadow-sm"
            style={{ animation: 'slideUp 0.6s ease-out 0.7s forwards', opacity: 0 }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-red-100 rounded-xl">
                  <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-1">
                  {stats.overdueTasks} Overdue Task{stats.overdueTasks > 1 ? 's' : ''} Require Attention
                </h3>
                <p className="text-sm text-red-700">
                  Review and reassign overdue onboarding tasks to keep progress on track.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HRDashboard;