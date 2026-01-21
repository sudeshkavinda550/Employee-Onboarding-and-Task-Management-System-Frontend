import React, { useState, useEffect } from 'react';
import { employeeApi } from '../../api';
import ProfileView from '../../components/profile/ProfileView';
import ProfileForm from '../../components/profile/ProfileForm';
import { toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await employeeApi.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data) => {
    try {
      await employeeApi.updateProfile(data);
      await fetchProfile();
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage your personal information
          </p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Edit Profile
          </button>
        )}
      </div>

      {editing ? (
        <ProfileForm
          user={user}
          onSubmit={handleUpdateProfile}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <ProfileView user={user} onEdit={() => setEditing(true)} />
      )}
    </div>
  );
};

export default Profile;