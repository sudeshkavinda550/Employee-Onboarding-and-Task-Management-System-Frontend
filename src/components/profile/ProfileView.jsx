import React from 'react';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarIcon, 
  BuildingOfficeIcon,
  IdentificationIcon,
  MapPinIcon,
  UserCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const ProfileView = ({ user, onEdit }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const InfoRow = ({ icon: Icon, label, value, className = '' }) => (
    <div className={`flex items-center py-3 ${className}`}>
      <Icon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-sm text-gray-900">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Edit Profile
          </button>
        )}
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-16 w-16 text-primary-600" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-lg text-gray-600">{user?.position}</p>
            <div className="mt-2 flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Active
              </span>
              <span className="text-sm text-gray-500">
                Employee ID: {user?.employeeId}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Section title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InfoRow icon={IdentificationIcon} label="Full Name" value={user?.name} />
            <InfoRow icon={EnvelopeIcon} label="Email" value={user?.email} />
            <InfoRow icon={PhoneIcon} label="Phone" value={user?.phone} />
            <InfoRow icon={CalendarIcon} label="Date of Birth" value={formatDate(user?.dateOfBirth)} />
          </div>
          <div className="space-y-4">
            <InfoRow icon={MapPinIcon} label="Address" value={user?.address} />
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Emergency Contact</h3>
              <div className="space-y-2 ml-8">
                <p className="text-sm text-gray-900">{user?.emergencyContactName || 'Not provided'}</p>
                <p className="text-sm text-gray-600">{user?.emergencyContactPhone}</p>
                {user?.emergencyContactRelation && (
                  <p className="text-sm text-gray-500">({user.emergencyContactRelation})</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Employment Details">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <InfoRow icon={BuildingOfficeIcon} label="Department" value={user?.department} />
            <InfoRow icon={UserCircleIcon} label="Position" value={user?.position} />
          </div>
          <div className="space-y-4">
            <InfoRow icon={IdentificationIcon} label="Employee ID" value={user?.employeeId} />
            <InfoRow icon={CalendarIcon} label="Start Date" value={formatDate(user?.startDate)} />
          </div>
          <div className="space-y-4">
            <InfoRow icon={CalendarIcon} label="Onboarding Completed" value={formatDate(user?.onboardingCompletedDate)} />
            {user?.manager && (
              <div>
                <p className="text-sm font-medium text-gray-500">Manager</p>
                <p className="mt-1 text-sm text-gray-900">{user.manager.name}</p>
                <p className="text-sm text-gray-600">{user.manager.email}</p>
              </div>
            )}
          </div>
        </div>
      </Section>

      {user?.onboardingProgress && (
        <Section title="Onboarding Progress">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Overall Progress</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
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
                className="bg-primary-600 rounded-full h-3 transition-all duration-300"
                style={{ width: `${user.onboardingProgress.percentage}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Pending</p>
                <p className="mt-1 text-2xl font-bold text-blue-900">
                  {user.onboardingProgress.total - user.onboardingProgress.completed}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-800">Completed</p>
                <p className="mt-1 text-2xl font-bold text-green-900">{user.onboardingProgress.completed}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">In Progress</p>
                <p className="mt-1 text-2xl font-bold text-yellow-900">
                  {user.onboardingProgress.inProgress || 0}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-800">Overdue</p>
                <p className="mt-1 text-2xl font-bold text-purple-900">
                  {user.onboardingProgress.overdue || 0}
                </p>
              </div>
            </div>
          </div>
        </Section>
      )}
    </div>
  );
};

export default ProfileView;