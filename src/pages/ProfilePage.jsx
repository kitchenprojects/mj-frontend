import React from 'react';
import ProfileDetails from '../components/ProfileDetails';
import AddressManager from '../components/AddressManager';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="w-full">
        <div
          className="relative flex h-[280px] md:h-[360px] w-full flex-col justify-center items-center bg-cover bg-center bg-no-repeat overflow-hidden"
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
            <div className="absolute top-1/2 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-1/4 right-20 w-32 h-32 bg-teal-300/10 rounded-full blur-2xl"></div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 text-center px-4 max-w-3xl relative z-10">
            <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-2xl">
              <span className="material-symbols-outlined text-white text-5xl md:text-6xl">
                account_circle
              </span>
            </div>
            <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
              Profil Saya
            </h1>
            <p className="text-white/80 text-base md:text-xl font-medium leading-relaxed max-w-xl mx-auto">
              Kelola informasi akun dan alamat pengiriman Anda dengan mudah
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            to="/"
            className="text-gray-500 hover:text-teal-600 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            Beranda
          </Link>
          <span className="material-symbols-outlined text-[16px] text-gray-400">chevron_right</span>
          <span className="text-teal-600 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">person</span>
            Profil
          </span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Profile Details */}
          <div className="w-full lg:w-1/3 flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
              <ProfileDetails />

              {/* Quick Links Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #E6F7F6 0%, #F0F7F7 100%)' }}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]" style={{ color: '#03BEB0' }}>widgets</span>
                    <h3 className="font-semibold text-gray-800">Akses Cepat</h3>
                  </div>
                </div>
                <div className="p-3">
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-teal-50 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-teal-500 transition-colors">receipt_long</span>
                    <span className="text-gray-700 group-hover:text-teal-600 font-medium transition-colors">Riwayat Pesanan</span>
                    <span className="material-symbols-outlined text-gray-300 group-hover:text-teal-400 ml-auto text-[18px]">chevron_right</span>
                  </Link>
                  <Link
                    to="/menu"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-teal-50 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-teal-500 transition-colors">restaurant_menu</span>
                    <span className="text-gray-700 group-hover:text-teal-600 font-medium transition-colors">Pesan Menu</span>
                    <span className="material-symbols-outlined text-gray-300 group-hover:text-teal-400 ml-auto text-[18px]">chevron_right</span>
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-teal-50 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-teal-500 transition-colors">shopping_cart</span>
                    <span className="text-gray-700 group-hover:text-teal-600 font-medium transition-colors">Keranjang</span>
                    <span className="material-symbols-outlined text-gray-300 group-hover:text-teal-400 ml-auto text-[18px]">chevron_right</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Address Manager */}
          <div className="w-full lg:w-2/3">
            <AddressManager />
          </div>
        </div>
      </div>
    </div>
  );
}