import React from 'react';

const ProgressBar = ({ progress, showLabel = true, size = 'md' }) => {
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const percentage = progress?.percentage || 0;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className={`font-medium text-gray-700 ${textClasses[size]}`}>
            Progress
          </span>
          <span className={`font-medium text-gray-700 ${textClasses[size]}`}>
            {percentage}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${heightClasses[size]}`}>
        <div
          className={`bg-primary-600 rounded-full transition-all duration-300 ${heightClasses[size]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {progress && (
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>{progress.completed} completed</span>
          <span>{progress.total - progress.completed} remaining</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;