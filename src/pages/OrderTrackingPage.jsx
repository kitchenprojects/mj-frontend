// client/src/pages/OrderTrackingPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Helper to get status color and icon
const getStatusVisuals = (status) => {
  const normalizedStatus = status ? status.toLowerCase() : 'pending';

  switch (normalizedStatus) {
    case 'pending':
      return {
        icon: 'schedule',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        text: 'Menunggu'
      };
    case 'confirmed':
      return {
        icon: 'task_alt',
        color: 'text-blue-700 bg-blue-50 border-blue-200',
        text: 'Dikonfirmasi'
      };
    case 'processing':
      return {
        icon: 'skillet',
        color: 'text-orange-700 bg-orange-50 border-orange-200',
        text: 'Diproses'
      };
    case 'out for delivery':
      return {
        icon: 'local_shipping',
        color: 'text-purple-700 bg-purple-50 border-purple-200',
        text: 'Dalam Pengiriman'
      };
    case 'delivered':
      return {
        icon: 'check_circle',
        color: 'text-teal-700 bg-teal-50 border-teal-200',
        text: 'Selesai'
      };
    case 'cancelled':
      return {
        icon: 'cancel',
        color: 'text-red-700 bg-red-50 border-red-200',
        text: 'Dibatalkan'
      };
    default:
      return {
        icon: 'inventory_2',
        color: 'text-gray-700 bg-gray-50 border-gray-200',
        text: status
      };
  }
};

export default function OrderTrackingPage() {
  const profile = useAuthStore((s) => s.profile);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      setLoading(true);
      api.get(`/orders/mine/${profile.id}`)
        .then((r) => setOrders(r.data))
        .catch(err => console.error("Failed to fetch orders:", err))
        .finally(() => setLoading(false));
    }
  }, [profile]);

  return (
    <div className="min-h-screen -mx-4 md:-mx-6 lg:-mx-8 -my-8">
      {/* Hero Section */}
      <div className="w-full">
        <div
          className="relative flex h-[280px] md:h-[360px] w-full flex-col justify-center items-center overflow-hidden"
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
                receipt_long
              </span>
            </div>
            <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
              Pesanan Saya
            </h1>
            <p className="text-white/80 text-base md:text-xl font-medium leading-relaxed max-w-xl mx-auto">
              Lacak status pesanan dan lihat riwayat transaksi Anda
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
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            Pesanan
          </span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-10">
        {/* Stats Summary */}
        {!loading && orders.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E6F7F6' }}>
                  <span className="material-symbols-outlined text-[20px]" style={{ color: '#03BEB0' }}>shopping_bag</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                  <p className="text-xs text-gray-500">Total Pesanan</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-50">
                  <span className="material-symbols-outlined text-[20px] text-amber-600">schedule</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status?.toLowerCase())).length}
                  </p>
                  <p className="text-xs text-gray-500">Dalam Proses</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-50">
                  <span className="material-symbols-outlined text-[20px] text-purple-600">local_shipping</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {orders.filter(o => o.status?.toLowerCase() === 'out for delivery').length}
                  </p>
                  <p className="text-xs text-gray-500">Dikirim</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-teal-50">
                  <span className="material-symbols-outlined text-[20px] text-teal-600">check_circle</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {orders.filter(o => o.status?.toLowerCase() === 'delivered').length}
                  </p>
                  <p className="text-xs text-gray-500">Selesai</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="material-symbols-outlined text-[48px] text-gray-300 animate-spin">progress_activity</span>
            <p className="text-gray-400 mt-4">Memuat pesanan...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ background: 'linear-gradient(135deg, #E6F7F6 0%, #F0F7F7 100%)' }}
            >
              <span className="material-symbols-outlined text-[48px]" style={{ color: '#03BEB0' }}>shopping_bag</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Pesanan</h2>
            <p className="text-gray-500 max-w-sm mb-6">
              Anda belum membuat pesanan. Yuk mulai pesan menu favorit Anda!
            </p>
            <Link
              to="/menu"
              className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: '#03BEB0' }}
            >
              <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
              Lihat Menu
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((o) => {
              const statusVisuals = getStatusVisuals(o.status);
              return (
                <div
                  key={o.order_id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-teal-200 transition-all overflow-hidden group"
                >
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #E6F7F6 0%, #F0F7F7 100%)' }}
                        >
                          <span className="material-symbols-outlined text-[24px]" style={{ color: '#03BEB0' }}>receipt</span>
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-800">
                            Order #{o.order_id.substring(0, 8).toUpperCase()}
                          </h2>
                          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                            {format(new Date(o.order_date), 'dd MMMM yyyy, HH:mm', { locale: id })}
                          </p>
                        </div>
                      </div>

                      {/* Status and Total */}
                      <div className="flex items-center gap-6 md:gap-8">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Status</p>
                          <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg border ${statusVisuals.color}`}>
                            <span className="material-symbols-outlined text-[16px]">{statusVisuals.icon}</span>
                            {statusVisuals.text}
                          </span>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-400 mb-1">Total</p>
                          <p className="text-xl font-bold" style={{ color: '#03BEB0' }}>
                            Rp {Number(o.total_amount).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Link */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span className="truncate max-w-[200px] md:max-w-none">
                        {o.delivery_address || 'Alamat tidak tersedia'}
                      </span>
                    </div>
                    <Link
                      to={`/orders/${o.order_id}/receipt`}
                      className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
                      style={{ color: '#03BEB0' }}
                    >
                      Lihat Detail
                      <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}