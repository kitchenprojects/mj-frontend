import React from 'react';
import { useCartStore } from '../store/cartStore';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart } from 'react-icons/fi'; // Modern icons

export default function CartPage() {
  const { items, total, updateQty, removeItem, clear } = useCartStore();
  const profile = useAuthStore((s) => s.profile);
  const navigate = useNavigate();

  const placeOrder = async () => {
    if (!profile) return alert('Harap login');
    
    const addrs = await api.get('/users/me/addresses');
    const defaultAddress = addrs.data[0];
    
    if (!defaultAddress) {
      return alert('Tambahkan alamat (termasuk Kota) terlebih dahulu');
    }

    const payload = {
      user_id: profile.id,
      address_id: defaultAddress.address_id,
      items: items.map((i) => ({ menu_id: i.menu_id, quantity: i.quantity })),
    };

    try {
      await api.post('/orders', payload);
      clear();
      navigate('/orders');
    } catch (error) {
      console.error("Failed to place order:", error);
      alert('Gagal membuat pesanan. Silakan coba lagi.');
    }
  };

  // Handlers for quantity
  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      updateQty(item.menu_id, item.quantity - 1);
    }
  };
  
  const handleIncrement = (item) => {
    updateQty(item.menu_id, item.quantity + 1);
  };

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <FiShoppingCart size={60} className="text-gray-400 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/menu" 
          className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Cart with Items
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Item List (Left Column) */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.menu_id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              {/* Image */}
              <img 
                src={item.image_url || (item.images && item.images[0]?.image_url) || 'https://via.placeholder.com/100'} 
                alt={item.menu_name}
                className="w-20 h-20 rounded-md object-cover"
              />
              
              {/* Item Details */}
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-800">{item.menu_name}</h3>
                <p className="text-sm text-emerald-600 font-medium">Rp {Number(item.price).toLocaleString()}</p>
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center gap-2 border border-gray-300 rounded-md">
                <button 
                  onClick={() => handleDecrement(item)}
                  disabled={item.quantity <= 1}
                  className="px-2 py-1 text-gray-600 hover:text-emerald-600 disabled:opacity-50"
                >
                  <FiMinus size={16} />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button 
                  onClick={() => handleIncrement(item)}
                  className="px-2 py-1 text-gray-600 hover:text-emerald-600"
                >
                  <FiPlus size={16} />
                </button>
              </div>
              
              {/* Remove Button */}
              <button 
                onClick={() => removeItem(item.menu_id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label={`Remove ${item.menu_name}`}
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary (Right Column) */}
        <aside className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">Rp {total().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>Rp {total().toLocaleString()}</span>
                </div>
              </div>
            </div>
            <button 
              className="w-full mt-6 px-4 py-3 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors" 
              onClick={placeOrder}
            >
              Place Order
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}