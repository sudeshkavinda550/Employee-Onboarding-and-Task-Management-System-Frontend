import React, { useState, useEffect } from 'react';
import { documentApi } from '../../api';
import { 
  DocumentArrowUpIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  EyeIcon
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
      case 'approved': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending': return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="mt-1 text-sm text-gray-600">
            Upload and manage your onboarding documents
          </p>
        </div>
        <button
          onClick={() => {/* Handle upload */}}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
          Upload New
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'all' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            All Documents ({documents.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            Pending ({documents.filter(d => d.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'approved' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            Approved ({documents.filter(d => d.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${filter === 'rejected' ? 'bg-red-100 text-red-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            Rejected ({documents.filter(d => d.status === 'rejected').length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <div key={document.id} className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
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
                <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(document.status)}`}>
                  {document.status || 'unknown'}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">File Name</p>
                <p className="text-sm text-gray-900 truncate">{document.filename || 'No filename'}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">File Size</p>
                <p className="text-sm text-gray-900">
                  {document.fileSize ? `${(document.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                </p>
              </div>

              {document.rejectionReason && document.status === 'rejected' && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-700">{document.rejectionReason}</p>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(document.id, document.filename)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                  Download
                </button>
                <button
                  onClick={() => {/* Handle preview */}}
                  className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded"
                  title="Preview"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(document.id)}
                  className="p-2 text-gray-400 hover:text-red-600 border border-gray-300 rounded"
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
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No documents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' 
              ? 'You haven\'t uploaded any documents yet.'
              : `No documents with status "${filter}"`}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyDocuments;