import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../api';
import AnalyticsChart from '../../components/hr/AnalyticsChart';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [departmentAnalytics, setDepartmentAnalytics] = useState(null);
  const [completionTimes, setCompletionTimes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [deptResponse, timeResponse] = await Promise.all([
        analyticsApi.getDepartmentAnalytics(),
        analyticsApi.getTimeToCompletion()
      ]);
      setDepartmentAnalytics(deptResponse.data);
      setCompletionTimes(timeResponse.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Insights and metrics for onboarding performance
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
          <option value="quarter">Last 90 days</option>
          <option value="year">Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          type="bar"
          title="Average Completion Time by Department (Days)"
          data={{
            labels: departmentAnalytics?.map(d => d.department) || [],
            datasets: [{
              label: 'Days',
              data: departmentAnalytics?.map(d => d.averageCompletionDays) || [],
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
            }]
          }}
        />
        <AnalyticsChart
          type="line"
          title="Completion Rate Trend"
          data={{
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
              label: 'Completion Rate %',
              data: [65, 72, 78, 85],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
            }]
          }}
        />
      </div>
    </div>
  );
};

export default Analytics;