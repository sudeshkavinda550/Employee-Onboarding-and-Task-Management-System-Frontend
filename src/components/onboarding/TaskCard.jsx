import React, { useState } from 'react';
import { 
  DocumentArrowUpIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  VideoCameraIcon, 
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import DocumentUpload from './DocumentUpload';

const TaskCard = ({ task, onStatusUpdate }) => {
  const [showUpload, setShowUpload] = useState(false);

  const getTaskIcon = () => {
    switch (task.type) {
      case 'upload': return DocumentArrowUpIcon;
      case 'read': return DocumentTextIcon;
      case 'watch': return VideoCameraIcon;
      case 'meeting': return UserGroupIcon;
      default: return DocumentTextIcon;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed': return 'bg-emerald-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    if (task.status === 'completed') {
      return <CheckCircleIcon className="h-5 w-5 text-emerald-500" />;
    }
    return <ClockIcon className="h-5 w-5 text-amber-400" />;
  };

  const handleComplete = () => {
    if (task.type === 'upload') {
      setShowUpload(true);
    } else {
      onStatusUpdate(task.id, 'completed');
    }
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    onStatusUpdate(task.id, 'completed');
  };

  const Icon = getTaskIcon();
  const isCompleted = task.status === 'completed';

  return (
    <div className="task-item px-6 py-4 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50">
      <style>{`
        .task-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .task-item:hover {
          transform: translateX(4px);
        }
      `}</style>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Task Icon */}
          <div className={`p-3 rounded-xl ${getStatusColor()} bg-opacity-10`}>
            <Icon className={`h-5 w-5 ${isCompleted ? 'text-emerald-600' : 'text-gray-600'}`} />
          </div>
          
          {/* Task Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
              <h3 className={`text-sm font-semibold ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {task.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
            
            {/* Task Metadata */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              {task.dueDate && (
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
              {task.completedDate && (
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                  Completed: {new Date(task.completedDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status and Action */}
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-xs font-medium rounded-lg ${
            task.status === 'completed' 
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : task.status === 'in_progress'
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-amber-100 text-amber-700 border border-amber-200'
          }`}>
            {task.status === 'in_progress' ? 'In Progress' : task.status === 'completed' ? 'Completed' : 'Pending'}
          </span>
          
          {!isCompleted && (
            <button
              onClick={handleComplete}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:shadow-lg transition-all"
            >
              {task.type === 'upload' ? 'Upload' : 'Complete'}
            </button>
          )}
        </div>
      </div>

      {/* Document Upload Section */}
      {showUpload && (
        <div className="mt-4 ml-11">
          <DocumentUpload
            taskId={task.id}
            onUploadComplete={handleUploadComplete}
            onCancel={() => setShowUpload(false)}
          />
        </div>
      )}
    </div>
  );
};

export default TaskCard;