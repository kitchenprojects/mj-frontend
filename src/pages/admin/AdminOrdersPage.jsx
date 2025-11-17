import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const { data } = await api.get('/orders');
    setOrders(data);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (order_id, status) => {
    await api.put(`/orders/${order_id}/status`, { status });
    load();
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold mb-4">Order Masuk</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.order_id} className="bg-white border rounded p-3">
            <div className="flex items-center justify-between">
              <div>#{o.order_id} - {o.user_name}</div>
              <div className="text-sm px-2 py-1 rounded bg-gray-100">{o.status}</div>
            </div>
            <div className="text-sm text-gray-500">Total: Rp {Number(o.total_amount).toLocaleString()}</div>
            <div className="mt-2 space-x-2">
              {['Pending','Confirmed','Out for Delivery','Delivered'].map(s => (
                <button key={s} className="text-xs px-2 py-1 border rounded" onClick={() => updateStatus(o.order_id, s)}>{s}</button>
              ))}
            </div>
          </div>
        ))}
        {orders.length === 0 && <div>Tidak ada order.</div>}
      </div>
    </div>
  );
}

