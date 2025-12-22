// client/src/components/AddressManager.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { showSuccess, showError, confirmAction } from '../utils/swal';

// Address Modal Component
const AddressModal = ({ address, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: address || {
      label: '',
      street: '',
      city: '',
      postal_code: '',
      is_default: false,
    },
  });

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div
          className="relative p-5 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #03BEB0 0%, #065D5F 100%)' }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[22px]">
                  {address ? 'edit_location_alt' : 'add_location_alt'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {address ? 'Edit Alamat' : 'Tambah Alamat Baru'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-white text-[20px]">close</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-gray-400">label</span>
                Label Alamat
              </label>
              <input
                type="text"
                {...register('label', { required: 'Label wajib diisi' })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                placeholder="Contoh: Rumah, Kantor, dll"
              />
              {errors.label && <p className="mt-1 text-xs text-red-500">{errors.label.message}</p>}
            </div>

            {/* Street */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-gray-400">signpost</span>
                Alamat Lengkap
              </label>
              <input
                type="text"
                {...register('street', { required: 'Alamat wajib diisi' })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                placeholder="Jalan, No. Rumah, RT/RW, Kelurahan"
              />
              {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street.message}</p>}
            </div>

            {/* City & Postal Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-gray-400">location_city</span>
                  Kota
                </label>
                <input
                  type="text"
                  {...register('city', { required: 'Kota wajib diisi' })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                  placeholder="Nama Kota"
                />
                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-gray-400">markunread_mailbox</span>
                  Kode Pos
                </label>
                <input
                  type="text"
                  {...register('postal_code')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                  placeholder="12345"
                />
              </div>
            </div>

            {/* Default Checkbox */}
            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('is_default')}
                  className="w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500 transition-colors"
                />
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-teal-500 transition-colors">home</span>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Jadikan alamat utama</span>
                </div>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90"
              style={{ backgroundColor: '#03BEB0' }}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Menyimpan...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Simpan Alamat
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Main AddressManager Component
export default function AddressManager() {
  const profile = useAuthStore((s) => s.profile);
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAddresses = async () => {
    if (profile?.id) {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/users/me/addresses`);
        setAddresses(data);
      } catch (error) {
        console.error('Failed to load addresses:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [profile]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleModalSave = async (data) => {
    try {
      if (editingAddress) {
        await api.put(`/users/me/addresses/${editingAddress.address_id}`, data);
        showSuccess('Alamat berhasil diperbarui!');
      } else {
        await api.post(`/users/me/addresses`, data);
        showSuccess('Alamat baru berhasil ditambahkan!');
      }
      handleModalClose();
      loadAddresses();
    } catch (error) {
      console.error('Failed to save address:', error);
      showError('Gagal menyimpan alamat.');
    }
  };

  const handleDelete = async (addressId) => {
    const isConfirmed = await confirmAction(
      'Hapus Alamat?',
      'Alamat ini akan dihapus secara permanen.',
      'Ya, Hapus',
      'Batal'
    );
    if (isConfirmed) {
      try {
        await api.delete(`/users/me/addresses/${addressId}`);
        showSuccess('Alamat berhasil dihapus!');
        loadAddresses();
      } catch (error) {
        console.error('Failed to delete address:', error);
        showError('Gagal menghapus alamat.');
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div
        className="p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #E6F7F6 0%, #F0F7F7 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: 'linear-gradient(135deg, #03BEB0 0%, #065D5F 100%)' }}
            >
              <span className="material-symbols-outlined text-white text-[24px]">location_on</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Alamat Saya</h2>
              <p className="text-sm text-gray-500">Kelola alamat pengiriman Anda</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingAddress(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold transition-all hover:opacity-90 shadow-sm"
            style={{ backgroundColor: '#03BEB0' }}
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="material-symbols-outlined text-[48px] text-gray-300 animate-spin">progress_activity</span>
            <p className="text-gray-400 mt-3">Memuat alamat...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, #E6F7F6 0%, #F0F7F7 100%)' }}
            >
              <span className="material-symbols-outlined text-[40px]" style={{ color: '#03BEB0' }}>add_location</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Belum Ada Alamat</h3>
            <p className="text-gray-500 text-sm mb-4">Tambahkan alamat pengiriman untuk mempermudah pemesanan</p>
            <button
              onClick={() => {
                setEditingAddress(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#03BEB0' }}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Tambah Alamat Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.address_id}
                className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-teal-200 rounded-xl p-4 transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ color: addr.is_default ? '#03BEB0' : '#9CA3AF' }}
                      >
                        {addr.is_default ? 'home' : 'location_on'}
                      </span>
                      <span className="font-bold text-gray-800">{addr.label}</span>
                      {addr.is_default && (
                        <span
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#E6F7F6', color: '#065D5F' }}
                        >
                          Utama
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{addr.street}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {addr.city}{addr.postal_code ? `, ${addr.postal_code}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingAddress(addr);
                        setIsModalOpen(true);
                      }}
                      className="w-9 h-9 rounded-lg hover:bg-teal-50 flex items-center justify-center transition-colors"
                      title="Edit alamat"
                    >
                      <span className="material-symbols-outlined text-[18px]" style={{ color: '#03BEB0' }}>edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(addr.address_id)}
                      className="w-9 h-9 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
                      title="Hapus alamat"
                    >
                      <span className="material-symbols-outlined text-[18px] text-red-500">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddressModal
          address={editingAddress}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}