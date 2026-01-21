import React from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon, DocumentDuplicateIcon, EyeIcon } from '@heroicons/react/24/outline';

const TemplateList = ({ templates, onEdit, onDelete, onDuplicate, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow border border-gray-200 animate-pulse">
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No templates</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new onboarding template.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div key={template.id} className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 truncate">{template.name}</h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{template.description}</p>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(template)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit template"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDuplicate(template)}
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                  title="Duplicate template"
                >
                  <DocumentDuplicateIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(template.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete template"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">Tasks:</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">{template.tasksCount || template.tasks?.length || 0} items</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">Created:</span>
                <span>{new Date(template.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">Last Updated:</span>
                <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
              </div>
              {template.department && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Department:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{template.department}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <Link
                to={`/hr/templates/${template.id}/preview`}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                Preview
              </Link>
              <Link
                to={`/hr/templates/${template.id}/assign`}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded hover:bg-primary-700"
              >
                Assign
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;