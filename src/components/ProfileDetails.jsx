import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { showSuccess, showError, confirmAction } from '../utils/swal';

export default function ProfileDetails() {
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const logout = useAuthStore((s) => s.logout);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { isDirty, isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      phone_number: '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        phone_number: profile.phone_number || '',
      });
    }
  }, [profile, reset]);

  const onUpdateProfile = async (data) => {
    try {
      const { data: updatedProfile } = await api.put('/users/me', data);
      setProfile(updatedProfile);
      reset(updatedProfile);
      setIsEditing(false);
      showSuccess('Profil berhasil diperbarui!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      showError('Gagal memperbarui profil.');
    }
  };

  const onDeleteAccount = async () => {
    const isConfirmed = await confirmAction(
      'Hapus Akun?',
      'Tindakan ini permanen dan tidak dapat dibatalkan. Semua data Anda akan dihapus.',
      'Ya, Hapus',
      'Batal'
    );
    if (isConfirmed) {
      try {
        await api.delete('/users/me');
        showSuccess('Akun berhasil dihapus.');
        logout();
      } catch (error) {
        console.error('Failed to delete account:', error);
        showError('Gagal menghapus akun.');
      }
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Format member since date
  const getMemberSince = () => {
    if (!profile?.created_at) return '-';
    const date = new Date(profile.created_at);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Header with Avatar */}
      <div
        className="p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #03BEB0 0%, #065D5F 100%)' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-6 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm12 0c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative flex items-center gap-4">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-white/30"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: 'white' }}
          >
            {getInitials(profile?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white truncate">{profile?.name || 'User'}</h2>
            <p className="text-sm text-white/80 truncate flex items-center gap-1.5 mt-1">
              <span className="material-symbols-outlined text-[16px]">mail</span>
              {profile?.email}
            </p>
            <p className="text-xs text-white/60 mt-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">calendar_month</span>
              Member sejak {getMemberSince()}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit(onUpdateProfile)}>
        <div className="p-5 space-y-5">
          {/* Section Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]" style={{ color: '#03BEB0' }}>badge</span>
              <h3 className="font-semibold text-gray-800">Informasi Akun</h3>
            </div>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-sm font-medium transition-all hover:opacity-80 px-3 py-1.5 rounded-lg hover:bg-teal-50"
                style={{ color: '#03BEB0' }}
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Edit
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-gray-400">person</span>
                Nama Lengkap
              </label>
              {isEditing ? (
                <input
                  type="text"
                  {...register('name', { required: 'Nama wajib diisi' })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                  placeholder="Masukkan nama lengkap"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 font-medium">
                  {profile?.name || '-'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-gray-400">phone</span>
                Nomor Telepon
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  {...register('phone_number')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                  placeholder="Contoh: 08123456789"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 font-medium">
                  {profile?.phone_number || '-'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-gray-400">mail</span>
                Email
                <span className="ml-1 text-xs text-gray-400 font-normal">(tidak dapat diubah)</span>
              </label>
              <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-500">
                {profile?.email || '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {isEditing ? (
          <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                reset();
              }}
              className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              Batal
            </button>
            <button
              type="submit"
              disabled={!isDirty || isSubmitting}
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
                  Simpan
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="px-5 py-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onDeleteAccount}
              className="w-full py-3 px-4 text-red-500 font-medium rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2 border border-red-100"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              Hapus Akun
            </button>
          </div>
        )}
      </form>
    </div>
  );
}