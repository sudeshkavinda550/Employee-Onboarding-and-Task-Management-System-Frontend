import React, { useState } from 'react';
import { DocumentArrowUpIcon, CheckCircleIcon, ClockIcon, DocumentTextIcon, VideoCameraIcon, UserGroupIcon } from '@heroicons/react/24/outline';
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
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = () => {
    if (task.status === 'completed') {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
    return <ClockIcon className="h-5 w-5 text-gray-400" />;
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

  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${getStatusColor()}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{task.description}</p>
            {task.dueDate && (
              <p className="mt-1 text-xs text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
            {task.completedDate && (
              <p className="mt-1 text-xs text-green-600">
                Completed: {new Date(task.completedDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor().replace('bg-', 'bg-').replace('text-', 'text-')}`}>
            {task.status.replace('_', ' ')}
          </span>
          {getStatusIcon()}
          
          {task.status !== 'completed' && (
            <button
              onClick={handleComplete}
              className="px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              {task.type === 'upload' ? 'Upload' : 'Mark Complete'}
            </button>
          )}
        </div>
      </div>

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