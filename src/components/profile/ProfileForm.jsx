import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PhotoIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

const ProfileForm = ({ user, onSubmit, onCancel, onProfilePictureUpload, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || '');
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      address: user?.address || '',
      position: user?.position || '',
      startDate: user?.startDate ? new Date(user.startDate).toISOString().split('T')[0] : '',
      emergencyContactName: user?.emergencyContactName || '',
      emergencyContactPhone: user?.emergencyContactPhone || '',
      emergencyContactRelation: user?.emergencyContactRelation || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      phone: Yup.string().matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number'),
      dateOfBirth: Yup.date().max(new Date(), 'Date of birth cannot be in the future'),
      position: Yup.string(),
      startDate: Yup.date(),
      emergencyContactName: Yup.string(),
      emergencyContactPhone: Yup.string().matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number'),
      emergencyContactRelation: Yup.string(),
    }),
    onSubmit: async (values) => {
      setUploadError('');
      
      if (selectedFile && onProfilePictureUpload) {
        try {
          setUploadingPicture(true);
          await onProfilePictureUpload(selectedFile);
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          
          let errorMessage = 'Failed to upload profile picture. ';
          
          if (error.response) {
            const status = error.response.status;
            const serverMessage = error.response.data?.message || error.response.data?.error;
            
            switch (status) {
              case 400:
                errorMessage += serverMessage || 'Invalid file format or size. Please check the file and try again.';
                break;
              case 401:
                errorMessage += 'Your session has expired. Please log in again.';
                break;
              case 413:
                errorMessage += 'File is too large. Please select a smaller image.';
                break;
              case 415:
                errorMessage += 'Unsupported file type. Please use JPEG, PNG, GIF, or WebP.';
                break;
              default:
                errorMessage += serverMessage || 'An unexpected error occurred. Please try again.';
            }
          } else if (error.request) {
            errorMessage += 'Network error. Please check your internet connection and try again.';
          } else {
            errorMessage += error.message || 'An unexpected error occurred.';
          }
          
          setUploadError(errorMessage);
          return; 
        } finally {
          setUploadingPicture(false);
        }
      }
      
      onSubmit(values);
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUploadError(''); 
    
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        event.target.value = ''; 
        return;
      }
      
      const maxSize = 2 * 1024 * 1024; 
      if (file.size > maxSize) {
        setUploadError('File size must be less than 2MB. Please select a smaller image.');
        event.target.value = ''; 
        return;
      }
      
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.onerror = () => {
        setUploadError('Failed to read the file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    setPreviewUrl(user?.profilePicture || '');
    setUploadError('');
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
        <p className="mt-1 text-sm text-gray-600">Update your personal information</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="p-6 space-y-8">
        {/* Profile Photo */}
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <PhotoIcon className="h-12 w-12 text-white" />
              )}
            </div>
          </div>
          <div className="space-y-3 flex-1">
            <div>
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploadingPicture || isLoading}
                />
                <div className={`px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 w-fit ${
                  (uploadingPicture || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                  <CloudArrowUpIcon className="h-4 w-4" />
                  {selectedFile ? 'Change Photo' : 'Upload Photo'}
                </div>
              </label>
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemovePicture}
                  className="ml-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploadingPicture || isLoading}
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              JPG, PNG, GIF, or WebP up to 2MB
              {uploadingPicture && <span className="text-indigo-600 font-medium"> • Uploading...</span>}
            </p>
            {uploadError && (
              <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                disabled={isLoading}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1.5 text-sm text-red-600">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                disabled={isLoading}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="mt-1.5 text-sm text-red-600">{formik.errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.dateOfBirth}
                disabled={isLoading}
              />
              {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                <p className="mt-1.5 text-sm text-red-600">{formik.errors.dateOfBirth}</p>
              )}
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div>
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-gray-900">Employment Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-2">
                Position
              </label>
              <input
                type="text"
                id="position"
                name="position"
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.position}
                disabled={isLoading}
              />
              {formik.touched.position && formik.errors.position && (
                <p className="mt-1.5 text-sm text-red-600">{formik.errors.position}</p>
              )}
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.startDate}
                disabled={isLoading}
              />
              {formik.touched.startDate && formik.errors.startDate && (
                <p className="mt-1.5 text-sm text-red-600">{formik.errors.startDate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
            <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-gray-900">Address</h3>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
              Full Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
            <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-rose-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-gray-900">Emergency Contact</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label htmlFor="emergencyContactName" className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                id="emergencyContactName"
                name="emergencyContactName"
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.emergencyContactName}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="emergencyContactPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.emergencyContactPhone}
                disabled={isLoading}
              />
              {formik.touched.emergencyContactPhone && formik.errors.emergencyContactPhone && (
                <p className="mt-1.5 text-sm text-red-600">{formik.errors.emergencyContactPhone}</p>
              )}
            </div>

            <div>
              <label htmlFor="emergencyContactRelation" className="block text-sm font-semibold text-gray-700 mb-2">
                Relationship
              </label>
              <input
                type="text"
                id="emergencyContactRelation"
                name="emergencyContactRelation"
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.emergencyContactRelation}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || uploadingPicture}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || uploadingPicture}
            className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 border border-transparent rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading || uploadingPicture ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;