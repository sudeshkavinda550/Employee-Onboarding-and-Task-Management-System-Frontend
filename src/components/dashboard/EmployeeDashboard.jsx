import React, { useState, useEffect } from 'react';
import { employeeApi, taskApi } from '../../api';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  SparklesIcon
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

  const StatCard = ({ title, value, icon: Icon, gradient, bgColor, iconBg, delay }) => (
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
          </div>
          <div className={`p-3.5 rounded-xl ${iconBg} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <div className="mt-4 flex items-center text-xs text-white/70">
          <ArrowTrendingUpIcon className="h-3.5 w-3.5 mr-1 text-white/90" />
          <span>Updated just now</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
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
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .task-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .task-item:hover {
          transform: translateX(4px);
        }
        
        .progress-bar {
          background: linear-gradient(
            90deg,
            rgba(99, 102, 241, 0.1) 0%,
            rgba(99, 102, 241, 0.2) 50%,
            rgba(99, 102, 241, 0.1) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="space-y-6 p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Welcome Back! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Here's your onboarding progress overview
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-4 border border-indigo-100 shadow-sm">
            <div className="flex-shrink-0">
              <div className="relative w-20 h-20">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#e0e7ff"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="url(#gradient)"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - dashboardData.progress.percentage / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">{dashboardData.progress.percentage}%</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.progress.completed}/{dashboardData.progress.total}</p>
              <p className="text-xs text-gray-500 mt-1">tasks completed</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Completion Rate"
            value={`${dashboardData.progress.percentage}%`}
            icon={ChartBarIcon}
            gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
            bgColor="bg-gradient-to-br from-emerald-500 to-teal-600"
            iconBg="bg-white/20 backdrop-blur-sm"
            delay={0}
          />
          <StatCard
            title="Completed Tasks"
            value={`${dashboardData.progress.completed}/${dashboardData.progress.total}`}
            icon={CheckCircleIcon}
            gradient="bg-gradient-to-br from-blue-400 to-indigo-500"
            bgColor="bg-gradient-to-br from-blue-500 to-indigo-600"
            iconBg="bg-white/20 backdrop-blur-sm"
            delay={100}
          />
          <StatCard
            title="Pending Tasks"
            value={dashboardData.pendingTasks.length}
            icon={ClockIcon}
            gradient="bg-gradient-to-br from-amber-400 to-orange-500"
            bgColor="bg-gradient-to-br from-amber-500 to-orange-600"
            iconBg="bg-white/20 backdrop-blur-sm"
            delay={200}
          />
          <StatCard
            title="Documents"
            value={dashboardData.recentDocuments.length}
            icon={DocumentTextIcon}
            gradient="bg-gradient-to-br from-purple-400 to-pink-500"
            bgColor="bg-gradient-to-br from-purple-500 to-pink-600"
            iconBg="bg-white/20 backdrop-blur-sm"
            delay={300}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Pending Tasks */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-amber-600" />
                  Pending Tasks
                </h2>
                <span className="px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded-full">
                  {dashboardData.pendingTasks.length} Active
                </span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {dashboardData.pendingTasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className="task-item px-6 py-4 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 cursor-pointer"
                  style={{
                    animationDelay: `${400 + index * 50}ms`,
                    animation: 'slideUp 0.5s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{task.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                    </div>
                    <span className="flex-shrink-0 px-3 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg border border-amber-200">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
              
              {dashboardData.pendingTasks.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <SparklesIcon className="h-12 w-12 text-amber-300 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium">All caught up!</p>
                  <p className="text-sm text-gray-500 mt-1">No pending tasks at the moment</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Documents */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                  Recent Documents
                </h2>
                <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
                  {dashboardData.recentDocuments.length} Files
                </span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {dashboardData.recentDocuments.map((doc, index) => (
                <div 
                  key={doc.id} 
                  className="task-item px-6 py-4 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 cursor-pointer"
                  style={{
                    animationDelay: `${400 + index * 50}ms`,
                    animation: 'slideUp 0.5s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <DocumentTextIcon className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{doc.filename}</h3>
                      </div>
                      <p className="text-xs text-gray-500">
                        Uploaded {new Date(doc.uploadedDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 px-3 py-1 text-xs font-medium rounded-lg border ${
                      doc.status === 'approved' 
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : doc.status === 'rejected'
                        ? 'text-red-700 bg-red-50 border-red-200'
                        : 'text-amber-700 bg-amber-50 border-amber-200'
                    }`}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
              
              {dashboardData.recentDocuments.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <DocumentTextIcon className="h-12 w-12 text-purple-300 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium">No documents yet</p>
                  <p className="text-sm text-gray-500 mt-1">Upload your first document to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overdue Tasks Alert */}
        {dashboardData.overdueTasks.length > 0 && (
          <div 
            className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-2xl p-6 shadow-sm"
            style={{
              animation: 'slideUp 0.6s ease-out forwards',
              animationDelay: '600ms',
              opacity: 0
            }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-red-100 rounded-xl">
                  <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">Overdue Tasks Require Attention</h3>
                <div className="space-y-2">
                  {dashboardData.overdueTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                      <span className="font-medium text-red-800">{task.title}</span>
                      <span className="text-red-600">
                        • Due {new Date(task.dueDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;