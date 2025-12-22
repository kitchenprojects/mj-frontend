import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { generateWhatsAppOrderMessage } from '../components/WhatsAppButton';
import ShippingCalculator from '../components/ShippingCalculator';

export default function CartPage() {
  const { items, total, updateQty, removeItem, clear } = useCartStore();
  const profile = useAuthStore((s) => s.profile);
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [snapToken, setSnapToken] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [distanceShipping, setDistanceShipping] = useState(null);
  const [userDefaultAddress, setUserDefaultAddress] = useState('');

  // Fetch user's default address on mount
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      if (!profile) return;
      try {
        const { data } = await api.get('/users/me/addresses');
        const defaultAddr = data.find(addr => addr.is_default) || data[0];
        if (defaultAddr) {
          // Combine street and city for full address
          const fullAddress = [defaultAddr.street, defaultAddr.city].filter(Boolean).join(', ');
          setUserDefaultAddress(fullAddress);
        }
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      }
    };
    fetchDefaultAddress();
  }, [profile]);

  const placeOrder = async () => {
    if (!profile) return alert('Harap login terlebih dahulu');

    setLoading(true);
    try {
      // Get user's address
      const addrs = await api.get('/users/me/addresses');
      const defaultAddress = addrs.data[0];

      if (!defaultAddress) {
        alert('Tambahkan alamat (termasuk Kota) terlebih dahulu');
        setLoading(false);
        return;
      }

      // Prepare items with menu_name for Midtrans
      const itemsWithName = items.map(i => ({
        menu_id: i.menu_id,
        quantity: i.quantity,
        menu_name: i.menu_name,
        price: i.price
      }));

      const payload = {
        user_id: profile.id,
        address_id: defaultAddress.address_id,
        items: itemsWithName,
      };

      // Create order and get snap token
      const { data } = await api.post('/orders', payload);

      setOrderId(data.order_id);
      setSnapToken(data.snap_token);
      setShowPayment(true);

    } catch (error) {
      console.error("Failed to place order:", error);
      alert('Gagal membuat pesanan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize Snap when token is available
  useEffect(() => {
    if (snapToken && showPayment && window.snap) {
      window.snap.embed(snapToken, {
        embedId: 'snap-container',
        onSuccess: function (result) {
          console.log('Payment success:', result);
          const currentOrderId = result.order_id;
          clear();
          setShowPayment(false);
          navigate(`/orders/${currentOrderId}/receipt`);
        },
        onPending: function (result) {
          console.log('Payment pending:', result);
          alert('Menunggu pembayaran...');
        },
        onError: function (result) {
          console.log('Payment error:', result);
          alert('Pembayaran gagal. Silakan coba lagi.');
        },
        onClose: function () {
          console.log('Payment popup closed');
          setShowPayment(false);
        }
      });
    }
  }, [snapToken, showPayment]);

  // Handlers for quantity
  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      updateQty(item.itemKey || item.menu_id, item.quantity - 1);
    }
  };

  const handleIncrement = (item) => {
    updateQty(item.itemKey || item.menu_id, item.quantity + 1);
  };

  // Payment Modal
  if (showPayment) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-4 border-b bg-white flex-shrink-0">
            <h2 className="text-xl font-semibold">Complete Payment</h2>
            <button
              onClick={() => setShowPayment(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Snap Embed Container - sized for Midtrans widget */}
          <div
            id="snap-container"
            className="flex-1 overflow-y-auto"
            style={{ minHeight: '480px' }}
          ></div>
        </div>
      </div>
    );
  }

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
            <div key={item.itemKey || item.menu_id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                {/* Image */}
                <img
                  src={item.image_url || (item.images && item.images[0]?.image_url) || 'https://via.placeholder.com/100'}
                  alt={item.menu_name}
                  className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                />

                {/* Item Details */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-gray-800">{item.menu_name}</h3>
                  <p className="text-sm text-emerald-600 font-medium">
                    Rp {Number(item.price).toLocaleString()}
                    {item.addonsTotal > 0 && (
                      <span className="text-gray-500"> + Rp {item.addonsTotal.toLocaleString()}</span>
                    )}
                  </p>

                  {/* Add-ons */}
                  {item.addons?.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs text-gray-500">Tambahan: </span>
                      <span className="text-xs text-gray-700">
                        {item.addons.map(a => a.menu_name).join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Notes */}
                  {item.notes && (
                    <div className="mt-1 text-xs text-gray-500 italic">
                      📝 "{item.notes}"
                    </div>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 border border-gray-300 rounded-md flex-shrink-0">
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
                  onClick={() => removeItem(item.itemKey || item.menu_id)}
                  className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  aria-label={`Remove ${item.menu_name}`}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary (Right Column) */}
        <aside className="md:col-span-1 space-y-4">
          {/* Shipping Calculator */}
          <ShippingCalculator
            onShippingCalculated={setDistanceShipping}
            orderTotal={total()}
            defaultAddress={userDefaultAddress}
          />

          {/* Order Total */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-xl font-semibold border-b pb-4 mb-4" style={{ color: '#065D5F' }}>
              Ringkasan Pesanan
            </h2>

            {(() => {
              const subtotal = total();
              const shippingCost = distanceShipping?.finalCost ?? 0;
              const grandTotal = subtotal + shippingCost;
              const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

              return (
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalQty} item)</span>
                    <span className="font-medium">Rp {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ongkir</span>
                    {distanceShipping ? (
                      <span
                        className="font-medium"
                        style={{ color: distanceShipping.isFreeShipping ? '#10B981' : '#03BEB0' }}
                      >
                        {distanceShipping.isFreeShipping ? 'GRATIS' : `Rp ${shippingCost.toLocaleString()}`}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">Hitung alamat dulu</span>
                    )}
                  </div>
                  {distanceShipping && !distanceShipping.isFreeShipping && (
                    <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      📍 {distanceShipping.distance.km} km × Rp 3.000/km
                    </p>
                  )}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold" style={{ color: '#065D5F' }}>
                      <span>Total</span>
                      <span>Rp {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
            <button
              className="w-full mt-6 px-4 py-3 bg-emerald-600 text-white font-semibold rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={placeOrder}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="text-gray-400 text-sm">atau</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* WhatsApp Order Button */}
            <a
              href={`https://wa.me/6288970788847?text=${encodeURIComponent(generateWhatsAppOrderMessage(items, total()))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
            >
              <FaWhatsapp size={20} />
              Order via WhatsApp
            </a>
            <p className="text-xs text-gray-500 text-center mt-2">
              Pesan langsung ke admin untuk custom order atau tanya ketersediaan
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}