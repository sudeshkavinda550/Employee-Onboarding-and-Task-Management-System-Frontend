import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  DocumentTextIcon,
  UserCircleIcon,
  AcademicCapIcon,
  VideoCameraIcon,
  WrenchScrewdriverIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const TaskCard = ({ task, onStatusUpdate }) => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const getTaskIcon = (taskType) => {
    const icons = {
      documentation: DocumentTextIcon,
      training: AcademicCapIcon,
      setup: WrenchScrewdriverIcon,
      meeting: CalendarIcon,
      profile: UserCircleIcon,
      video: VideoCameraIcon,
      general: DocumentTextIcon
    };
    return icons[taskType] || DocumentTextIcon;
  };

  const getTaskRoute = (task) => {
    const routes = {
      documentation: '/employee/documents',
      profile: '/employee/profile',
      training: '/employee/training',
      video: '/employee/training/video',
      setup: '/employee/setup',
      meeting: '/employee/meetings',
      general: null
    };
    
    if (task.title.toLowerCase().includes('upload') || 
        task.title.toLowerCase().includes('document')) {
      return '/employee/documents';
    }
    
    if (task.title.toLowerCase().includes('profile') || 
        task.title.toLowerCase().includes('information form')) {
      return '/employee/profile';
    }
    
    return routes[task.taskType] || null;
  };

  const handleStartTask = async () => {
    const route = getTaskRoute(task);
    
    if (route) {
      setIsUpdating(true);
      try {
        await onStatusUpdate(task.id, 'in_progress');
        navigate(route, { 
          state: { 
            taskId: task.id,
            taskTitle: task.title,
            returnTo: '/employee/tasks'
          } 
        });
      } catch (error) {
        console.error('Error starting task:', error);
        setIsUpdating(false);
      }
    } else {
      handleStatusChange('in_progress');
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(task.id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const TaskIcon = getTaskIcon(task.taskType);

  const statusStyles = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-green-100 text-green-700 border-green-200'
  };

  const priorityStyles = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  return (
    <div className={`p-6 hover:bg-gray-50 transition-colors ${
      task.isOverdue ? 'bg-red-50/50' : ''
    }`}>
      <div className="flex items-start justify-between gap-4">
        {/* Left side - Task info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-lg ${
              task.status === 'completed' ? 'bg-green-100' :
              task.status === 'in_progress' ? 'bg-blue-100' :
              'bg-gray-100'
            }`}>
              <TaskIcon className={`h-5 w-5 ${
                task.status === 'completed' ? 'text-green-600' :
                task.status === 'in_progress' ? 'text-blue-600' :
                'text-gray-600'
              }`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h3 className="text-base font-semibold text-gray-900">
                  {task.title}
                </h3>
                
                {task.isOverdue && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 border border-red-200 rounded-full">
                    <ExclamationTriangleIcon className="h-3 w-3" />
                    Overdue
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {task.description}
              </p>
              
              <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 border rounded-full font-medium ${
                  statusStyles[task.status]
                }`}>
                  {task.status === 'completed' && <CheckCircleIcon className="h-3.5 w-3.5" />}
                  {task.status === 'in_progress' && <ClockIcon className="h-3.5 w-3.5" />}
                  {task.status.replace('_', ' ').toUpperCase()}
                </span>
                
                {task.priority && (
                  <span className={`inline-flex items-center px-2.5 py-1 border rounded-full font-medium ${
                    priorityStyles[task.priority]
                  }`}>
                    {task.priority.toUpperCase()}
                  </span>
                )}
                
                <span className="inline-flex items-center gap-1">
                  <ClockIcon className="h-3.5 w-3.5" />
                  ~{task.estimatedTime} min
                </span>
                
                {task.dueDate && (
                  <span className={`inline-flex items-center gap-1 ${
                    task.isOverdue ? 'text-red-600 font-medium' : ''
                  }`}>
                    <CalendarIcon className="h-3.5 w-3.5" />
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {task.resourceUrl && (
                <a 
                  href={task.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-indigo-600 hover:text-indigo-700"
                >
                  <DocumentTextIcon className="h-3.5 w-3.5" />
                  View Resource
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex flex-col gap-2 min-w-fit">
          {task.status === 'pending' && (
            <button
              onClick={handleStartTask}
              disabled={isUpdating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Starting...
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4" />
                  Start Task
                </>
              )}
            </button>
          )}

          {task.status === 'in_progress' && (
            <>
              <button
                onClick={() => {
                  const route = getTaskRoute(task);
                  if (route) {
                    navigate(route, { 
                      state: { 
                        taskId: task.id,
                        taskTitle: task.title,
                        returnTo: '/employee/tasks'
                      } 
                    });
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <ArrowRightIcon className="h-4 w-4" />
                Continue
              </button>
              
              <button
                onClick={() => handleStatusChange('completed')}
                disabled={isUpdating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4" />
                    Complete
                  </>
                )}
              </button>
            </>
          )}

          {task.status === 'completed' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg border border-green-200">
              <CheckCircleIcon className="h-5 w-5" />
              Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;