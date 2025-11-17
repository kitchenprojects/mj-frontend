// client/src/pages/OrderTrackingPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi'; // Minimalist icons for status
import { format } from 'date-fns'; // For date formatting

// Helper to get status color and icon
const getStatusVisuals = (status) => {
  const normalizedStatus = status ? status.toLowerCase() : 'pending';

  switch (normalizedStatus) {
    case 'pending':
    case 'confirmed':
      return { 
        icon: <FiPackage className="text-yellow-600" />, 
        color: 'text-yellow-700 bg-yellow-100',
        text: 'Confirmed'
      };
    case 'out for delivery':
      return { 
        icon: <FiTruck className="text-blue-600" />, 
        color: 'text-blue-700 bg-blue-100',
        text: 'Out for Delivery'
      };
    case 'delivered':
      return { 
        icon: <FiCheckCircle className="text-emerald-600" />, 
        color: 'text-emerald-700 bg-emerald-100',
        text: 'Delivered'
      };
    default:
      return { 
        icon: <FiPackage className="text-gray-600" />, 
        color: 'text-gray-700 bg-gray-100',
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
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
      
      {loading && (
        <div className="text-center text-gray-500">Loading orders...</div>
      )}

      {!loading && orders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <FiPackage size={50} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">No Orders Yet</h2>
          <p className="text-gray-500 mt-2">
            You haven't placed any orders. Your future orders will appear here.
          </p>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((o) => {
            const statusVisuals = getStatusVisuals(o.status);
            return (
              <div key={o.order_id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    {/* Order Info */}
                    <div className="mb-4 md:mb-0">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {/* Use a shorter, more readable part of the UUID */}
                        Order #{o.order_id.substring(0, 8)}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {/* Format the date for readability */}
                        Placed on {format(new Date(o.order_date), 'dd MMMM yyyy, p')}
                      </p>
                    </div>
                    
                    {/* Status and Total */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ${statusVisuals.color}`}>
                          {statusVisuals.icon}
                          {statusVisuals.text}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-bold text-emerald-600">
                          Rp {Number(o.total_amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* You could add an order details link/button here in the future */}
                {/* <div className="bg-gray-50 px-6 py-3 border-t">
                  <Link to={`/orders/${o.order_id}`} className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                    View Details
                  </Link>
                </div> */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}