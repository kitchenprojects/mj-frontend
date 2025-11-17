// client/src/components/ProfileDetails.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { FiUser, FiSave, FiTrash2 } from 'react-icons/fi';

export default function ProfileDetails() {
  // --- ✨ FIX: Select each value individually ---
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const logout = useAuthStore((s) => s.logout);
  // --- End of Fix ---
  
  const { register, handleSubmit, reset, formState: { isDirty, isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      phone_number: '',
    },
  });

  // Load profile data into the form when it's available
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        phone_number: profile.phone_number || '',
      });
    }
  }, [profile, reset]);

  // Handle Profile Update
  const onUpdateProfile = async (data) => {
    try {
      const { data: updatedProfile } = await api.put('/users/me', data);
      setProfile(updatedProfile); // Update global state
      reset(updatedProfile); // Reset form to new values
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile.');
    }
  };

  // Handle Account Deletion
  const onDeleteAccount = async () => {
    if (window.confirm('Are you sure? This action is permanent and cannot be undone.')) {
      try {
        await api.delete('/users/me');
        alert('Account deleted successfully.');
        logout(); // Log the user out
      } catch (error) {
        console.error('Failed to delete account:', error);
        alert('Failed to delete account.');
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-3 p-4 border-b">
        <FiUser className="text-emerald-600" size={20} />
        <h2 className="text-lg font-semibold text-gray-800">My Details</h2>
      </div>

      <form onSubmit={handleSubmit(onUpdateProfile)}>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone_number"
              type="tel"
              {...register('phone_number')}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email (Cannot be changed)
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="mt-1 block w-full bg-gray-100 border-gray-300 cursor-not-allowed"
            />
          </div>
        </div>
        
        {/* Footer with actions */}
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
          <button
            type="button"
            onClick={onDeleteAccount}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            <FiTrash2 />
            Delete Account
          </button>
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            <FiSave />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}