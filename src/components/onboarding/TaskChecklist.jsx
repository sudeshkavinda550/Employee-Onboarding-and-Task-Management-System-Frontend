import React, { useState, useEffect } from 'react';
import { taskApi, taskUtils } from '../../api/taskApi';
import TaskCard from './TaskCard';
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const TaskChecklist = () => {
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState({ 
    completed: 0, 
    total: 0, 
    percentage: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0 
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching tasks from working endpoints...');
      
      const [tasksResponse, progressResponse] = await Promise.all([
        taskApi.getMyTasks(),      
        taskApi.getTaskProgress()  
      ]);
      
      console.log('API Responses:', { 
        tasksData: tasksResponse?.data,
        progressData: progressResponse?.data 
      });
      
      let tasksData = [];
      
      if (tasksResponse?.data) {
        if (Array.isArray(tasksResponse.data)) {
          tasksData = tasksResponse.data;
        } 
        else if (tasksResponse.data.data && Array.isArray(tasksResponse.data.data)) {
          tasksData = tasksResponse.data.data;
        }
        else if (tasksResponse.data.tasks && Array.isArray(tasksResponse.data.tasks)) {
          tasksData = tasksResponse.data.tasks;
        }
      }
      
      console.log('Processed tasks data:', tasksData);
      
      const formattedTasks = tasksData.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status || 'pending',
        taskType: task.task_type || task.taskType || 'general',
        estimatedTime: task.estimated_time || task.estimatedTime || 30,
        dueDate: task.due_date || task.dueDate,
        assignedDate: task.assigned_date || task.assignedDate,
        completedDate: task.completed_date || task.completedDate,
        resourceUrl: task.resource_url || task.resourceUrl,
        templateName: task.template_name || task.templateName,
        isRequired: task.is_required !== false && task.isRequired !== false,
        order: task.order_index || task.order || 0,
        notes: task.notes,
        priority: task.priority || 'medium',
        isOverdue: (task.due_date || task.dueDate) && 
                   new Date(task.due_date || task.dueDate) < new Date() && 
                   task.status !== 'completed'
      }));
      
      setTasks(taskUtils.sortTasks(formattedTasks));
      
      let progressData = {};
      
      if (progressResponse?.data) {
        if (progressResponse.data.total !== undefined) {
          progressData = progressResponse.data;
        }
        else if (progressResponse.data.data && progressResponse.data.data.total !== undefined) {
          progressData = progressResponse.data.data;
        }
      }
      
      if (!progressData.total && formattedTasks.length > 0) {
        progressData = taskUtils.calculateProgress(formattedTasks);
      }
      
      console.log('Progress data:', progressData);
      
      setProgress({
        completed: progressData.completed || 0,
        total: progressData.total || 0,
        percentage: progressData.percentage || 0,
        inProgress: progressData.in_progress || progressData.inProgress || 0,
        pending: progressData.pending || 0,
        overdue: progressData.overdue || 0
      });
      
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(`Failed to load tasks: ${error.message}`);
      
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                status,
                completedDate: status === 'completed' ? new Date() : task.completedDate
              }
            : task
        )
      );
      
      await taskApi.updateTaskStatus(taskId, { status });
      
      setTimeout(() => fetchTasks(), 500);
      
    } catch (error) {
      console.error('Error updating task status:', error);
      fetchTasks();
    }
  };

  const handleRefresh = () => {
    fetchTasks();
  };

  const filteredTasks = taskUtils.filterTasks(tasks, filter);
  const sortedFilteredTasks = taskUtils.sortTasks(filteredTasks);

  const stats = taskUtils.calculateProgress(tasks);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent absolute inset-0"></div>
        </div>
        <p className="text-gray-600">Loading your onboarding tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      {/* Progress Overview Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Onboarding Progress</h2>
              {error && (
                <p className="text-xs text-amber-600 mt-1">
                  Using sample data - Backend connected but using fallback
                </p>
              )}
            </div>
          </div>
          {progress.overdue > 0 && (
            <div className="flex items-center gap-2 text-red-600">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{progress.overdue} overdue</span>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="font-medium">Overall Progress</span>
              <span className="font-bold text-gray-900">
                {progress.completed} of {progress.total} tasks
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`rounded-full h-3 transition-all duration-1000 ${
                  progress.percentage >= 80 ? 'bg-green-500' :
                  progress.percentage >= 50 ? 'bg-blue-500' :
                  'bg-indigo-600'
                }`}
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-2xl font-bold text-gray-900">{progress.percentage}%</span>
              <div className="flex items-center text-sm font-medium">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                <span className={`
                  ${progress.percentage >= 80 ? 'text-green-600' :
                    progress.percentage >= 50 ? 'text-blue-600' :
                    'text-indigo-600'}
                `}>
                  {progress.percentage >= 80 ? 'Excellent!' :
                   progress.percentage >= 50 ? 'Good progress!' :
                   'Keep going!'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">COMPLETED</p>
              <p className="text-3xl font-bold">{stats.completed}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-white/70">
            <ArrowTrendingUpIcon className="h-3.5 w-3.5 mr-1" />
            <span>Great progress!</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">IN PROGRESS</p>
              <p className="text-3xl font-bold">{stats.inProgress}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <ChartBarIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-white/70">
            <ClockIcon className="h-3.5 w-3.5 mr-1" />
            <span>Keep going!</span>
          </div>
        </div>

        <div className={`rounded-xl shadow-sm p-6 text-white ${
          progress.overdue > 0 
            ? 'bg-gradient-to-br from-red-500 to-pink-600' 
            : 'bg-gradient-to-br from-amber-500 to-orange-600'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">
                {progress.overdue > 0 ? 'OVERDUE' : 'PENDING'}
              </p>
              <p className="text-3xl font-bold">
                {progress.overdue > 0 ? progress.overdue : stats.pending}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              {progress.overdue > 0 ? (
                <ExclamationTriangleIcon className="h-6 w-6" />
              ) : (
                <ClockIcon className="h-6 w-6" />
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-white/70">
            {progress.overdue > 0 ? (
              <>
                <ExclamationTriangleIcon className="h-3.5 w-3.5 mr-1" />
                <span>Attention needed!</span>
              </>
            ) : (
              <>
                <SparklesIcon className="h-3.5 w-3.5 mr-1" />
                <span>Ready to start!</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              filter === 'all' 
                ? 'bg-indigo-600 text-white' 
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
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completed ({stats.completed})
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            {sortedFilteredTasks.length > 0 && sortedFilteredTasks.some(t => t.status === 'pending') && (
              <button
                onClick={() => {
                  const pendingTasks = sortedFilteredTasks.filter(t => t.status === 'pending');
                  alert(`Starting ${pendingTasks.length} pending tasks...`);
                }}
                className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Start All Pending
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {sortedFilteredTasks.map((task, index) => (
            <div key={task?.id || index}>
              <TaskCard
                task={task}
                onStatusUpdate={updateTaskStatus}
              />
            </div>
          ))}

          {sortedFilteredTasks.length === 0 && (
            <div className="px-6 py-12 text-center">
              <SparklesIcon className="h-12 w-12 text-indigo-300 mx-auto mb-3" />
              <p className="text-gray-700 font-medium">No tasks found</p>
              <p className="text-sm text-gray-500 mt-1">
                {filter === 'all' 
                  ? 'No tasks assigned yet' 
                  : `No ${filter.replace('_', ' ')} tasks`}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-4 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  View All Tasks
                </button>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default TaskChecklist;