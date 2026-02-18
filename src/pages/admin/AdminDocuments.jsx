import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  DocumentIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { adminApi } from '../../services/api';
const STATUS_STYLES = {
  approved: { cls: 'bg-emerald-100 text-emerald-700', label: 'Approved' },
  pending:  { cls: 'bg-amber-100   text-amber-700',   label: 'Pending'  },
  rejected: { cls: 'bg-red-100     text-red-600',     label: 'Rejected' },
};

const FileIcon = ({ filename = '' }) => {
  const ext = filename.split('.').pop().toLowerCase();
  return ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)
    ? <PhotoIcon   className="h-7 w-7 text-blue-400" />
    : <DocumentIcon className="h-7 w-7 text-purple-400" />;
};

const AdminDocuments = () => {
  const [documents, setDocuments]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage]                 = useState(1);
  const PER_PAGE = 12;

  useEffect(() => {
    adminApi.getAllDocuments()
      .then((res) => setDocuments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = documents.filter((d) => {
    const s = search.toLowerCase();
    const matchSearch =
      !s ||
      (d.employeeName || '').toLowerCase().includes(s) ||
      (d.filename      || '').toLowerCase().includes(s) ||
      (d.taskTitle     || '').toLowerCase().includes(s);
    const matchStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const downloadUrl = (id) =>
    `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/admin/documents/${id}/download`;

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Documents</h1>
        <p className="text-gray-500 mt-1 text-sm">
          View every uploaded document across all employees and departments
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: documents.length,                                     color: 'text-purple-600' },
          { label: 'Approved',         value: documents.filter((d) => d.status === 'approved').length, color: 'text-emerald-600' },
          { label: 'Pending Review',   value: documents.filter((d) => d.status === 'pending').length,  color: 'text-amber-500' },
          { label: 'Rejected',         value: documents.filter((d) => d.status === 'rejected').length, color: 'text-red-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{s.label}</p>
            <p className={`text-3xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search documents or employee…"
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-72
                       focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                filterStatus === s
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-purple-300'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Loading documents…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginated.length === 0 ? (
              <p className="col-span-full text-center text-gray-400 text-sm py-20">
                No documents found.
              </p>
            ) : (
              paginated.map((doc) => {
                const st = STATUS_STYLES[doc.status] || STATUS_STYLES.pending;
                return (
                  <div
                    key={doc._id}
                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm
                               hover:border-purple-200 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100
                                      flex items-center justify-center">
                        <FileIcon filename={doc.filename} />
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-gray-900 truncate mb-1">
                      {doc.filename || 'Unknown file'}
                    </p>
                    <p className="text-xs text-gray-400 mb-4">{doc.taskTitle || 'Document upload'}</p>

                    <div className="border-t border-gray-50 pt-3 flex justify-between items-center mb-3">
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{doc.employeeName}</p>
                        <p className="text-xs text-gray-400">{doc.department}</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '—'}
                      </p>
                    </div>

                    <a
                      href={downloadUrl(doc._id)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-purple-50 hover:bg-purple-100
                                 text-purple-700 text-xs font-semibold py-2 rounded-xl transition-colors"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                );
              })
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600
                           hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                ← Prev
              </button>
              <span className="px-4 py-2 text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600
                           hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDocuments;