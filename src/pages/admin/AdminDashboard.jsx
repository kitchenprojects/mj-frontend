import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { format } from 'date-fns';
import {
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiClock,
  FiTrendingUp,
  FiPackage,
  FiRefreshCw,
  FiArrowRight
} from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/orders/admin/dashboard-stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      setError('Gagal memuat statistik');
      // Fallback: load from orders directly
      try {
        const { data: orders } = await api.get('/orders');
        const revenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
        setStats({
          totals: { orders: orders.length, revenue, customers: 0, pendingOrders: 0 },
          today: { orders: 0, revenue: 0 },
          thisMonth: { orders: 0, revenue: 0 },
          statusBreakdown: {},
          recentOrders: orders.slice(0, 5),
          popularItems: []
        });
      } catch (e) {
        console.error('Fallback failed:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'out for delivery': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="text-center py-12 text-gray-500">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">Selamat datang di panel admin Dapur Nekti</p>
        </div>
        <button
          onClick={loadStats}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          <FiRefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
          {error} - Menampilkan data fallback
        </div>
      )}

      {/* Stats Cards Row 1 - Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <FiDollarSign size={24} />
            </div>
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">All Time</span>
          </div>
          <p className="text-emerald-100 text-sm mb-1">Total Revenue</p>
          <p className="text-2xl font-bold">Rp {stats?.totals?.revenue?.toLocaleString() || 0}</p>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <FiShoppingBag size={24} />
            </div>
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">All Time</span>
          </div>
          <p className="text-blue-100 text-sm mb-1">Total Orders</p>
          <p className="text-2xl font-bold">{stats?.totals?.orders || 0}</p>
        </div>

        {/* Total Customers */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <FiUsers size={24} />
            </div>
          </div>
          <p className="text-purple-100 text-sm mb-1">Total Customers</p>
          <p className="text-2xl font-bold">{stats?.totals?.customers || 0}</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <FiClock size={24} />
            </div>
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">Pending</span>
          </div>
          <p className="text-orange-100 text-sm mb-1">Perlu Diproses</p>
          <p className="text-2xl font-bold">{stats?.totals?.pendingOrders || 0}</p>
        </div>
      </div>

      {/* Stats Cards Row 2 - Period Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Today's Stats */}
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <FiTrendingUp size={20} />
            </div>
            <h3 className="font-semibold text-gray-800">Hari Ini</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Orders</p>
              <p className="text-xl font-bold text-gray-800">{stats?.today?.orders || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-xl font-bold text-emerald-600">Rp {stats?.today?.revenue?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        {/* This Month's Stats */}
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <FiTrendingUp size={20} />
            </div>
            <h3 className="font-semibold text-gray-800">Bulan Ini</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Orders</p>
              <p className="text-xl font-bold text-gray-800">{stats?.thisMonth?.orders || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-xl font-bold text-emerald-600">Rp {stats?.thisMonth?.revenue?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-800">Order Terbaru</h3>
            <Link
              to="/admin/orders"
              className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Lihat Semua <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y">
            {stats?.recentOrders?.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order.order_id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-sm text-gray-600">
                      #{order.order_id.substring(0, 8)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-800">{order.user_name || 'Customer'}</span>
                    <span className="text-sm font-medium text-emerald-600">
                      Rp {Number(order.total_amount).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(order.order_date), 'dd MMM yyyy HH:mm')}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FiPackage size={32} className="mx-auto mb-2 text-gray-400" />
                Belum ada order
              </div>
            )}
          </div>
        </div>

        {/* Popular Menu Items */}
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-800">Menu Terlaris</h3>
            <Link
              to="/admin/menu"
              className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Kelola Menu <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y">
            {stats?.popularItems?.length > 0 ? (
              stats.popularItems.map((item, idx) => (
                <div key={item.menu_id} className="p-4 hover:bg-gray-50 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.menu_name}</p>
                    <p className="text-xs text-gray-500">
                      Terjual: {Number(item.total_sold).toLocaleString()} •
                      Revenue: Rp {Number(item.total_revenue).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      Rp {Number(item.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FiShoppingBag size={32} className="mx-auto mb-2 text-gray-400" />
                Belum ada data penjualan
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      {stats?.statusBreakdown && Object.keys(stats.statusBreakdown).length > 0 && (
        <div className="mt-6 bg-white border rounded-xl p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Status Order</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.statusBreakdown).map(([status, count]) => (
              <div key={status} className={`px-4 py-2 rounded-lg ${getStatusColor(status)}`}>
                <span className="font-medium">{status}</span>
                <span className="ml-2 font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}