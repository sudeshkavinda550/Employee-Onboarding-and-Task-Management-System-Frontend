import React, { useState, useEffect } from 'react';
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  EyeIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { adminApi } from '../../services/api';

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Operations', 'HR', 'Finance', 'Product', 'Design'];

const inputCls = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors bg-white';

const StatusBadge = ({ status }) =>
  status === 'active' ? (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
      <CheckCircleIcon className="h-3 w-3" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
      <NoSymbolIcon className="h-3 w-3" /> Suspended
    </span>
  );

const AdminHRAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getHRAccounts();
      const data = res.data || res;
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch HR accounts error:', err);
      setError('Failed to load HR accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.department) {
      setError('All fields are required');
      return;
    }
    
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await adminApi.createHRAccount(form);
      setShowCreate(false);
      setForm({ name: '', email: '', password: '', department: '' });
      fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create HR account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, status) => {
    const action = status === 'active' ? 'suspend' : 'restore';
    const confirmMsg = status === 'active' 
      ? 'Are you sure you want to suspend this HR account?' 
      : 'Are you sure you want to restore this HR account?';
    
    if (!window.confirm(confirmMsg)) return;
    
    try {
      await adminApi.updateHRStatus(id, action);
      fetchAccounts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this HR account? This action cannot be undone.')) return;
    
    try {
      await adminApi.deleteHRAccount(id);
      fetchAccounts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete account');
    }
  };

  const filtered = accounts.filter((a) =>
    (a.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.department || '').toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name) =>
    (name || 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const activeCount = accounts.filter((a) => a.status === 'active').length;
  const suspendedCount = accounts.filter((a) => a.status === 'suspended').length;
  const uniqueDepts = [...new Set(accounts.map((a) => a.department).filter(Boolean))].length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR Account Management</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Create and manage HR managers across all departments
          </p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setError(''); }}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <UserPlusIcon className="h-4 w-4" />
          New HR Account
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total HR Managers', value: accounts.length, color: 'text-purple-600' },
          { label: 'Active', value: activeCount, color: 'text-emerald-600' },
          { label: 'Suspended', value: suspendedCount, color: 'text-red-500' },
          { label: 'Departments', value: uniqueDepts, color: 'text-amber-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{s.label}</p>
            <p className={`text-3xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search HR accounts…"
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <div className="grid grid-cols-[2fr_1.4fr_1fr_1fr_1fr_1.4fr] px-5 py-3 bg-gray-50 border-b border-gray-100 min-w-[700px]">
          {['HR Manager', 'Department', 'Employees', 'Last Login', 'Status', 'Actions'].map((h) => (
            <span key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading accounts…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {search ? 'No accounts match your search.' : 'No HR accounts yet. Create the first one!'}
          </div>
        ) : (
          filtered.map((hr, i) => (
            <div
              key={hr.id || hr._id}
              className={`grid grid-cols-[2fr_1.4fr_1fr_1fr_1fr_1.4fr] px-5 py-4 items-center hover:bg-gray-50 transition-colors min-w-[700px] ${
                i < filtered.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700 flex-shrink-0">
                  {initials(hr.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{hr.name || 'Unnamed'}</p>
                  <p className="text-xs text-gray-400">{hr.email || 'No email'}</p>
                </div>
              </div>

              <span className="text-sm text-gray-600">{hr.department || '—'}</span>
              <span className="text-sm font-semibold text-indigo-600">{hr.employeeCount || 0}</span>
              <span className="text-xs text-gray-400">
                {hr.lastLogin ? new Date(hr.lastLogin).toLocaleDateString() : 'Never'}
              </span>

              <StatusBadge status={hr.status} />

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setViewRecord(hr)}
                  title="View"
                  className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleToggleStatus(hr.id || hr._id, hr.status)}
                  title={hr.status === 'active' ? 'Suspend' : 'Restore'}
                  className={`p-1.5 rounded-lg transition-colors ${
                    hr.status === 'active'
                      ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                      : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <NoSymbolIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(hr.id || hr._id)}
                  title="Delete"
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Create HR Account</h2>
              <button
                onClick={() => setShowCreate(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4 flex items-start gap-2">
                <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Jane Smith' },
                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'jane@company.com' },
                { label: 'Temporary Password', key: 'password', type: 'password', placeholder: 'Min. 8 characters' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    {label} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className={inputCls}
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Department <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className={inputCls}
                  required
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold text-sm py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating…' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewRecord && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">HR Account Details</h2>
              <button
                onClick={() => setViewRecord(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-700">
                {initials(viewRecord.name)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{viewRecord.name || 'Unnamed'}</p>
                <p className="text-sm text-gray-500">{viewRecord.email || 'No email'}</p>
                <div className="mt-1">
                  <StatusBadge status={viewRecord.status} />
                </div>
              </div>
            </div>

            {[
              ['Department', viewRecord.department || '—'],
              ['Employees Managed', viewRecord.employeeCount || 0],
              ['Last Login', viewRecord.lastLogin ? new Date(viewRecord.lastLogin).toLocaleString() : 'Never'],
              ['Account Created', viewRecord.createdAt ? new Date(viewRecord.createdAt).toLocaleDateString() : '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{k}</span>
                <span className="text-sm font-semibold text-gray-800">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHRAccounts;