// client/src/pages/admin/AdminProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { format } from 'date-fns';
import { FiEdit, FiTrash2, FiX, FiMapPin } from 'react-icons/fi';

export default function AdminProfilePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setProfiles(data);
    } catch (error) {
      console.error("Failed to load profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleEditClick = (profile) => {
    setCurrentProfile({ ...profile });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile? This action is permanent.')) {
      try {
        await api.delete(`/users/${profileId}`);
        loadProfiles();
      } catch (error) {
        console.error("Failed to delete profile:", error);
        alert('Failed to delete profile.');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentProfile(null);
  };

  const handleModalSave = async () => {
    try {
      await api.put(`/users/${currentProfile.id}`, {
        name: currentProfile.name,
        phone_number: currentProfile.phone_number,
        role: currentProfile.role,
      });
      handleModalClose();
      loadProfiles();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert('Failed to update profile.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Profiles</h1>
      
      {/* Profile List */}
      <div className="bg-white border rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : profiles.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{p.name || '-'}</div>
                  <div className="text-sm text-gray-500">{p.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    p.role === 'admin' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {p.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.phone_number || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(p.created_at), 'dd MMM yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <Link
                    to={`/admin/profiles/${p.id}/addresses`}
                    className="text-blue-600 hover:text-blue-900 inline-block"
                    title="Manage Addresses"
                  >
                    <FiMapPin />
                  </Link>
                  <button onClick={() => handleEditClick(p)} className="text-emerald-600 hover:text-emerald-900">
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDeleteClick(p.id)} className="text-red-600 hover:text-red-900">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && currentProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <button onClick={handleModalClose} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentProfile.name || ''}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={currentProfile.phone_number || ''}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={currentProfile.role}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="customer">customer</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSave}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}