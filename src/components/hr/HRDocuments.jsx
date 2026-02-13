import React, { useState, useEffect } from 'react';
import { documentApi, taskApi } from '../../api';
import { 
  DocumentTextIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  XMarkIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const HRDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [filter]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      let response;
      
      if (filter === 'pending') {
        response = await documentApi.getPendingDocuments();
      } else {
        response = await documentApi.getAllDocuments({ status: filter });
      }
      
      const documentsData = response.data?.data || response.data;
      setDocuments(Array.isArray(documentsData) ? documentsData : []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (documentId, taskId) => {
    try {
      await documentApi.approveDocument(documentId);
      await taskApi.updateTaskStatus(taskId, { status: 'completed' });
      
      toast.success('Document approved successfully. Task completed.');
      fetchDocuments();
      setShowModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error approving document:', error);
      toast.error('Failed to approve document');
    }
  };

  const handleReject = async (documentId, taskId) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    if (rejectionReason.trim().length < 10) {
      toast.error('Rejection reason must be at least 10 characters');
      return;
    }

    if (rejectionReason.trim().length > 500) {
      toast.error('Rejection reason must be less than 500 characters');
      return;
    }

    try {
      console.log('Rejecting document:', documentId);
      console.log('Rejection reason:', rejectionReason);
      
      await documentApi.rejectDocument(documentId, rejectionReason);
      
      await taskApi.updateTaskStatus(taskId, { status: 'pending' });
      
      toast.success('Document rejected successfully. Task returned to pending.');
      fetchDocuments();
      setShowModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting document:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.error || 
                       'Failed to reject document';
      toast.error(errorMsg);
    }
  };

  const handleViewDocument = async (document) => {
    try {
      setLoadingPreview(true);
      setShowPreviewModal(true);
      setPreviewDocument(document);
      
      const response = await documentApi.downloadDocument(document.id);
      const blob = new Blob([response.data], { type: document.file_type });
      const url = window.URL.createObjectURL(blob);
      
      setPreviewDocument(prev => ({
        ...prev,
        previewUrl: url,
        blob: blob
      }));
    } catch (error) {
      console.error('Error loading document preview:', error);
      toast.error('Failed to load document preview');
      setShowPreviewModal(false);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDownload = async (documentId, filename) => {
    try {
      toast.info('Downloading document...');
      const response = await documentApi.downloadDocument(documentId);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Document downloaded successfully');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const closePreviewModal = () => {
    if (previewDocument?.previewUrl) {
      window.URL.revokeObjectURL(previewDocument.previewUrl);
    }
    setShowPreviewModal(false);
    setPreviewDocument(null);
    setLoadingPreview(false);
  };

  const openReviewModal = (doc) => {
    setSelectedDocument(doc);
    setRejectionReason('');
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1"><CheckCircleIcon className="h-3 w-3" /> Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full flex items-center gap-1"><XCircleIcon className="h-3 w-3" /> Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full flex items-center gap-1"><ClockIcon className="h-3 w-3" /> Pending</span>;
    }
  };

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    approved: documents.filter(d => d.status === 'approved').length,
    rejected: documents.filter(d => d.status === 'rejected').length
  };

  const filteredDocuments = documents.filter(doc => 
    doc.original_filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.task_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Document Review</h1>
            <p className="text-gray-600 text-lg">Review and approve employee documents</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-sm p-6 text-white" style={{ animation: 'slideUp 0.6s ease-out forwards', opacity: 0 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">TOTAL DOCUMENTS</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <FolderIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-sm p-6 text-white" style={{ animation: 'slideUp 0.6s ease-out 100ms forwards', opacity: 0 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">PENDING REVIEW</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <ClockIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-sm p-6 text-white" style={{ animation: 'slideUp 0.6s ease-out 200ms forwards', opacity: 0 }}>
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
          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl shadow-sm p-6 text-white" style={{ animation: 'slideUp 0.6s ease-out 300ms forwards', opacity: 0 }}>
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

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'pending' 
                  ? 'bg-amber-100 text-amber-700 border border-amber-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'approved' 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'rejected' 
                  ? 'bg-red-100 text-red-700 border border-red-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Rejected ({stats.rejected})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all' 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({stats.total})
            </button>
          </div>
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee or filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="font-medium">No documents found</p>
                      <p className="text-sm text-gray-500 mt-1">No documents match the current filter</p>
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <DocumentTextIcon className="h-5 w-5 text-indigo-500" />
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                            {doc.original_filename || doc.filename}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{doc.employee_name || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{doc.task_title || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {doc.uploaded_date ? new Date(doc.uploaded_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(doc.status)}
                        {doc.status === 'rejected' && doc.rejection_reason && (
                          <p className="text-xs text-red-600 mt-1 max-w-[200px] truncate" title={doc.rejection_reason}>
                            Reason: {doc.rejection_reason}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewDocument(doc)}
                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Preview"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDownload(doc.id, doc.original_filename || doc.filename)}
                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Download"
                          >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                          </button>
                          {doc.status === 'pending' && (
                            <button
                              onClick={() => openReviewModal(doc)}
                              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition"
                            >
                              Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Review Document</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setRejectionReason('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Document: {selectedDocument.original_filename || selectedDocument.filename}</p>
                <p className="text-sm text-gray-600 mt-1">Employee: {selectedDocument.employee_name}</p>
                <p className="text-sm text-gray-600">Task: {selectedDocument.task_title}</p>
                <p className="text-sm text-gray-600">Uploaded: {selectedDocument.uploaded_date ? new Date(selectedDocument.uploaded_date).toLocaleString() : 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-xs text-gray-500">(required if rejecting)</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Provide detailed reason for rejection..."
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowModal(false);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedDocument.id, selectedDocument.task_id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedDocument.id, selectedDocument.task_id)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && previewDocument && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Document Preview</h3>
                <p className="text-sm text-gray-600 mt-1">{previewDocument.original_filename || previewDocument.filename}</p>
              </div>
              <button
                onClick={closePreviewModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              {loadingPreview ? (
                <div className="flex items-center justify-center h-96">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent absolute inset-0"></div>
                  </div>
                </div>
              ) : (
                <>
                  {previewDocument.file_type?.startsWith('image/') && (
                    <img 
                      src={previewDocument.previewUrl} 
                      alt={previewDocument.original_filename}
                      className="max-w-full max-h-full mx-auto rounded-lg shadow-lg"
                    />
                  )}
                  {previewDocument.file_type === 'application/pdf' && (
                    <iframe 
                      src={previewDocument.previewUrl} 
                      className="w-full h-[70vh] rounded-lg border border-gray-300"
                      title="PDF Preview"
                    />
                  )}
                  {!previewDocument.file_type?.startsWith('image/') && 
                   previewDocument.file_type !== 'application/pdf' && (
                    <div className="text-center py-16">
                      <DocumentTextIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg text-gray-600">Preview not available for this file type</p>
                      <p className="text-sm text-gray-500 mt-2">Click download to view the file</p>
                      <button
                        onClick={() => handleDownload(previewDocument.id, previewDocument.original_filename || previewDocument.filename)}
                        className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                        Download Document
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 bg-white">
              <button
                onClick={closePreviewModal}
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRDocuments;