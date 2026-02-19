import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  CheckCircleIcon,
  CogIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { adminApi } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEmployees: 0,
    totalTemplates: 0,
    systemHealth: 0,
    hrManagers: 0,
    completedOnboardings: 0,
    activeOnboardings: 0,
    overdueTasks: 0,
    avgCompletionDays: 0,
  });
  const [deptStats, setDeptStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
  setLoading(true);
  setError(null);
  try {
    const [statsRes, deptRes, activityRes, healthRes] = await Promise.allSettled([
      adminApi.getAdminStats(),
      adminApi.getDeptStats(),
      adminApi.getRecentActivity(),
      adminApi.getSystemHealth(),
    ]);

    if (statsRes.status === 'fulfilled') {
      setStats(statsRes.value.data || statsRes.value);
    }
    if (deptRes.status === 'fulfilled') {
      const d = deptRes.value.data || deptRes.value;
      setDeptStats(Array.isArray(d) ? d : []);
    }
    if (activityRes.status === 'fulfilled') {
      const a = activityRes.value.data || activityRes.value;
      setRecentActivity(Array.isArray(a) ? a : []);
    }
    if (healthRes.status === 'fulfilled') {
      setSystemHealth(healthRes.value.data || healthRes.value);
    }
  } catch (err) {
    console.error('Admin dashboard fetch error:', err);
    setError('Failed to load dashboard data');
  } finally {
    setLoading(false);
  }
};

  const primaryCards = [
    {
      title: 'TOTAL EMPLOYEES',
      value: stats.activeEmployees || 0,
      sub: 'Active employees',
      bg: 'from-indigo-500 to-violet-600',
      Icon: UserGroupIcon,
    },
    {
      title: 'ONBOARDING COMPLETED',
      value: stats.completedOnboardings || 0,
      sub: `${stats.totalUsers > 0 ? Math.round((stats.completedOnboardings / stats.totalUsers) * 100) : 0}% completion rate`,
      bg: 'from-emerald-500 to-teal-600',
      Icon: CheckCircleIcon,
    },
    {
      title: 'IN PROGRESS',
      value: stats.activeOnboardings || 0,
      sub: 'Currently onboarding',
      bg: 'from-orange-400 to-orange-500',
      Icon: ClockIcon,
    },
    {
      title: 'OVERDUE TASKS',
      value: stats.overdueTasks || 0,
      sub: 'Needs attention',
      bg: 'from-red-500 to-rose-600',
      Icon: ExclamationTriangleIcon,
    },
  ];

  const secondaryCards = [
    {
      title: 'HR MANAGERS',
      value: stats.hrManagers || 0,
      sub: 'Active accounts',
      bg: 'from-sky-500 to-blue-600',
      Icon: ShieldCheckIcon,
    },
    {
      title: 'AVG. COMPLETION',
      value: `${stats.avgCompletionDays || 0}d`,
      sub: 'Average time',
      bg: 'from-violet-500 to-purple-600',
      Icon: ArrowTrendingUpIcon,
    },
    {
      title: 'TOTAL TEMPLATES',
      value: stats.totalTemplates || 0,
      sub: 'All departments',
      bg: 'from-pink-500 to-rose-500',
      Icon: DocumentTextIcon,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-800 text-center font-semibold mb-2">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">
          System-wide overview of onboarding activities and employee progress
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {primaryCards.map(({ title, value, sub, bg, Icon }) => (
          <div
            key={title}
            className={`bg-gradient-to-br ${bg} rounded-2xl p-6 text-white relative overflow-hidden shadow-sm`}
          >
            <div className="absolute top-4 right-4 bg-white/20 rounded-xl p-2">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-90">
              {title}
            </p>
            <p className="text-4xl font-extrabold mt-2 leading-none">{value}</p>
            <p className="text-xs mt-3 opacity-80 flex items-center gap-1">
              <ArrowTrendingUpIcon className="h-3.5 w-3.5" /> {sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {secondaryCards.map(({ title, value, sub, bg, Icon }) => (
          <div
            key={title}
            className={`bg-gradient-to-br ${bg} rounded-2xl p-5 text-white relative overflow-hidden shadow-sm`}
          >
            <div className="absolute top-4 right-4 bg-white/20 rounded-xl p-2">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-90">
              {title}
            </p>
            <p className="text-3xl font-extrabold mt-2 leading-none">{value}</p>
            <p className="text-xs mt-3 opacity-80 flex items-center gap-1">
              <ArrowTrendingUpIcon className="h-3.5 w-3.5" /> {sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-bold text-gray-800">Completion by Department</h2>
            </div>
            <span className="bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-full">
              {deptStats.length} Departments
            </span>
          </div>
          <div className="space-y-4">
            {deptStats.length > 0 ? (
              deptStats.map((d) => (
                <div key={d.department}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{d.department}</span>
                    <span
                      className={`text-sm font-bold ${
                        d.completionRate >= 90
                          ? 'text-emerald-600'
                          : d.completionRate >= 70
                          ? 'text-amber-500'
                          : 'text-red-500'
                      }`}
                    >
                      {d.completionRate}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        d.completionRate >= 90
                          ? 'bg-emerald-500'
                          : d.completionRate >= 70
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                      }`}
                      style={{ width: `${d.completionRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{d.totalEmployees} employees</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">No department data available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-gray-400" />
              <h2 className="text-base font-bold text-gray-800">Task Status Distribution</h2>
            </div>
            <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
              Live
            </span>
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 36 36" className="w-44 h-44 -rotate-90">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f3f4f6" strokeWidth="3.5" />
                <circle
                  cx="18" cy="18" r="15.9155" fill="none" stroke="#10b981" strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={`${stats.totalUsers > 0 ? Math.round((stats.completedOnboardings / stats.totalUsers) * 100) : 0} 100`}
                />
                <circle
                  cx="18" cy="18" r="15.9155" fill="none" stroke="#f59e0b" strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={`${stats.totalUsers > 0 ? Math.round((stats.activeOnboardings / stats.totalUsers) * 100) : 0} 100`}
                  strokeDashoffset={`-${stats.totalUsers > 0 ? Math.round((stats.completedOnboardings / stats.totalUsers) * 100) : 0}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-gray-800">{stats.totalUsers || 0}</span>
                <span className="text-xs text-gray-400">Total</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-gray-600">Completed ({stats.completedOnboardings || 0})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="text-gray-600">In Progress ({stats.activeOnboardings || 0})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
                <span className="text-gray-600">
                  Not Started ({(stats.totalUsers || 0) - (stats.completedOnboardings || 0) - (stats.activeOnboardings || 0)})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BellIcon className="h-5 w-5 text-gray-400" />
            <h2 className="text-base font-bold text-gray-800">Recent Activity</h2>
          </div>
          <a
            href="/admin/analytics"
            className="text-sm text-purple-600 font-semibold hover:underline"
          >
            View all →
          </a>
        </div>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.slice(0, 6).map((log, i) => (
              <div
                key={log.id || i}
                className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm ${
                    log.actorRole === 'admin'
                      ? 'bg-purple-100 text-purple-600'
                      : log.actorRole === 'system'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-emerald-100 text-emerald-600'
                  }`}
                >
                  {log.actorRole === 'admin' ? '★' : log.actorRole === 'system' ? '⚡' : '👤'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">
                    {log.action?.replace(/_/g, ' ') || 'Activity'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{log.detail || 'No details'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {log.actorName || 'System'} · {log.timeAgo || 'Recently'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">No recent activity</p>
          )}
        </div>
      </div>

      {systemHealth && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <CogIcon className="h-5 w-5 text-gray-400" />
            <h2 className="text-base font-bold text-gray-800">System Health</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'API Status', value: systemHealth.apiStatus || 'Unknown', dot: 'bg-emerald-500', color: 'text-emerald-600' },
              { label: 'Storage Used', value: systemHealth.storageUsed || 'N/A', dot: 'bg-indigo-500', color: 'text-indigo-600' },
              { label: 'Email Service', value: systemHealth.emailService || 'Unknown', dot: 'bg-emerald-500', color: 'text-emerald-600' },
              { label: 'Last Backup', value: systemHealth.lastBackup || 'N/A', dot: 'bg-amber-400', color: 'text-amber-600' },
              { label: 'Uptime', value: systemHealth.uptime || 'N/A', dot: 'bg-emerald-500', color: 'text-emerald-600' },
              { label: 'Active Sessions', value: `${systemHealth.activeSessions || 0} users`, dot: 'bg-purple-500', color: 'text-purple-600' },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                    {item.label}
                  </span>
                </div>
                <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;