import React from 'react';
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
  BriefcaseIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const ProfileView = ({ user, onEdit, loading = false }) => {
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

  const Section = ({ title, icon: Icon, gradient, children, action }) => (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-6"
      style={{ animation: 'slideUp 0.6s ease-out', opacity: 0, animationFillMode: 'forwards' }}
    >
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-gradient-to-b ${gradient} rounded-xl`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <UserCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Profile Data</h3>
          <p className="text-gray-600">User profile data could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div 
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        style={{ animation: 'slideUp 0.6s ease-out' }}
      >
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        
        {/* Cover Photo */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
        
        {/* Profile Info */}
        <div className="px-8 pb-8">
          <div className="flex items-end gap-6 -mt-16">
            {/* Profile Picture */}
            <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling?.style.display = 'block';
                  }}
                />
              ) : null}
              <UserCircleIcon className="h-20 w-20 text-white" />
            </div>
            
            {/* User Info */}
            <div className="flex-1 mt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                  <p className="text-lg text-gray-600 mt-1">{user?.position}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${
                      user?.is_active ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                      {user?.is_active ? 'Active' : 'Inactive'}
                      {user?.email_verified && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                          Verified
                        </span>
                      )}
                    </span>
                    <span className="text-sm text-gray-500">
                      Employee ID: <span className="font-semibold text-gray-900">{user?.employee_id}</span>
                    </span>
                  </div>
                </div>
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <Section 
        title="Personal Information" 
        icon={IdentificationIcon}
        gradient="from-blue-500 to-cyan-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <InfoRow icon={IdentificationIcon} label="Full Name" value={user?.name} />
            <InfoRow icon={EnvelopeIcon} label="Email" value={user?.email} />
            <InfoRow icon={PhoneIcon} label="Phone" value={user?.phone} />
          </div>
          <div className="space-y-1">
            <InfoRow icon={CalendarIcon} label="Date of Birth" value={formatDate(user?.date_of_birth)} />
            <InfoRow icon={MapPinIcon} label="Address" value={user?.address} />
          </div>
        </div>
      </Section>

      {/* Employment Details */}
      <Section 
        title="Employment Details"
        icon={BriefcaseIcon}
        gradient="from-purple-500 to-pink-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <InfoRow icon={BuildingOfficeIcon} label="Department" value={user?.department_name} />
            <InfoRow icon={UserCircleIcon} label="Position" value={user?.position} />
          </div>
          <div className="space-y-1">
            <InfoRow icon={IdentificationIcon} label="Employee ID" value={user?.employee_id} />
            <InfoRow icon={CalendarIcon} label="Start Date" value={formatDate(user?.start_date)} />
          </div>
          <div className="space-y-1">
            <InfoRow icon={ClockIcon} label="Onboarding Status" value={user?.onboarding_status?.replace('_', ' ').toUpperCase()} />
            {user?.manager_name && (
              <div className="py-3">
                <div className="flex items-start gap-3">
                  <UserCircleIcon className="h-5 w-5 text-indigo-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Manager</p>
                    <p className="mt-1 text-sm text-gray-900 font-medium">{user.manager_name}</p>
                    <p className="text-xs text-gray-600">{user.manager_email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Emergency Contact */}
      {(user?.emergency_contact_name || user?.emergency_contact_phone || user?.emergency_contact_relation) && (
        <Section 
          title="Emergency Contact"
          icon={PhoneIcon}
          gradient="from-red-500 to-rose-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoRow icon={UserCircleIcon} label="Contact Name" value={user?.emergency_contact_name} />
            <InfoRow icon={PhoneIcon} label="Contact Phone" value={user?.emergency_contact_phone} />
            <InfoRow icon={IdentificationIcon} label="Relationship" value={user?.emergency_contact_relation} />
          </div>
        </Section>
      )}

      {/* Onboarding Progress */}
      {user?.onboardingProgress && (
        <Section 
          title="Onboarding Progress"
          icon={DocumentTextIcon}
          gradient="from-emerald-500 to-teal-500"
        >
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
                  {user.onboardingProgress.completed_tasks} of {user.onboardingProgress.total_tasks} tasks completed
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
                  {user.onboardingProgress.pending_tasks || 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-100">
                <p className="text-sm font-medium text-emerald-800">Completed</p>
                <p className="mt-2 text-3xl font-bold text-emerald-900">{user.onboardingProgress.completed_tasks}</p>
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
        </Section>
      )}

      {/* Additional Information */}
      <Section 
        title="Additional Information"
        icon={DocumentTextIcon}
        gradient="from-gray-500 to-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <div className="flex items-start gap-3 py-3">
              <CalendarIcon className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Created</p>
                <p className="mt-1 text-sm text-gray-900 font-medium">{formatDate(user?.created_at)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-3">
              <ClockIcon className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Updated</p>
                <p className="mt-1 text-sm text-gray-900 font-medium">{formatDate(user?.updated_at)}</p>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-start gap-3 py-3">
              <CalendarIcon className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Login</p>
                <p className="mt-1 text-sm text-gray-900 font-medium">{formatDate(user?.last_login)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 py-3">
              <CheckCircleIcon className="h-5 w-5 text-indigo-500 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Onboarding Completed</p>
                <p className="mt-1 text-sm text-gray-900 font-medium">{formatDate(user?.onboarding_completed_date)}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ProfileView;