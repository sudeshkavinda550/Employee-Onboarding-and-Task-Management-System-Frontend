import React, { useState, useEffect } from 'react';
import { documentApi } from '../../api';
import { 
  DocumentArrowUpIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  EyeIcon,
  FolderIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentApi.getMyDocuments();
      setDocuments(response.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, filename) => {
    try {
      const response = await documentApi.downloadDocument(documentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentApi.deleteDocument(documentId);
        fetchDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (filter === 'all') return true;
    return doc.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon className="h-5 w-5 text-emerald-500" />;
      case 'rejected': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending': return <ClockIcon className="h-5 w-5 text-amber-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const stats = {
    total: documents.length,
    approved: documents.filter(d => d.status === 'approved').length,
    pending: documents.filter(d => d.status === 'pending').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent absolute inset-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 w-full">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .doc-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .doc-card:hover { transform: translateY(-4px); }
      `}</style>

      <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              My Documents 📁
            </h1>
            <p className="text-gray-600 text-lg">
              Upload and manage your onboarding documents
            </p>
          </div>
          
          <button
            onClick={() => {/* Handle upload */}}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <DocumentArrowUpIcon className="h-5 w-5" />
            Upload New Document
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-sm p-6 text-white"
               style={{ animation: 'slideUp 0.6s ease-out', opacity: 0, animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">TOTAL FILES</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <FolderIcon className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-sm p-6 text-white"
               style={{ animation: 'slideUp 0.6s ease-out', opacity: 0, animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">APPROVED</p>
                <p className="text-3xl font-bold">{stats.approved}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <CheckCircleIcon className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-sm p-6 text-white"
               style={{ animation: 'slideUp 0.6s ease-out', opacity: 0, animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">PENDING</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <ClockIcon className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl shadow-sm p-6 text-white"
               style={{ animation: 'slideUp 0.6s ease-out', opacity: 0, animationDelay: '300ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">REJECTED</p>
                <p className="text-3xl font-bold">{stats.rejected}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <XCircleIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Documents ({stats.total})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filter === 'pending' 
                  ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filter === 'approved' 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filter === 'rejected' 
                  ? 'bg-red-100 text-red-700 border border-red-200' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document, index) => (
            <div 
              key={document.id} 
              className="doc-card bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              style={{
                animation: 'slideUp 0.5s ease-out',
                animationDelay: `${400 + index * 50}ms`,
                opacity: 0,
                animationFillMode: 'forwards'
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(document.status)}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {document.taskTitle || 'Document'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {document.uploadedDate ? new Date(document.uploadedDate).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-lg border ${getStatusColor(document.status)}`}>
                    {document.status || 'unknown'}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">File Name</p>
                    <p className="text-sm text-gray-900 truncate font-medium">{document.filename || 'No filename'}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">File Size</p>
                    <p className="text-sm text-gray-900">
                      {document.fileSize ? `${(document.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                    </p>
                  </div>
                </div>

                {document.rejectionReason && document.status === 'rejected' && (
                  <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-xs font-medium text-red-800 mb-1">Rejection Reason</p>
                    <p className="text-sm text-red-700">{document.rejectionReason}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(document.id, document.filename)}
                    className="flex-1 flex items-center justify-center px-3 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
                    Download
                  </button>
                  <button
                    onClick={() => {/* Handle preview */}}
                    className="p-2.5 text-gray-600 hover:text-indigo-600 bg-gray-100 hover:bg-indigo-50 rounded-xl transition-all"
                    title="Preview"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(document.id)}
                    className="p-2.5 text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
            <DocumentArrowUpIcon className="mx-auto h-16 w-16 text-indigo-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'You haven\'t uploaded any documents yet.' 
                : `No documents with status "${filter}"`}
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
              <DocumentArrowUpIcon className="h-5 w-5" />
              Upload Your First Document
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDocuments;