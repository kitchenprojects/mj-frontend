import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';
import { FiX, FiPackage, FiUser, FiMapPin, FiCreditCard, FiClock, FiCheck, FiTruck, FiEye } from 'react-icons/fi';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const loadOrderDetail = async (orderId) => {
    setDetailLoading(true);
    setSelectedOrder(orderId);
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setOrderDetail(data);
    } catch (error) {
      console.error('Failed to load order detail:', error);
      setOrderDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedOrder(null);
    setOrderDetail(null);
  };

  const updateStatus = async (order_id, status) => {
    try {
      await api.put(`/orders/${order_id}/status`, { status });
      load();
      if (orderDetail && orderDetail.order_id === order_id) {
        setOrderDetail({ ...orderDetail, status });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'out for delivery': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Masuk</h1>
        <button
          onClick={load}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-500">Loading orders...</div>
      )}

      {!loading && orders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <FiPackage size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Tidak ada order masuk.</p>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Order ID</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Pelanggan</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Total</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Pembayaran</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Tanggal</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o.order_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">
                    #{o.order_id.substring(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {o.user_name || 'Customer'}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-emerald-600">
                    Rp {Number(o.total_amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPaymentColor(o.payment_status)}`}>
                      {o.payment_status || 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {format(new Date(o.order_date), 'dd MMM yyyy HH:mm')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => loadOrderDetail(o.order_id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      <FiEye size={14} /> Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">
                Detail Order #{selectedOrder.substring(0, 8)}
              </h2>
              <button onClick={closeDetail} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {detailLoading && (
                <div className="text-center py-8 text-gray-500">Loading detail...</div>
              )}

              {!detailLoading && orderDetail && (
                <div className="space-y-6">
                  {/* Customer & Status Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <FiUser size={16} /> <span className="text-sm font-medium">Pelanggan</span>
                      </div>
                      <p className="font-medium text-gray-800">{orderDetail.user_name || 'Customer'}</p>
                      {orderDetail.user_phone && (
                        <p className="text-sm text-gray-500">{orderDetail.user_phone}</p>
                      )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <FiClock size={16} /> <span className="text-sm font-medium">Waktu Order</span>
                      </div>
                      <p className="font-medium text-gray-800">
                        {format(new Date(orderDetail.order_date), 'dd MMMM yyyy')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(orderDetail.order_date), 'HH:mm')} WIB
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  {orderDetail.street && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <FiMapPin size={16} /> <span className="text-sm font-medium">Alamat Pengiriman</span>
                      </div>
                      <p className="text-gray-800">
                        {orderDetail.street}
                        {orderDetail.city && `, ${orderDetail.city}`}
                        {orderDetail.postal_code && ` ${orderDetail.postal_code}`}
                      </p>
                    </div>
                  )}

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FiPackage size={16} /> Detail Pesanan
                    </h3>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-gray-100">
                            <th className="text-left px-4 py-2 font-medium text-gray-600">Item</th>
                            <th className="text-center px-4 py-2 font-medium text-gray-600">Qty</th>
                            <th className="text-right px-4 py-2 font-medium text-gray-600">Harga</th>
                            <th className="text-right px-4 py-2 font-medium text-gray-600">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderDetail.items?.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-100">
                              <td className="px-4 py-2 text-gray-800">{item.menu_name || 'Menu Item'}</td>
                              <td className="px-4 py-2 text-center text-gray-600">{item.quantity}</td>
                              <td className="px-4 py-2 text-right text-gray-600">
                                Rp {Number(item.price_each).toLocaleString()}
                              </td>
                              <td className="px-4 py-2 text-right font-medium text-gray-800">
                                Rp {Number(item.subtotal).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-100">
                            <td colSpan="3" className="px-4 py-3 text-right font-semibold text-gray-800">
                              Total
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-emerald-600">
                              Rp {Number(orderDetail.total_amount).toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <FiCreditCard size={16} /> <span className="text-sm font-medium">Status Pembayaran</span>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getPaymentColor(orderDetail.payment_status)}`}>
                      {orderDetail.payment_status || 'Unpaid'}
                    </span>
                    {orderDetail.payment_date && (
                      <p className="text-sm text-gray-500 mt-1">
                        Dibayar: {format(new Date(orderDetail.payment_date), 'dd MMM yyyy HH:mm')}
                      </p>
                    )}
                  </div>

                  {/* Order Status & Actions */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Update Status Order</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-500">Status saat ini:</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(orderDetail.status)}`}>
                        {orderDetail.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Pending', 'Confirmed', 'Out for Delivery', 'Delivered'].map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(orderDetail.order_id, s)}
                          disabled={orderDetail.status === s}
                          className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm transition-colors ${orderDetail.status === s
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          {s === 'Pending' && <FiClock size={14} />}
                          {s === 'Confirmed' && <FiCheck size={14} />}
                          {s === 'Out for Delivery' && <FiTruck size={14} />}
                          {s === 'Delivered' && <FiPackage size={14} />}
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!detailLoading && !orderDetail && (
                <div className="text-center py-8 text-red-500">
                  Gagal memuat detail order.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-4 bg-gray-50">
              <button
                onClick={closeDetail}
                className="w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
