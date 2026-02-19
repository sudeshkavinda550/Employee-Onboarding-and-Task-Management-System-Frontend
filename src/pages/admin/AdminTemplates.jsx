import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { adminApi } from '../../services/api';

const taskTypeIcon = (type) => {
  const icons = {
    upload: '📎',
    read: '📖',
    watch: '🎬',
    meet: '🤝',
    meeting: '🤝',
    form: '📝',
    sign: '✍️',
    training: '🎓',
  };
  return icons[type] || '✅';
};

const AdminTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await adminApi.getAllTemplates();
    const data = res.data || res;
    setTemplates(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('Fetch templates error:', err);
    setTemplates([]);
    setError(null);
  } finally {
    setLoading(false);
  }
};
  const filtered = templates.filter(
    (t) =>
      (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.createdByName || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-800 text-center font-semibold mb-2">{error}</p>
          <button
            onClick={fetchTemplates}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Onboarding Templates</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {templates.length} templates created by HR managers across all departments
        </p>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates…"
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-72 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-full">
          {filtered.length} templates
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-semibold mb-2">
            {search ? 'No templates match your search' : 'No templates found'}
          </p>
          <p className="text-gray-400 text-sm">
            {search ? 'Try adjusting your search terms' : 'HR managers will create templates for their departments'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((tmpl) => {
            const taskCount = (tmpl.tasks || []).length;
            return (
              <div
                key={tmpl.id || tmpl._id}
                onClick={() => setSelected(tmpl)}
                className="bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer shadow-sm hover:border-purple-300 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
                    📋
                  </div>
                  <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {taskCount} tasks
                  </span>
                </div>

                <p className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
                  {tmpl.name || 'Untitled Template'}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Created by {tmpl.createdByName || 'Unknown'}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4 min-h-[28px]">
                  {(tmpl.tasks || []).slice(0, 3).map((task, i) => (
                    <span
                      key={i}
                      className="bg-gray-50 text-gray-600 text-xs px-2 py-0.5 rounded-md border border-gray-100 truncate max-w-full"
                      title={task.title}
                    >
                      {taskTypeIcon(task.type)} {task.title}
                    </span>
                  ))}
                  {taskCount > 3 && (
                    <span className="bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded-md font-semibold">
                      +{taskCount - 3} more
                    </span>
                  )}
                </div>

                <div className="flex justify-between pt-3 border-t border-gray-50 text-xs text-gray-400">
                  <span>
                    📅 {tmpl.createdAt ? new Date(tmpl.createdAt).toLocaleDateString() : 'Unknown date'}
                  </span>
                  <span>👥 {tmpl.usageCount || 0} employees</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900 pr-4 line-clamp-2">
                {selected.name || 'Untitled Template'}
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {selected.description && (
              <p className="text-sm text-gray-600 mb-5 pb-5 border-b border-gray-100">
                {selected.description}
              </p>
            )}

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                {
                  label: 'Total Tasks',
                  value: (selected.tasks || []).length,
                  color: 'text-purple-600',
                },
                {
                  label: 'Employees Assigned',
                  value: selected.usageCount || 0,
                  color: 'text-emerald-600',
                },
                {
                  label: 'Avg Days',
                  value: selected.avgCompletionDays || '—',
                  color: 'text-amber-500',
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-400 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Task Checklist
            </p>
            <div className="space-y-0">
              {(selected.tasks || []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No tasks in this template</p>
              ) : (
                (selected.tasks || []).map((task, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-start py-3 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-lg flex-shrink-0">{taskTypeIcon(task.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">
                        {task.title || 'Untitled Task'}
                      </p>
                      {task.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <span className="inline-block mt-1 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md">
                        {task.type || 'task'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
              Created by {selected.createdByName || 'Unknown'} ·{' '}
              {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : 'Unknown date'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTemplates;