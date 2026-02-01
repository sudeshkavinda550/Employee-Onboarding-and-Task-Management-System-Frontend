import React, { useState, useEffect } from 'react';
import { taskApi } from '../../api/taskApi';
import TaskCard from './TaskCard';
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const TaskChecklist = () => {
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const [tasksResponse, progressResponse] = await Promise.all([
        taskApi.getMyTasks(),
        taskApi.getTaskProgress()
      ]);
      setTasks(tasksResponse.data || []);
      setProgress(progressResponse.data || { completed: 0, total: 0, percentage: 0 });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await taskApi.updateTaskStatus(taskId, { status });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const stats = {
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent absolute inset-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Progress Overview Card */}
      <div 
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6"
        style={{ animation: 'slideUp 0.6s ease-out' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <ChartBarIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Onboarding Progress</h2>
        </div>
        
        <div className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="font-medium">Overall Progress</span>
              <span className="font-bold text-gray-900">{progress.completed} of {progress.total} tasks</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full h-3 transition-all duration-1000"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-2xl font-bold text-gray-900">{progress.percentage}%</span>
              <div className="flex items-center text-xs text-emerald-600">
                <ArrowTrendingUpIcon className="h-3.5 w-3.5 mr-1" />
                <span>Keep going!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-sm p-6 text-white"
          style={{ animation: 'slideUp 0.6s ease-out', animationDelay: '100ms', opacity: 0, animationFillMode: 'forwards' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">COMPLETED</p>
              <p className="text-3xl font-bold">{stats.completed}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-white/70">
            <ArrowTrendingUpIcon className="h-3.5 w-3.5 mr-1" />
            <span>Great progress!</span>
          </div>
        </div>

        <div 
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-sm p-6 text-white"
          style={{ animation: 'slideUp 0.6s ease-out', animationDelay: '200ms', opacity: 0, animationFillMode: 'forwards' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">IN PROGRESS</p>
              <p className="text-3xl font-bold">{stats.inProgress}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <ChartBarIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-white/70">
            <ClockIcon className="h-3.5 w-3.5 mr-1" />
            <span>Keep going!</span>
          </div>
        </div>

        <div 
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-sm p-6 text-white"
          style={{ animation: 'slideUp 0.6s ease-out', animationDelay: '300ms', opacity: 0, animationFillMode: 'forwards' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">PENDING</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <ClockIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-white/70">
            <SparklesIcon className="h-3.5 w-3.5 mr-1" />
            <span>Let's start!</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div 
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4"
        style={{ animation: 'slideUp 0.6s ease-out', animationDelay: '400ms', opacity: 0, animationFillMode: 'forwards' }}
      >
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              filter === 'all' 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              filter === 'pending' 
                ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              filter === 'in_progress' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            In Progress ({stats.inProgress})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              filter === 'completed' 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completed ({stats.completed})
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div 
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        style={{ animation: 'slideUp 0.6s ease-out', animationDelay: '500ms', opacity: 0, animationFillMode: 'forwards' }}
      >
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
            Onboarding Checklist
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredTasks.map((task, index) => (
            <div 
              key={task.id}
              style={{
                animation: 'slideUp 0.5s ease-out',
                animationDelay: `${600 + index * 50}ms`,
                opacity: 0,
                animationFillMode: 'forwards'
              }}
            >
              <TaskCard
                task={task}
                onStatusUpdate={updateTaskStatus}
              />
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="px-6 py-12 text-center">
              <SparklesIcon className="h-12 w-12 text-indigo-300 mx-auto mb-3" />
              <p className="text-gray-700 font-medium">No tasks found</p>
              <p className="text-sm text-gray-500 mt-1">
                {filter === 'all' ? 'No tasks assigned yet' : `No ${filter.replace('_', ' ')} tasks`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskChecklist;