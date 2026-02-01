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
  ArrowTrendingUpIcon,
  ArrowPathIcon
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

  // --- Styled StatCard matching EmployeeDashboard gradient style ---
  const StatCard = ({ title, value, icon: Icon, bgColor, gradient, iconBg, description, delay }) => (
    <div
      className={`group relative ${bgColor} rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-white/20`}
      style={{
        animationDelay: `${delay}ms`,
        animation: 'slideUp 0.6s ease-out forwards',
        opacity: 0
      }}
    >
      {/* Hover glow layer */}
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
          <span>Updated just now</span>
        </div>
      </div>
    </div>
  );

  // --- Loading spinner matching EmployeeDashboard style ---
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
      {/* Global keyframes & task-item styles */}
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
          background: linear-gradient(
            90deg,
            rgba(99, 102, 241, 0.1) 0%,
            rgba(99, 102, 241, 0.25) 50%,
            rgba(99, 102, 241, 0.1) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        /* Chart container glass style */
        .chart-glass {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>

      <div className="space-y-6 p-6">

        {/* ─── HEADER ─── */}
        <div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ animation: 'slideUp 0.6s ease-out forwards', opacity: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              HR Dashboard 📊
            </h1>
            <p className="text-gray-600 text-lg">
              Overview of onboarding activities and employee progress
            </p>
          </div>

          {/* Refresh button — styled to match the glassmorphism panels */}
          <button
            onClick={fetchDashboardData}
            className="group flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-2xl shadow-sm hover:shadow-md hover:bg-white transition-all duration-300 text-sm font-semibold text-indigo-700"
          >
            <ArrowPathIcon className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
            Refresh
          </button>
        </div>

        {/* ─── STAT CARDS ─── */}
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
            description={`${stats.completionRate}% completion rate`}
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

        {/* ─── CHARTS ROW ─── */}
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
                  5 Departments
                </span>
              </div>
            </div>
            <div className="p-5">
              <AnalyticsChart
                type="bar"
                title=""
                data={{
                  labels: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'],
                  datasets: [{
                    label: 'Completion Rate (%)',
                    data: [95, 78, 82, 100, 89],
                    backgroundColor: [
                      'rgba(99, 102, 241, 0.6)',
                      'rgba(59, 130, 246, 0.6)',
                      'rgba(16, 185, 129, 0.6)',
                      'rgba(168, 85, 247, 0.6)',
                      'rgba(251, 191, 36, 0.6)'
                    ],
                    borderColor: [
                      'rgb(99, 102, 241)',
                      'rgb(59, 130, 246)',
                      'rgb(16, 185, 129)',
                      'rgb(168, 85, 247)',
                      'rgb(251, 191, 36)'
                    ],
                    borderWidth: 2,
                    borderRadius: 6
                  }]
                }}
              />
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
            <div className="p-5">
              <AnalyticsChart
                type="pie"
                title=""
                data={{
                  labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
                  datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                      'rgba(34, 197, 94, 0.55)',
                      'rgba(59, 130, 246, 0.55)',
                      'rgba(251, 191, 36, 0.55)',
                      'rgba(239, 68, 68, 0.55)'
                    ],
                    borderColor: [
                      'rgb(34, 197, 94)',
                      'rgb(59, 130, 246)',
                      'rgb(251, 191, 36)',
                      'rgb(239, 68, 68)'
                    ],
                    borderWidth: 2
                  }]
                }}
              />
            </div>
          </div>
        </div>

        {/* ─── RECENT ONBOARDING ACTIVITIES ─── */}
        <div
          className="chart-glass rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          style={{ animation: 'slideUp 0.6s ease-out 0.55s forwards', opacity: 0 }}
        >
          {/* Section Header */}
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

          {/* Employee List */}
          <div className="divide-y divide-gray-100">
            {recentEmployees.map((employee, index) => (
              <div
                key={employee.id}
                className="task-item px-6 py-4 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 cursor-pointer"
                style={{
                  animationDelay: `${600 + index * 60}ms`,
                  animation: 'slideUp 0.5s ease-out forwards',
                  opacity: 0
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Avatar + Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-sm">
                      <span className="text-sm font-bold text-white">
                        {employee.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {employee.name || 'Unknown'}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {employee.position || 'No position'}
                      </p>
                    </div>
                  </div>

                  {/* Progress + Badge */}
                  <div className="flex items-center gap-5 flex-shrink-0">
                    {/* Progress bar */}
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 mb-1">
                        {employee.progressPercentage || 0}%
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

                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border ${
                        employee.onboardingStatus === 'completed'
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : employee.onboardingStatus === 'in_progress'
                          ? 'text-blue-700 bg-blue-50 border-blue-200'
                          : 'text-amber-700 bg-amber-50 border-amber-200'
                      }`}
                    >
                      {employee.onboardingStatus?.replace('_', ' ') || 'unknown'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {recentEmployees.length === 0 && (
              <div className="px-6 py-12 text-center">
                <UserGroupIcon className="h-12 w-12 text-purple-300 mx-auto mb-3" />
                <p className="text-gray-700 font-medium">No employee data available</p>
                <p className="text-sm text-gray-500 mt-1">Employees will appear here once onboarding begins</p>
              </div>
            )}
          </div>
        </div>

        {/* ─── OVERDUE ALERT (only if there are overdue tasks) ─── */}
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