import React from 'react';
import { PencilIcon, TrashIcon, DocumentDuplicateIcon, EyeIcon } from '@heroicons/react/24/outline';

const TemplateList = ({ 
  templates = [], 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onPreview,
  onAssign,
  isLoading 
}) => {

  const cardThemes = [
    { gradient: 'from-blue-500 to-indigo-600', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', accent: 'border-blue-200 bg-blue-50 text-blue-700', accentHover: 'hover:bg-blue-100', deptBg: 'bg-blue-100 text-blue-700' },
    { gradient: 'from-emerald-500 to-teal-600', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', accent: 'border-emerald-200 bg-emerald-50 text-emerald-700', accentHover: 'hover:bg-emerald-100', deptBg: 'bg-emerald-100 text-emerald-700' },
    { gradient: 'from-purple-500 to-pink-600', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', accent: 'border-purple-200 bg-purple-50 text-purple-700', accentHover: 'hover:bg-purple-100', deptBg: 'bg-purple-100 text-purple-700' },
    { gradient: 'from-amber-500 to-orange-600', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', accent: 'border-amber-200 bg-amber-50 text-amber-700', accentHover: 'hover:bg-amber-100', deptBg: 'bg-amber-100 text-amber-700' },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-2 bg-gray-200"></div>
            <div className="p-6">
              <div className="flex items-start gap-3 mb-5">
                <div className="h-11 w-11 rounded-xl bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded-lg w-full"></div>
                  <div className="h-3 bg-gray-200 rounded-lg w-2/3 mt-1.5"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded-lg w-20"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-28"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-24"></div>
              </div>
              <div className="flex gap-3 mt-5">
                <div className="flex-1 h-9 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 h-9 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 px-6 py-16 text-center">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
          <DocumentDuplicateIcon className="h-8 w-8 text-indigo-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No templates yet</h3>
        <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
          Get started by creating your first onboarding template to streamline the new-hire process.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {templates.map((template, index) => {
        const theme = cardThemes[index % cardThemes.length];
        return (
          <div
            key={template.id}
            className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`h-2 bg-gradient-to-r ${theme.gradient}`}></div>

            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3 flex-1 min-w-0 pr-3">
                  <div className={`flex-shrink-0 h-11 w-11 rounded-xl ${theme.iconBg} flex items-center justify-center`}>
                    <DocumentDuplicateIcon className={`h-5 w-5 ${theme.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-gray-900 truncate">{template.name}</h3>
                    <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">{template.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => onEdit(template)}
                    className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-150 hover:scale-110"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDuplicate(template)}
                    className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-150 hover:scale-110"
                    title="Duplicate"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(template.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150 hover:scale-110"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg border ${theme.accent}`}>
                  {template.tasks_count || template.tasksCount || 0} Tasks
                </span>
                {template.department_name && (
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg ${theme.deptBg}`}>
                    {template.department_name}
                  </span>
                )}
                <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg border border-gray-200 bg-gray-50 text-gray-600">
                  Created {new Date(template.created_at || template.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => onPreview(template)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl border ${theme.accent} ${theme.accentHover} transition-all duration-200`}
                >
                  <EyeIcon className="h-4 w-4" />
                  Preview
                </button>
                <button
                  onClick={() => onAssign(template)}
                  className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r ${theme.gradient} rounded-xl shadow-sm hover:shadow-md transition-all duration-200`}
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TemplateList;