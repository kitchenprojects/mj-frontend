import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [summary, setSummary] = useState({ orders: 0, revenue: 0 });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get('/orders');
        const revenue = data.reduce((sum, o) => sum + Number(o.total_amount), 0);
        setSummary({ orders: data.length, revenue });
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border rounded p-4">
          <div className="text-gray-500 text-sm">Total Orders</div>
          <div className="text-3xl font-bold">{summary.orders}</div>
        </div>
        <div className="bg-white border rounded p-4">
          <div className="text-gray-500 text-sm">Total Revenue</div>
          <div className="text-3xl font-bold">
            Rp {summary.revenue.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}