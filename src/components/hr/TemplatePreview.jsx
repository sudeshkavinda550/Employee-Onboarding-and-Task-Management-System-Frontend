import React from 'react';
import { XMarkIcon, DocumentTextIcon, ClockIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const TemplatePreview = ({ template, onClose, onAssign }) => {
  const taskTypes = {
    read: { icon: '📖', label: 'Read Document', color: 'bg-blue-100 text-blue-800' },
    upload: { icon: '📤', label: 'Upload File', color: 'bg-green-100 text-green-800' },
    watch: { icon: '🎬', label: 'Watch Video', color: 'bg-purple-100 text-purple-800' },
    meeting: { icon: '👥', label: 'Schedule Meeting', color: 'bg-amber-100 text-amber-800' },
    form: { icon: '📝', label: 'Complete Form', color: 'bg-red-100 text-red-800' },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-6 w-6 text-white" />
              <h2 className="text-xl font-bold text-white">{template.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Template Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100">
                  <ClockIcon className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-900">{template.estimated_completion_days || template.estimatedCompletionDays} days</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <UserGroupIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-semibold text-gray-900">{template.department_name || template.department}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <CheckCircleIcon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tasks</p>
                  <p className="font-semibold text-gray-900">{template.tasks_count || template.tasks?.length || 0} items</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600 bg-gray-50 rounded-xl p-4 border border-gray-100">
              {template.description}
            </p>
          </div>

          {/* Tasks */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks ({template.tasks?.length || 0})</h3>
            <div className="space-y-4">
              {template.tasks?.map((task, index) => (
                <div key={task.id || index} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">{taskTypes[task.task_type || task.type]?.icon || '📋'}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{task.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-lg ${taskTypes[task.task_type || task.type]?.color || 'bg-gray-100 text-gray-800'}`}>
                              {taskTypes[task.task_type || task.type]?.label || task.task_type || task.type}
                            </span>
                            {task.is_required && (
                              <span className="px-2 py-0.5 text-xs font-semibold rounded-lg bg-red-100 text-red-800">
                                Required
                              </span>
                            )}
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-800">
                              {task.estimated_time || 30} min
                            </span>
                          </div>
                        </div>
                      </div>
                      {task.description && (
                        <p className="text-gray-600 text-sm mt-2">{task.description}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 ml-4">#{index + 1}</div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-400">
                  No tasks added to this template
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              Close
            </button>
            <button
              onClick={onAssign}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              Assign to Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;