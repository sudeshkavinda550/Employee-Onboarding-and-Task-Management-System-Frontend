import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { adminApi } from '../../services/api';

const STATUS_MAP = {
  completed: { label: 'Onboarded', cls: 'bg-emerald-100 text-emerald-700' },
  'in_progress': { label: 'In Progress', cls: 'bg-amber-100 text-amber-700' },
  'not_started': { label: 'Not Started', cls: 'bg-gray-100 text-gray-500' },
};

const ProgressBar = ({ value }) => {
  const numValue = Number(value) || 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            numValue === 100 ? 'bg-emerald-500' : numValue > 50 ? 'bg-purple-500' : 'bg-amber-400'
          }`}
          style={{ width: `${Math.min(numValue, 100)}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-500 w-8 text-right">{numValue}%</span>
    </div>
  );
};

const initials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

const PER_PAGE = 10;

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDept, setFilterDept] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAllEmployees();
      const data = res.data || res;
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch employees error:', err);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const departments = ['all', ...new Set(employees.map((e) => e.department).filter(Boolean))];

  const filtered = employees.filter((e) => {
    const s = search.toLowerCase();
    const matchSearch = !s || 
      (e.name || '').toLowerCase().includes(s) || 
      (e.email || '').toLowerCase().includes(s) || 
      (e.position || '').toLowerCase().includes(s);
    const matchStatus = filterStatus === 'all' || e.onboardingStatus === filterStatus;
    const matchDept = filterDept === 'all' || e.department === filterDept;
    return matchSearch && matchStatus && matchDept;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const clearFilters = () => {
    setSearch('');
    setFilterStatus('all');
    setFilterDept('all');
    setPage(1);
  };

  const hasFilters = search || filterStatus !== 'all' || filterDept !== 'all';

  const getStatusInfo = (status) => STATUS_MAP[status] || STATUS_MAP['not_started'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading employees...</p>
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
            onClick={fetchEmployees}
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
        <h1 className="text-2xl font-bold text-gray-900">All Employees</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Monitor onboarding progress for {employees.length} employees across all departments
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search employees…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <FunnelIcon className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Onboarded</option>
            </select>
          </div>

          <select
            value={filterDept}
            onChange={(e) => {
              setFilterDept(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-purple-500"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'all' ? 'All Departments' : d}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-4 w-4" /> Clear
            </button>
          )}

          <span className="ml-auto text-sm text-gray-400 font-medium">{filtered.length} results</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1.5fr_1.3fr_0.8fr] px-5 py-3 bg-gray-50 border-b border-gray-100 min-w-[700px]">
          {['Employee', 'Department', 'HR Manager', 'Progress', 'Status', 'Action'].map((h) => (
            <span key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {h}
            </span>
          ))}
        </div>

        {paginated.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            {hasFilters ? 'No employees match your filters.' : 'No employees found.'}
          </div>
        ) : (
          paginated.map((emp, i) => {
            const st = getStatusInfo(emp.onboardingStatus);
            return (
              <div
                key={emp.id || emp._id || i}
                className={`grid grid-cols-[2fr_1.2fr_1.2fr_1.5fr_1.3fr_0.8fr] px-5 py-4 items-center hover:bg-gray-50 transition-colors min-w-[700px] ${
                  i < paginated.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-700 flex-shrink-0">
                    {initials(emp.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{emp.name || 'Unnamed'}</p>
                    <p className="text-xs text-gray-400">{emp.position || emp.email || 'No position'}</p>
                  </div>
                </div>

                <span className="text-sm text-gray-600">{emp.department || '—'}</span>
                <span className="text-sm text-gray-600">{emp.hrName || '—'}</span>
                <ProgressBar value={emp.progress} />

                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full w-fit ${st.cls}`}>
                  {st.label}
                </span>

                <button
                  onClick={() => setSelected(emp)}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-800 hover:underline"
                >
                  Details
                </button>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
          </button>

          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let pageNum;
            if (totalPages <= 7) {
              pageNum = i + 1;
            } else if (page <= 4) {
              pageNum = i + 1;
            } else if (page >= totalPages - 3) {
              pageNum = totalPages - 6 + i;
            } else {
              pageNum = page - 3 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                  pageNum === page
                    ? 'bg-purple-600 text-white'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRightIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
          <div className="bg-white w-96 h-full overflow-y-auto shadow-2xl p-6 space-y-5 animate-slide-in">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Employee Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 mx-auto flex items-center justify-center text-2xl font-bold text-purple-700 mb-3">
                {initials(selected.name)}
              </div>
              <p className="text-lg font-bold text-gray-900">{selected.name || 'Unnamed'}</p>
              <p className="text-sm text-gray-500">{selected.email || 'No email'}</p>
              <span
                className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${
                  getStatusInfo(selected.onboardingStatus).cls
                }`}
              >
                {getStatusInfo(selected.onboardingStatus).label}
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">Overall Progress</p>
              <ProgressBar value={selected.progress} />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {selected.completedTasks || 0} / {selected.totalTasks || 0} tasks completed
              </p>
            </div>

            {[
              ['Position', selected.position],
              ['Department', selected.department],
              ['HR Manager', selected.hrName],
              ['Template', selected.templateName],
              ['Start Date', selected.startDate ? new Date(selected.startDate).toLocaleDateString() : '—'],
              ['Completed', selected.completedDate ? new Date(selected.completedDate).toLocaleDateString() : '—'],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{k}</span>
                  <span className="text-sm font-semibold text-gray-800">{v}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default AdminEmployees;