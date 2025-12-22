// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import api from '../services/api';
import { showSuccess, showError } from '../utils/swal';

function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Account Info, 2: Address Info
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    setLoading(true);
    setAuthError(null);
    try {
      // Step 1: Create user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone_number: formData.phone_number,
          }
        }
      });

      if (error) throw error;

      // Wait for session to be established
      if (data.session) {
        // Step 2: Add address if provided
        if (formData.street && formData.city) {
          try {
            await api.post('/users/me/addresses', {
              label: formData.address_label || 'Rumah',
              street: formData.street,
              city: formData.city,
              postal_code: formData.postal_code || '',
              is_default: true
            });
          } catch (addrError) {
            console.error('Failed to save address:', addrError);
            // Continue anyway, address can be added later
          }
        }

        showSuccess('Pendaftaran berhasil! Selamat datang di Dapur Nekti.');
        navigate('/menu');
      } else {
        // Email confirmation required
        showSuccess('Pendaftaran berhasil! Silakan cek email untuk konfirmasi.');
        navigate('/login');
      }

    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
    } catch (error) {
      showError(error.message);
    }
  };

  const goToStep2 = () => {
    // Validate step 1 fields
    const values = watch();
    if (!values.name || !values.email || !values.phone_number || !values.password) {
      return;
    }
    setStep(2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="w-full">
        <div
          className="relative flex h-[200px] md:h-[260px] w-full flex-col justify-center items-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, rgba(3, 190, 176, 0.95) 0%, rgba(6, 93, 95, 0.98) 100%)`,
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-3 text-center px-4 max-w-3xl relative z-10">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-2xl">
              <span className="material-symbols-outlined text-white text-4xl">
                person_add
              </span>
            </div>
            <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Daftar
            </h1>
            <p className="text-white/80 text-sm md:text-lg font-medium leading-relaxed max-w-xl mx-auto">
              Buat akun untuk mulai pesan menu favorit Anda
            </p>
          </div>
        </div>
      </div>

      {/* Register Form */}
      <div className="flex-1 flex items-start justify-center py-8 md:py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Progress Steps */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'text-white' : 'bg-gray-200 text-gray-500'}`}
                    style={step >= 1 ? { backgroundColor: '#03BEB0' } : {}}
                  >
                    1
                  </div>
                  <span className={`text-sm font-medium ${step >= 1 ? 'text-gray-800' : 'text-gray-400'}`}>Akun</span>
                </div>
                <div className="w-12 h-0.5 bg-gray-200">
                  <div className={`h-full transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} style={{ backgroundColor: '#03BEB0' }}></div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'text-white' : 'bg-gray-200 text-gray-500'}`}
                    style={step >= 2 ? { backgroundColor: '#03BEB0' } : {}}
                  >
                    2
                  </div>
                  <span className={`text-sm font-medium ${step >= 2 ? 'text-gray-800' : 'text-gray-400'}`}>Alamat</span>
                </div>
              </div>
            </div>

            {/* Form Header */}
            <div className="p-6 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #E6F7F6 0%, #F0F7F7 100%)' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #03BEB0 0%, #065D5F 100%)' }}
                >
                  <span className="material-symbols-outlined text-white text-[24px]">
                    {step === 1 ? 'person' : 'location_on'}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {step === 1 ? 'Informasi Akun' : 'Alamat Pengiriman'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {step === 1 ? 'Isi data diri Anda' : 'Tambahkan alamat untuk pengiriman'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Error Message */}
              {authError && (
                <div className="flex items-center gap-3 p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <span>{authError}</span>
                </div>
              )}

              {/* Step 1: Google & Account Info */}
              {step === 1 && (
                <>
                  {/* Google Login */}
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Daftar dengan Google
                  </button>

                  {/* Separator */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-400 font-medium">
                        atau dengan email
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-gray-400">person</span>
                      Nama Lengkap <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Nama wajib diisi' })}
                      placeholder="Masukkan nama lengkap"
                      className={`w-full px-4 py-3 border rounded-xl text-gray-800 focus:ring-2 focus:ring-teal-100 transition-all ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'}`}
                    />
                    {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-gray-400">mail</span>
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('email', { required: 'Email wajib diisi' })}
                      placeholder="nama@email.com"
                      className={`w-full px-4 py-3 border rounded-xl text-gray-800 focus:ring-2 focus:ring-teal-100 transition-all ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'}`}
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
                  </div>

                  {/* Phone - Now Required */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-gray-400">phone</span>
                      Nomor HP <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      {...register('phone_number', {
                        required: 'Nomor HP wajib diisi',
                        pattern: {
                          value: /^[0-9]{10,14}$/,
                          message: 'Format nomor HP tidak valid (10-14 digit)'
                        }
                      })}
                      placeholder="08123456789"
                      className={`w-full px-4 py-3 border rounded-xl text-gray-800 focus:ring-2 focus:ring-teal-100 transition-all ${errors.phone_number ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'}`}
                    />
                    {errors.phone_number && <p className="mt-1.5 text-xs text-red-500">{errors.phone_number.message}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-gray-400">lock</span>
                      Password <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      {...register('password', {
                        required: 'Password wajib diisi',
                        minLength: { value: 6, message: 'Password minimal 6 karakter' }
                      })}
                      placeholder="Minimal 6 karakter"
                      className={`w-full px-4 py-3 border rounded-xl text-gray-800 focus:ring-2 focus:ring-teal-100 transition-all ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'}`}
                    />
                    {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
                  </div>

                  <button
                    type="button"
                    onClick={goToStep2}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white rounded-xl transition-all hover:opacity-90"
                    style={{ backgroundColor: '#03BEB0' }}
                  >
                    <span>Lanjut ke Alamat</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </>
              )}

              {/* Step 2: Address Info */}
              {step === 2 && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Address Label */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-gray-400">label</span>
                      Label Alamat
                    </label>
                    <input
                      type="text"
                      {...register('address_label')}
                      placeholder="Contoh: Rumah, Kantor"
                      defaultValue="Rumah"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                    />
                  </div>

                  {/* Street */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-gray-400">signpost</span>
                      Alamat Lengkap <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('street', { required: 'Alamat wajib diisi' })}
                      placeholder="Jalan, No. Rumah, RT/RW, Kelurahan"
                      className={`w-full px-4 py-3 border rounded-xl text-gray-800 focus:ring-2 focus:ring-teal-100 transition-all ${errors.street ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'}`}
                    />
                    {errors.street && <p className="mt-1.5 text-xs text-red-500">{errors.street.message}</p>}
                  </div>

                  {/* City & Postal */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-gray-400">location_city</span>
                        Kota <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('city', { required: 'Kota wajib diisi' })}
                        placeholder="Nama Kota"
                        className={`w-full px-4 py-3 border rounded-xl text-gray-800 focus:ring-2 focus:ring-teal-100 transition-all ${errors.city ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-teal-500'}`}
                      />
                      {errors.city && <p className="mt-1.5 text-xs text-red-500">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-gray-400">markunread_mailbox</span>
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        {...register('postal_code')}
                        placeholder="12345"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 font-semibold border-2 border-gray-200 text-gray-600 rounded-xl transition-all hover:bg-gray-50"
                    >
                      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white rounded-xl transition-all disabled:opacity-50 hover:opacity-90"
                      style={{ backgroundColor: '#03BEB0' }}
                    >
                      {loading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                          Memproses...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">check</span>
                          Daftar
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Sudah punya akun?{' '}
                <Link to="/login" className="font-semibold transition-colors hover:opacity-80" style={{ color: '#03BEB0' }}>
                  Masuk
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;