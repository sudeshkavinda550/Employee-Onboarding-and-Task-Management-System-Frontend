import React, { useState, useEffect } from 'react';
import authApi from '../../api/authApi';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarIcon, 
  BuildingOfficeIcon,
  IdentificationIcon,
  MapPinIcon,
  UserCircleIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ProfileForm from '../../components/profile/ProfileForm';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authApi.getProfile();

      const transformedUser = {
        ...response.data,
        dateOfBirth: response.data.date_of_birth,
        employeeId: response.data.employee_id,
        profilePicture: response.data.profile_picture,
        startDate: response.data.start_date,
        emergencyContactName: response.data.emergency_contact_name,
        emergencyContactPhone: response.data.emergency_contact_phone,
        emergencyContactRelation: response.data.emergency_contact_relation,
        department: response.data.department_name || response.data.department_id,
        manager: response.data.manager_name ? {
          name: response.data.manager_name,
          email: response.data.manager_email
        } : null,
        onboardingProgress: response.data.onboardingProgress || {
          total: 0,
          completed: 0,
          percentage: 0
        }
      };
      
      setUser(transformedUser);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data) => {
    try {
      setUpdating(true);
      
      // Only send fields that are actually provided and not empty
      const backendData = {};
      
      if (data.name && data.name.trim()) {
        backendData.name = data.name.trim();
      }
      
      if (data.phone && data.phone.trim()) {
        backendData.phone = data.phone.trim();
      }
      
      if (data.dateOfBirth) {
        backendData.date_of_birth = data.dateOfBirth;
      }
      
      if (data.address && data.address.trim()) {
        backendData.address = data.address.trim();
      }
      
      // Employment fields
      if (data.position && data.position.trim()) {
        backendData.position = data.position.trim();
      }
      
      if (data.startDate) {
        backendData.start_date = data.startDate;
      }
      
      // Emergency contact fields - only send if provided
      if (data.emergencyContactName && data.emergencyContactName.trim()) {
        backendData.emergency_contact_name = data.emergencyContactName.trim();
      }
      
      if (data.emergencyContactPhone && data.emergencyContactPhone.trim()) {
        backendData.emergency_contact_phone = data.emergencyContactPhone.trim();
      }
      
      if (data.emergencyContactRelation && data.emergencyContactRelation.trim()) {
        backendData.emergency_contact_relation = data.emergencyContactRelation.trim();
      }
      
      // Check if at least one field is being updated
      if (Object.keys(backendData).length === 0) {
        toast.warning('Please update at least one field');
        setUpdating(false);
        return;
      }
      
      console.log('Sending update data:', backendData);
      
      await authApi.updateProfile(backendData);
      await fetchProfile();
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleProfilePictureUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      // Call the profile picture upload endpoint
      const response = await authApi.uploadProfilePicture(formData);
      
      // Update the user state with the new profile picture
      if (response?.data?.profile_picture) {
        setUser(prev => ({
          ...prev,
          profilePicture: response.data.profile_picture
        }));
        toast.success('Profile picture uploaded successfully');
      }
      
      return response?.data?.profile_picture;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
      throw error;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const InfoRow = ({ icon: Icon, label, value, className = '' }) => (
    <div className={`flex items-start gap-3 py-3 ${className}`}>
      <Icon className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="mt-1 text-sm text-gray-900 font-medium">{value || 'Not provided'}</p>
      </div>
    </div>
  );

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

  if (editing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 w-full">
        <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                Edit Profile ✏️
              </h1>
              <p className="text-gray-600 text-lg">
                Update your personal information
              </p>
            </div>
            <button
              onClick={() => setEditing(false)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center gap-2"
              disabled={updating}
            >
              <XMarkIcon className="h-5 w-5" />
              Cancel
            </button>
          </div>
          <ProfileForm
            user={user}
            onSubmit={handleUpdateProfile}
            onCancel={() => setEditing(false)}
            onProfilePictureUpload={handleProfilePictureUpload}
            isLoading={updating}
          />
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
      `}</style>

      <div className="px-6 py-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              My Profile 👤
            </h1>
            <p className="text-gray-600 text-lg">
              View and manage your personal information
            </p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <PencilSquareIcon className="h-5 w-5" />
            Edit Profile
          </button>
        </div>

        {/* Profile Header Card */}
        <div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          style={{ animation: 'slideUp 0.6s ease-out' }}
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex items-end gap-6 -mt-16">
              <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                {user?.profilePicture ? (
                  <img
                    src={`http://localhost:5000${user.profilePicture}`}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const nextSibling = e.target.nextElementSibling;
                      if (nextSibling) {
                        nextSibling.style.display = 'block';
                      }
                    }}
                  />
                ) : null}
                <UserCircleIcon className="h-20 w-20 text-white" style={{ display: user?.profilePicture ? 'none' : 'block' }} />
              </div>
              <div className="flex-1 mt-6">
                <h2 className="text-3xl font-bold text-gray-900">{user?.name || 'No Name'}</h2>
                <p className="text-lg text-gray-600 mt-1">{user?.position || 'No Position'}</p>
                <div className="mt-3 flex items-center gap-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                    Active
                  </span>
                  <span className="text-sm text-gray-500">
                    Employee ID: <span className="font-semibold text-gray-900">{user?.employeeId || 'Not Assigned'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6"
            style={{ animation: 'slideUp 0.6s ease-out', animationDelay: '100ms', opacity: 0, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <IdentificationIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
            </div>
            <div className="space-y-1">
              <InfoRow icon={IdentificationIcon} label="Full Name" value={user?.name} />
              <InfoRow icon={EnvelopeIcon} label="Email" value={user?.email} />
              <InfoRow icon={PhoneIcon} label="Phone" value={user?.phone} />
              <InfoRow icon={CalendarIcon} label="Date of Birth" value={formatDate(user?.dateOfBirth)} />
              <InfoRow icon={MapPinIcon} label="Address" value={user?.address} />
            </div>
          </div>

          {/* Employment Details */}
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6"
            style={{ animation: 'slideUp 0.6s ease-out', animationDelay: '200ms', opacity: 0, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <BuildingOfficeIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Employment Details</h3>
            </div>
            <div className="space-y-1">
              <InfoRow icon={UserCircleIcon} label="Position" value={user?.position} />
              <InfoRow icon={IdentificationIcon} label="Employee ID" value={user?.employeeId} />
              <InfoRow icon={CalendarIcon} label="Start Date" value={formatDate(user?.startDate)} />
              {user?.manager && (
                <div className="py-3">
                  <div className="flex items-start gap-3">
                    <UserCircleIcon className="h-5 w-5 text-indigo-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Manager</p>
                      <p className="mt-1 text-sm text-gray-900 font-medium">{user.manager.name}</p>
                      <p className="text-xs text-gray-600">{user.manager.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div 
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6"
          style={{ animation: 'slideUp 0.6s ease-out', animationDelay: '300ms', opacity: 0, animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="p-2 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl">
              <PhoneIcon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Emergency Contact</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoRow icon={UserCircleIcon} label="Contact Name" value={user?.emergencyContactName} />
            <InfoRow icon={PhoneIcon} label="Contact Phone" value={user?.emergencyContactPhone} />
            <InfoRow icon={IdentificationIcon} label="Relationship" value={user?.emergencyContactRelation} />
          </div>
        </div>

        {/* Onboarding Progress */}
        {user?.onboardingProgress && user.onboardingProgress.total > 0 && (
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6"
            style={{ animation: 'slideUp 0.6s ease-out', animationDelay: '400ms', opacity: 0, animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                <CheckCircleIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Onboarding Progress</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Overall Progress</p>
                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {user.onboardingProgress.percentage}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {user.onboardingProgress.completed} of {user.onboardingProgress.total} tasks completed
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full h-3 transition-all duration-500"
                  style={{ width: `${user.onboardingProgress.percentage}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100">
                  <p className="text-sm font-medium text-blue-800">Pending</p>
                  <p className="mt-2 text-3xl font-bold text-blue-900">
                    {user.onboardingProgress.total - user.onboardingProgress.completed}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-100">
                  <p className="text-sm font-medium text-emerald-800">Completed</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-900">{user.onboardingProgress.completed}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-100">
                  <p className="text-sm font-medium text-amber-800">In Progress</p>
                  <p className="mt-2 text-3xl font-bold text-amber-900">
                    {user.onboardingProgress.in_progress_tasks || 0}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border border-purple-100">
                  <p className="text-sm font-medium text-purple-800">Overdue</p>
                  <p className="mt-2 text-3xl font-bold text-purple-900">
                    {user.onboardingProgress.overdue_tasks || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;