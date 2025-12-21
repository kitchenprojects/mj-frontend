// client/src/pages/admin/AdminProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { format } from 'date-fns';
import { FiEdit, FiTrash2, FiX, FiMapPin, FiShield, FiUsers, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { showSuccess, showError, confirmDelete, confirmAction } from '../../utils/swal';

export default function AdminProfilePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setProfiles(data);
    } catch (error) {
      console.error("Failed to load profiles:", error);
      showError('Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  // Filter profiles based on search query
  const filterProfiles = (list) => {
    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase();
    return list.filter(p =>
      (p.name?.toLowerCase().includes(query)) ||
      (p.phone_number?.includes(query)) ||
      (p.id?.toLowerCase().includes(query))
    );
  };

  // Separate profiles by role and apply filter
  const admins = filterProfiles(profiles.filter(p => p.role === 'admin'));
  const customers = filterProfiles(profiles.filter(p => p.role !== 'admin'));

  const handleEditClick = (profile) => {
    setCurrentProfile({ ...profile });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (profile) => {
    const confirmed = await confirmDelete(profile.name || 'profil ini');
    if (confirmed) {
      try {
        await api.delete(`/users/${profile.id}`);
        showSuccess('Profil berhasil dihapus');
        loadProfiles();
      } catch (error) {
        console.error("Failed to delete profile:", error);
        showError('Gagal menghapus profil');
      }
    }
  };

  const handleQuickRoleChange = async (profile, newRole) => {
    const confirmed = await confirmAction(
      'Ubah Role?',
      `Ubah role ${profile.name || 'user'} menjadi ${newRole}?`,
      'Ya, Ubah',
      'Batal'
    );
    if (confirmed) {
      try {
        await api.put(`/users/${profile.id}`, {
          name: profile.name,
          phone_number: profile.phone_number,
          role: newRole,
        });
        showSuccess(`Role berhasil diubah menjadi ${newRole}`);
        loadProfiles();
      } catch (error) {
        console.error("Failed to update role:", error);
        showError('Gagal mengubah role');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentProfile(null);
  };

  const handleModalSave = async () => {
    setSaving(true);
    try {
      await api.put(`/users/${currentProfile.id}`, {
        name: currentProfile.name,
        phone_number: currentProfile.phone_number,
        role: currentProfile.role,
      });
      showSuccess('Profil berhasil diupdate');
      handleModalClose();
      loadProfiles();
    } catch (error) {
      console.error("Failed to update profile:", error);
      showError('Gagal mengupdate profil');
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentProfile(prev => ({ ...prev, [name]: value }));
  };

  // Reusable table component
  const ProfileTable = ({ data, title, icon: Icon, iconColor, emptyMessage }) => (
    <div className="bg-white border rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <Icon size={20} />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">{data.length} pengguna</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bergabung</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  {searchQuery ? 'Tidak ditemukan hasil pencarian' : emptyMessage}
                </td>
              </tr>
            ) : data.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{p.name || '-'}</div>
                  <div className="text-xs text-gray-400 font-mono">{p.id.substring(0, 8)}...</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={p.role}
                    onChange={(e) => handleQuickRoleChange(p, e.target.value)}
                    className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer ${p.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                      }`}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {p.phone_number || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(p.created_at), 'dd MMM yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      to={`/admin/profiles/${p.id}/addresses`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Kelola Alamat"
                    >
                      <FiMapPin size={16} />
                    </Link>
                    <button
                      onClick={() => handleEditClick(p)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Edit Profil"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(p)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Pengguna</h1>
          <p className="text-gray-500 text-sm">Atur profil dan akses pengguna</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama, telepon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
          <button
            onClick={loadProfiles}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          Loading...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Admin Table */}
          <ProfileTable
            data={admins}
            title="Administrator"
            icon={FiShield}
            iconColor="bg-purple-100 text-purple-600"
            emptyMessage="Belum ada administrator"
          />

          {/* Customer Table */}
          <ProfileTable
            data={customers}
            title="Customer"
            icon={FiUsers}
            iconColor="bg-blue-100 text-blue-600"
            emptyMessage="Belum ada customer"
          />
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && currentProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Edit Profil</h3>
              <button onClick={handleModalClose} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  name="name"
                  value={currentProfile.name || ''}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Masukkan nama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                <input
                  type="text"
                  name="phone_number"
                  value={currentProfile.phone_number || ''}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role / Akses</label>
                <select
                  name="role"
                  value={currentProfile.role}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Admin memiliki akses ke panel administrasi
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t rounded-b-xl flex justify-end gap-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleModalSave}
                disabled={saving}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}