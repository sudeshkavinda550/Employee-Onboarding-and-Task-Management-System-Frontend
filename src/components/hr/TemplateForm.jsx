import React, { useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const TemplateForm = ({ template, onSubmit, onCancel }) => {
  const [tasks, setTasks] = useState(template?.tasks || []);

  const formik = useFormik({
    initialValues: {
      name: template?.name || '',
      description: template?.description || '',
      department: template?.department || '',
      estimatedCompletionDays: template?.estimatedCompletionDays || 7,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Template name is required'),
      description: Yup.string().required('Description is required'),
      department: Yup.string().required('Department is required'),
      estimatedCompletionDays: Yup.number()
        .min(1, 'Must be at least 1 day')
        .max(90, 'Cannot exceed 90 days')
        .required('Required'),
    }),
    onSubmit: (values) => {
      onSubmit({ ...values, tasks });
    },
  });

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      title: '',
      description: '',
      type: 'read',
      isRequired: true,
      estimatedTime: 30,
      order: tasks.length + 1
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setTasks(updatedTasks);
  };

  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const moveTask = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
      setTasks(updatedTasks);
    } else if (direction === 'down' && index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
      setTasks(updatedTasks);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {template ? 'Edit Template' : 'Create New Template'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Template Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department *
            </label>
            <select
              id="department"
              name="department"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.department}
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
            {formik.touched.department && formik.errors.department && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.department}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="estimatedCompletionDays" className="block text-sm font-medium text-gray-700">
              Estimated Completion (Days) *
            </label>
            <input
              type="number"
              id="estimatedCompletionDays"
              name="estimatedCompletionDays"
              min="1"
              max="90"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.estimatedCompletionDays}
            />
            {formik.touched.estimatedCompletionDays && formik.errors.estimatedCompletionDays && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.estimatedCompletionDays}</p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
            <button
              type="button"
              onClick={addTask}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No tasks added yet. Click "Add Task" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div key={task.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">Task {index + 1}</span>
                        <div className="flex space-x-1">
                          <button
                            type="button"
                            onClick={() => moveTask(index, 'up')}
                            disabled={index === 0}
                            className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900 disabled:opacity-50"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveTask(index, 'down')}
                            disabled={index === tasks.length - 1}
                            className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900 disabled:opacity-50"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTask(index)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => updateTask(index, 'title', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter task title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        value={task.type}
                        onChange={(e) => updateTask(index, 'type', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="read">Read Document</option>
                        <option value="upload">Upload File</option>
                        <option value="watch">Watch Video</option>
                        <option value="meeting">Schedule Meeting</option>
                        <option value="form">Complete Form</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={task.description}
                      onChange={(e) => updateTask(index, 'description', e.target.value)}
                      rows={2}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe what needs to be done"
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={task.isRequired}
                          onChange={(e) => updateTask(index, 'isRequired', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Required</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Estimated Time (minutes)</label>
                      <input
                        type="number"
                        value={task.estimatedTime}
                        onChange={(e) => updateTask(index, 'estimatedTime', parseInt(e.target.value))}
                        min="1"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
          >
            {template ? 'Update Template' : 'Create Template'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateForm;