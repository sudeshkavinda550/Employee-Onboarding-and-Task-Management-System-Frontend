import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { documentApi } from '../../api';
import { taskApi } from '../../api/taskApi';
import { 
  DocumentArrowUpIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  EyeIcon,
  FolderIcon,
  ArrowTrendingUpIcon,
  ArrowLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const MyDocuments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const taskId = location.state?.taskId;
  const taskTitle = location.state?.taskTitle;
  const returnTo = location.state?.returnTo || '/employee/tasks';

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentApi.getMyDocuments();
      setDocuments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        e.target.value = '';
        return;
      }

      const validTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload PDF, JPG, PNG, DOC, or DOCX');
        e.target.value = '';
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('document', selectedFile);
      
      if (taskId) {
        formData.append('task_id', taskId);
      }

      const response = await documentApi.uploadDocument(formData);
      
      if (response && response.data) {
        toast.success('Document uploaded successfully!');
        setShowUploadModal(false);
        setSelectedFile(null);
        await fetchDocuments();

        if (taskId) {
          setTimeout(() => {
            const shouldComplete = window.confirm(
              '✅ Document uploaded successfully!\n\nWould you like to mark this task as complete?'
            );

            if (shouldComplete) {
              handleMarkTaskComplete();
            }
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      
      let errorMsg = 'Failed to upload document';
      
      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;
        
        switch (status) {
          case 400:
            errorMsg = serverMessage || 'Invalid file or missing required fields';
            break;
          case 401:
            errorMsg = 'Session expired. Please log in again';
            break;
          case 413:
            errorMsg = 'File is too large. Maximum size is 5MB';
            break;
          case 415:
            errorMsg = 'Unsupported file type';
            break;
          default:
            errorMsg = serverMessage || errorMsg;
        }
      } else if (error.request) {
        errorMsg = 'Network error. Please check your connection';
      }
      
      toast.error(errorMsg);
    } finally {
      setUploading(false);
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
      toast.error('Failed to download document');
    }
  };

  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentApi.deleteDocument(documentId);
        toast.success('Document deleted successfully');
        fetchDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
        toast.error('Failed to delete document');
      }
    }
  };

  const handleBackToTasks = () => {
    if (taskId) {
      const shouldGoBack = window.confirm(
        'You have not completed this task yet. Do you want to go back to tasks?'
      );
      
      if (shouldGoBack) {
        navigate(returnTo);
      }
    } else {
      navigate(returnTo);
    }
  };

  const handleMarkTaskComplete = async () => {
    if (!taskId) return;

    try {
      await taskApi.updateTaskStatus(taskId, { status: 'completed' });
      navigate(returnTo, {
        state: { successMessage: 'Task marked as complete!' }
      });
    } catch (error) {
      console.error('Error marking task complete:', error);
      toast.error('Failed to mark task as complete');
    }
  };

  const filteredDocuments = Array.isArray(documents) ? documents.filter(doc => {
    if (filter === 'all') return true;
    return doc.status === filter;
  }) : [];

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
    total: Array.isArray(documents) ? documents.length : 0,
    approved: Array.isArray(documents) ? documents.filter(d => d.status === 'approved').length : 0,
    pending: Array.isArray(documents) ? documents.filter(d => d.status === 'pending').length : 0,
    rejected: Array.isArray(documents) ? documents.filter(d => d.status === 'rejected').length : 0,
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
        {taskId && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">
                  📋 Active Task
                </p>
                <p className="text-lg font-semibold text-blue-900 mt-1">
                  {taskTitle}
                </p>
              </div>
              <button
                onClick={handleBackToTasks}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-700 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Tasks
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              My Documents 📁
            </h1>
            <p className="text-gray-600 text-lg">
              Upload and manage your onboarding documents
            </p>
          </div>
          
          <div className="flex gap-3">
            {taskId && (
              <button
                onClick={handleMarkTaskComplete}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all flex items-center gap-2"
              >
                <CheckCircleIcon className="h-5 w-5" />
                Mark Complete
              </button>
            )}
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <DocumentArrowUpIcon className="h-5 w-5" />
              Upload Document
            </button>
          </div>
        </div>

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
                        {document.task_title || document.original_filename || 'Document'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {document.uploaded_date ? new Date(document.uploaded_date).toLocaleDateString() : 'Unknown date'}
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
                    <p className="text-sm text-gray-900 truncate font-medium">{document.original_filename || document.filename || 'No filename'}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">File Size</p>
                    <p className="text-sm text-gray-900">
                      {document.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                    </p>
                  </div>
                </div>

                {document.rejection_reason && document.status === 'rejected' && (
                  <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-xs font-medium text-red-800 mb-1">Rejection Reason</p>
                    <p className="text-sm text-red-700">{document.rejection_reason}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(document.id, document.original_filename || document.filename)}
                    className="flex-1 flex items-center justify-center px-3 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
                    Download
                  </button>
                  <button
                    onClick={() => {}}
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

        {filteredDocuments.length === 0 && (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
            <DocumentArrowUpIcon className="mx-auto h-16 w-16 text-indigo-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'You haven\'t uploaded any documents yet.' 
                : `No documents with status "${filter}"`}
            </p>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              <DocumentArrowUpIcon className="h-5 w-5" />
              Upload Your First Document
            </button>
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Upload Document</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File *
                </label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                <p className="mt-1 text-xs text-gray-500">
                  PDF, JPG, PNG, DOC, DOCX (Max 5MB)
                </p>
                {selectedFile && (
                  <p className="mt-2 text-sm text-indigo-600 font-medium">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDocuments;