import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PhotoIcon, XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

const ProfileForm = ({ user, onSubmit, onCancel, onProfilePictureUpload, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || '');
  const [uploadingPicture, setUploadingPicture] = useState(false);

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
      // First upload profile picture if selected
      if (selectedFile && onProfilePictureUpload) {
        try {
          setUploadingPicture(true);
          await onProfilePictureUpload(selectedFile);
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          return; // Don't submit the form if picture upload fails
        } finally {
          setUploadingPicture(false);
        }
      }
      
      // Then submit the form data
      onSubmit(values);
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    setPreviewUrl('');
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
          <div className="space-y-3">
            <div>
              <label className="relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploadingPicture}
                />
                <div className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 w-fit">
                  <CloudArrowUpIcon className="h-4 w-4" />
                  {selectedFile ? 'Change Photo' : 'Upload Photo'}
                </div>
              </label>
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemovePicture}
                  className="ml-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                  disabled={uploadingPicture}
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              JPG, PNG up to 2MB. {uploadingPicture && 'Uploading...'}
            </p>
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
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
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