import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { adminApi } from '../../services/api';
const ROLE_MAP = {
  admin:    { cls: 'bg-purple-100 text-purple-700', label: 'ADMIN', dot: 'bg-purple-500'  },
  hr:       { cls: 'bg-blue-100   text-blue-700',   label: 'HR',    dot: 'bg-blue-500'    },
  employee: { cls: 'bg-emerald-100 text-emerald-700', label: 'EMP', dot: 'bg-emerald-500' },
  system:   { cls: 'bg-amber-100  text-amber-700',  label: 'SYS',   dot: 'bg-amber-400'   },
};

const ACTION_TYPES = [
  'all', 'login', 'logout', 'create_account', 'suspend_account', 'delete_account',
  'create_template', 'assign_template', 'complete_task', 'upload_document',
  'approve_document', 'reject_document', 'send_reminder', 'onboarding_complete', 'update_settings',
];

const ROLE_ICON = { admin: '⭐', hr: '👔', employee: '👤', system: '⚡' };
const PER_PAGE = 15;

const AdminAuditLog = () => {
  const [logs, setLogs]                 = useState([]);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [page, setPage]                 = useState(1);
  const [filterRole, setFilterRole]     = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [search, setSearch]             = useState('');
  const [dateFrom, setDateFrom]         = useState('');
  const [dateTo, setDateTo]             = useState('');

  useEffect(() => { fetchLogs(); }, [page, filterRole, filterAction, search, dateFrom, dateTo]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAuditLog({
        page,
        limit:  PER_PAGE,
        role:   filterRole   !== 'all' ? filterRole   : undefined,
        action: filterAction !== 'all' ? filterAction : undefined,
        search: search   || undefined,
        dateFrom: dateFrom || undefined,
        dateTo:   dateTo   || undefined,
      });
      setLogs(res.data.logs || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await adminApi.exportAuditLog({ responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url; a.download = 'audit-log.csv'; a.click();
      window.URL.revokeObjectURL(url);
    } catch { alert('Export failed.'); }
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="p-6 space-y-6">

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Complete record of all system actions for compliance and debugging
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white
                     text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search actor, action, detail…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                         focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <FunnelIcon className="h-4 w-4 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white
                         focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="hr">HR</option>
              <option value="employee">Employee</option>
              <option value="system">System</option>
            </select>
          </div>

          <select
            value={filterAction}
            onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white
                       focus:outline-none focus:border-purple-500 max-w-[200px]"
          >
            {ACTION_TYPES.map((a) => (
              <option key={a} value={a}>
                {a === 'all' ? 'All Actions' : a.replace(/_/g, ' ')}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white
                       focus:outline-none focus:border-purple-500"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white
                       focus:outline-none focus:border-purple-500"
          />

          <span className="ml-auto text-sm text-gray-400 font-medium">{total} entries</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', 'admin', 'hr', 'employee', 'system'].map((r) => (
            <button
              key={r}
              onClick={() => { setFilterRole(r); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors capitalize ${
                filterRole === r
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              {r === 'all' ? 'All' : r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <div className="grid grid-cols-[28px_100px_160px_1fr_130px] px-5 py-3
                        bg-gray-50 border-b border-gray-100 min-w-[640px] gap-4">
          {['', 'Role', 'Actor', 'Action & Detail', 'Timestamp'].map((h) => (
            <span key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading log entries…</div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No log entries match your filters.
          </div>
        ) : (
          logs.map((log, i) => {
            const rs = ROLE_MAP[log.actorRole] || ROLE_MAP.system;
            return (
              <div
                key={log._id}
                className={`grid grid-cols-[28px_100px_160px_1fr_130px] px-5 py-3.5 items-center
                            hover:bg-gray-50 transition-colors min-w-[640px] gap-4
                            ${i < logs.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${rs.dot}`} />

                <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5
                                  rounded-md tracking-wide ${rs.cls}`}>
                  {rs.label}
                </span>

                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base leading-none">{ROLE_ICON[log.actorRole] || '•'}</span>
                  <span className="text-sm font-medium text-gray-600 truncate">{log.actorName}</span>
                </div>

                <div className="min-w-0">
                  <span className="text-sm font-semibold text-gray-800 capitalize">
                    {log.action?.replace(/_/g, ' ')}
                  </span>
                  {log.detail && (
                    <span className="text-sm text-gray-400 ml-2 truncate">— {log.detail}</span>
                  )}
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-purple-600">
                    {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : '—'}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">
                    {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : ''}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold
                       text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >«</button>

          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
          </button>

          <span className="px-4 text-sm text-gray-600">Page {page} of {totalPages}</span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronRightIcon className="h-4 w-4 text-gray-600" />
          </button>

          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold
                       text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >»</button>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLog;