import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const TemplateForm = ({ template, onSubmit, onCancel }) => {
  const [tasks, setTasks] = useState(template?.tasks || []);
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const response = await api.get('/departments');
      const departmentsData = response.data?.data || response.data || [];
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
      // Fallback to empty array so form still works
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: template?.name || '',
      description: template?.description || '',
      department_id: template?.department_id || '',
      estimated_completion_days: template?.estimated_completion_days || 7,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, 'Template name must be at least 2 characters')
        .max(200, 'Template name must not exceed 200 characters')
        .required('Template name is required'),
      description: Yup.string()
        .max(1000, 'Description must not exceed 1000 characters'),
      department_id: Yup.string()
        .test('is-uuid-or-empty', 'Invalid department', function(value) {
          if (!value) return true; // Optional field
          // Check if it's a valid UUID
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          return uuidRegex.test(value);
        }),
      estimated_completion_days: Yup.number()
        .min(1, 'Must be at least 1 day')
        .max(365, 'Cannot exceed 365 days')
        .integer('Must be a whole number'),
    }),
    onSubmit: (values) => {
      // Clean and format the data
      const cleanedData = cleanFormData(values, tasks);
      
      console.log('Submitting cleaned data:', cleanedData);
      onSubmit(cleanedData);
    },
  });

  /**
   * Clean form data before submission
   * - Removes invalid UUIDs
   * - Formats tasks properly
   * - Removes null/undefined values
   */
  const cleanFormData = (values, tasksList) => {
    const cleaned = {
      name: values.name?.trim(),
      description: values.description?.trim() || '',
      estimated_completion_days: values.estimated_completion_days,
    };

    // Only include department_id if it's a valid UUID
    if (values.department_id) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(values.department_id)) {
        cleaned.department_id = values.department_id;
      } else {
        console.warn('⚠️ Invalid department_id removed:', values.department_id);
      }
    }

    // Format tasks
    if (tasksList && tasksList.length > 0) {
      cleaned.tasks = tasksList.map((task, index) => {
        const cleanedTask = {
          title: task.title?.trim(),
          task_type: task.type || task.task_type || 'read',
          order_index: index + 1,
          is_required: task.isRequired !== undefined 
            ? task.isRequired 
            : task.is_required !== undefined 
              ? task.is_required 
              : true,
        };

        // Add optional fields only if they have values
        if (task.description?.trim()) {
          cleanedTask.description = task.description.trim();
        }
        
        const estimatedTime = task.estimatedTime || task.estimated_time;
        if (estimatedTime) {
          cleanedTask.estimated_time = estimatedTime;
        }
        
        if (task.resource_url?.trim()) {
          cleanedTask.resource_url = task.resource_url.trim();
        }

        return cleanedTask;
      });
    }

    return cleaned;
  };

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      title: '',
      description: '',
      type: 'read',
      isRequired: true,
      estimatedTime: 30,
      order: tasks.length + 1,
      resource_url: null,
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const moveTask = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const updated = [...tasks];
      [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
      setTasks(updated);
    } else if (direction === 'down' && index < tasks.length - 1) {
      const updated = [...tasks];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      setTasks(updated);
    }
  };

  const taskThemes = [
    { bar: 'from-blue-500 to-indigo-600', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
    { bar: 'from-emerald-500 to-teal-600', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700' },
    { bar: 'from-purple-500 to-pink-600', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
    { bar: 'from-amber-500 to-orange-600', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  ];

  const inputClass = `mt-1 block w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white/70 shadow-sm
    focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
    text-sm text-gray-800 placeholder-gray-400 transition-all duration-200`;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .form-slide { animation: slideUp 0.4s ease-out forwards; opacity: 0; }
      `}</style>

      {/* ─── HEADER ─── */}
      <div className="relative">
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {template ? 'Edit Template' : 'Create New Template'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-all duration-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── FORM BODY ─── */}
      <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">

        {/* Row 1: Name + Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 form-slide" style={{ animationDelay: '60ms' }}>
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-0.5">
              Template Name <span className="text-indigo-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={inputClass}
              placeholder="e.g. Software Engineer Onboarding"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="department_id" className="block text-sm font-semibold text-gray-700 mb-0.5">
              Department <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            {loadingDepartments ? (
              <div className={inputClass + ' flex items-center justify-center'}>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
                <span className="ml-2 text-gray-500">Loading...</span>
              </div>
            ) : (
              <select
                id="department_id"
                name="department_id"
                className={inputClass}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.department_id}
              >
                <option value="">No Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
                
                {/* Fallback options if departments API fails */}
                {departments.length === 0 && !loadingDepartments && (
                  <>
                    <option disabled>── Departments unavailable ──</option>
                    <option value="">Continue without department</option>
                  </>
                )}
              </select>
            )}
            {formik.touched.department_id && formik.errors.department_id && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{formik.errors.department_id}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              Department selection is optional
            </p>
          </div>
        </div>

        {/* Row 2: Description */}
        <div className="form-slide" style={{ animationDelay: '120ms' }}>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-0.5">
            Description <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className={inputClass}
            placeholder="Describe the purpose and scope of this template..."
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{formik.errors.description}</p>
          )}
        </div>

        {/* Row 3: Estimated Days */}
        <div className="form-slide" style={{ animationDelay: '180ms' }}>
          <label htmlFor="estimated_completion_days" className="block text-sm font-semibold text-gray-700 mb-0.5">
            Estimated Completion (Days) <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              id="estimated_completion_days"
              name="estimated_completion_days"
              min="1"
              max="365"
              className={`${inputClass} w-32`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.estimated_completion_days}
            />
            <span className="text-sm text-gray-400">days to complete</span>
          </div>
          {formik.touched.estimated_completion_days && formik.errors.estimated_completion_days && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{formik.errors.estimated_completion_days}</p>
          )}
        </div>

        {/* ─── TASKS SECTION ─── */}
        <div className="border-t border-gray-100 pt-6 form-slide" style={{ animationDelay: '240ms' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tasks</h3>
              <p className="text-sm text-gray-500 mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''} added</p>
            </div>
            <button
              type="button"
              onClick={addTask}
              className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:from-indigo-600 hover:to-purple-700"
            >
              <PlusIcon className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
              Add Task
            </button>
          </div>

          {/* Empty tasks */}
          {tasks.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl py-10 px-6 text-center bg-white/40">
              <PlusIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">No tasks added yet</p>
              <p className="text-xs text-gray-400 mt-0.5">Click "Add Task" above to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task, index) => {
                const theme = taskThemes[index % taskThemes.length];
                const taskType = task.type || task.task_type || 'read';
                
                return (
                  <div
                    key={task.id}
                    className={`rounded-2xl border ${theme.border} overflow-hidden bg-white/60 backdrop-blur-sm shadow-sm`}
                  >
                    <div className={`h-1 bg-gradient-to-r ${theme.bar}`}></div>

                    <div className="p-4">
                      {/* Task header */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-lg ${theme.badge}`}>
                            Task {index + 1}
                          </span>
                          <div className="flex items-center gap-0.5 ml-1">
                            <button
                              type="button"
                              onClick={() => moveTask(index, 'up')}
                              disabled={index === 0}
                              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                            >
                              <ChevronUpIcon className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveTask(index, 'down')}
                              disabled={index === tasks.length - 1}
                              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
                            >
                              <ChevronDownIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTask(index)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Title + Type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={task.title}
                            onChange={(e) => updateTask(index, 'title', e.target.value)}
                            className={inputClass}
                            placeholder="Enter task title"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={taskType}
                            onChange={(e) => updateTask(index, 'type', e.target.value)}
                            className={inputClass}
                          >
                            <option value="read">Read Document</option>
                            <option value="upload">Upload File</option>
                            <option value="watch">Watch Video</option>
                            <option value="meeting">Schedule Meeting</option>
                            <option value="form">Complete Form</option>
                            <option value="training">Training</option>
                          </select>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mt-4">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                        <textarea
                          value={task.description}
                          onChange={(e) => updateTask(index, 'description', e.target.value)}
                          rows={2}
                          className={inputClass}
                          placeholder="Describe what needs to be done"
                        />
                      </div>

                      {/* Resource URL for read/watch tasks */}
                      {(taskType === 'read' || taskType === 'watch') && (
                        <div className="mt-4">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Resource URL</label>
                          <input
                            type="url"
                            value={task.resource_url || ''}
                            onChange={(e) => updateTask(index, 'resource_url', e.target.value)}
                            className={inputClass}
                            placeholder="https://example.com/document.pdf"
                          />
                        </div>
                      )}

                      {/* Upload task info */}
                      {taskType === 'upload' && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                          <div className="flex items-start gap-2">
                            <DocumentArrowUpIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-blue-900">File Upload Task</p>
                              <p className="text-xs text-blue-700 mt-1">
                                Employees will be able to upload documents for this task. Specify required documents in the description.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Form task info */}
                      {taskType === 'form' && (
                        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                          <div className="flex items-start gap-2">
                            <DocumentArrowUpIcon className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-purple-900">Form Completion Task</p>
                              <p className="text-xs text-purple-700 mt-1">
                                Employees will complete a form. Data will be saved to their user profile.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Required + Est. Time */}
                      <div className="mt-4 flex flex-wrap items-end gap-5">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={task.isRequired !== undefined ? task.isRequired : task.is_required !== undefined ? task.is_required : true}
                            onChange={(e) => updateTask(index, 'isRequired', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-300 cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 font-medium">Required</span>
                        </label>

                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Est. Time (min)</label>
                          <input
                            type="number"
                            value={task.estimatedTime || task.estimated_time || 30}
                            onChange={(e) => updateTask(index, 'estimatedTime', parseInt(e.target.value) || 0)}
                            min="1"
                            className={`${inputClass} w-28`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── FOOTER BUTTONS ─── */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 form-slide" style={{ animationDelay: '300ms' }}>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateForm;