import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import TemplateForm from '../../components/hr/TemplateForm';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const mockTemplates = [
        {
          id: 1,
          name: 'Software Engineer Onboarding',
          description: 'Complete onboarding for software engineering roles',
          tasks: 8,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: 2,
          name: 'Sales Executive Onboarding',
          description: 'Onboarding template for sales team',
          tasks: 6,
          createdAt: '2024-01-10',
          updatedAt: '2024-01-10'
        },
        {
          id: 3,
          name: 'HR Intern Onboarding',
          description: 'Template for HR internship program',
          tasks: 5,
          createdAt: '2024-01-05',
          updatedAt: '2024-01-05'
        }
      ];
      setTemplates(mockTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleDelete = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        fetchTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  const handleDuplicate = async (template) => {
    try {
      fetchTemplates();
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTemplate(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingTemplate) {
      } else {
      }
      handleFormClose();
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Onboarding Templates</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Template
        </button>
      </div>

      {showForm && (
        <TemplateForm
          template={editingTemplate}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{template.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(template)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(template)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Tasks:</span>
                  <span>{template.tasks} items</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Created:</span>
                  <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Last Updated:</span>
                  <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded hover:bg-primary-50">
                  Preview
                </button>
                <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded hover:bg-primary-700">
                  Assign to Employee
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && !showForm && (
        <div className="text-center py-12">
          <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No templates</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new onboarding template.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;