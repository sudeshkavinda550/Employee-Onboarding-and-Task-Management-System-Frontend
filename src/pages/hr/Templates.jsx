import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import TemplateForm from '../../components/hr/TemplateForm';
import TemplateList from '../../components/hr/TemplateList';
import TemplatePreview from '../../components/hr/TemplatePreview';
import { templateAPI } from '../../services/api';

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await templateAPI.getAll();
      const templatesData = response.data?.data || response.data || [];
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error fetching templates:', error);
      
      let errorMessage = 'Failed to load templates';
      
      if (!error.response) {
        errorMessage = 'Cannot connect to server. Please ensure your backend is running on the correct port.';
      } else if (error.response.status === 404) {
        errorMessage = 'API endpoint not found. Please check your backend server configuration.';
      } else if (error.response.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (template) => {
    try {
      const response = await templateAPI.getById(template.id);
      const fullTemplate = response.data?.data || response.data;
      setEditingTemplate(fullTemplate);
      setShowForm(true);
    } catch (error) {
      console.error('Error fetching template details:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load template details';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await templateAPI.delete(templateId);
        setTemplates(templates.filter(t => t.id !== templateId));
        toast.success('Template deleted successfully');
      } catch (error) {
        console.error('Error deleting template:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete template';
        toast.error(errorMessage);
      }
    }
  };

  const handleDuplicate = async (template) => {
    try {
      const response = await templateAPI.duplicate(template.id);
      const newTemplate = response.data?.data || response.data;
      setTemplates([newTemplate, ...templates]);
      toast.success('Template duplicated successfully');
    } catch (error) {
      console.error('Error duplicating template:', error);
      const errorMessage = error.response?.data?.message || 'Failed to duplicate template';
      toast.error(errorMessage);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTemplate(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      console.log('Form data being submitted:', formData);
      
      if (editingTemplate) {
        const response = await templateAPI.update(editingTemplate.id, formData);
        const updatedTemplate = response.data?.data || response.data;
        setTemplates(templates.map(t => 
          t.id === editingTemplate.id ? updatedTemplate : t
        ));
        toast.success('Template updated successfully');
      } else {
        const response = await templateAPI.create(formData);
        const newTemplate = response.data?.data || response.data;
        setTemplates([newTemplate, ...templates]);
        toast.success('Template created successfully');
      }
      handleFormClose();
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      
      // ENHANCED ERROR HANDLING with validation details
      let errorMessage = 'Failed to save template';
      
      if (!error.response) {
        errorMessage = 'Cannot connect to server. Please check if backend is running.';
      } else if (error.response.status === 404) {
        errorMessage = 'API endpoint not found. Please check backend configuration.';
      } else if (error.response.status === 400) {
        // Handle validation errors
        const data = error.response.data;
        
        if (data.errors && Array.isArray(data.errors)) {
          // express-validator format
          errorMessage = 'Validation errors:\n' + 
            data.errors.map(err => `• ${err.path || err.param}: ${err.msg}`).join('\n');
          
          // Show each error as a separate toast
          data.errors.forEach(err => {
            toast.error(`${err.path || err.param}: ${err.msg}`, { duration: 5000 });
          });
          
          console.error('Validation Errors:', data.errors);
        } else if (data.message) {
          errorMessage = data.message;
        } else {
          errorMessage = 'Invalid template data. Please check all required fields.';
        }
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage, { duration: 6000 });
      
      // Log the full error for debugging
      console.error('Form Data:', formData);
      console.error('Full Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
  };

  const handlePreview = async (template) => {
    try {
      const response = await templateAPI.getById(template.id);
      const fullTemplate = response.data?.data || response.data;
      setSelectedTemplate(fullTemplate);
      setShowPreview(true);
    } catch (error) {
      console.error('Error fetching template details:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load template details';
      toast.error(errorMessage);
    }
  };

  const handleAssign = (template) => {
    navigate(`/hr/templates/${template.id}/assign`);
  };

  const handleAssignFromPreview = () => {
    if (selectedTemplate) {
      setShowPreview(false);
      navigate(`/hr/templates/${selectedTemplate.id}/assign`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent absolute inset-0"></div>
        </div>
      </div>
    );
  }

  if (error && templates.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchTemplates}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-up {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 slide-up">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              Onboarding Templates 📋
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and assign onboarding templates to new employees
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="group inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:from-indigo-600 hover:to-purple-700"
          >
            <PlusIcon className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Create Template
          </button>
        </div>

        {error && templates.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-yellow-800">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-yellow-600 hover:text-yellow-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {showForm && (
          <div className="slide-up">
            <TemplateForm
              template={editingTemplate}
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
            />
          </div>
        )}

        {showPreview && selectedTemplate && (
          <TemplatePreview
            template={selectedTemplate}
            onClose={() => {
              setShowPreview(false);
              setSelectedTemplate(null);
            }}
            onAssign={handleAssignFromPreview}
          />
        )}

        <div className="slide-up">
          <TemplateList
            templates={templates}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onPreview={handlePreview}
            onAssign={handleAssign}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Templates;