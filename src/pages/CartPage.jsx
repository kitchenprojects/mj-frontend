import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
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
      const addrs = await api.get('/users/me/addresses');
      const defaultAddress = addrs.data[0];

      if (!defaultAddress) {
        alert('Tambahkan alamat (termasuk Kota) terlebih dahulu');
        setLoading(false);
        return;
      }

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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <div
            className="flex justify-between items-center p-5 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #03BEB0 0%, #065D5F 100%)' }}
          >
            <h2 className="text-xl font-bold text-white">Selesaikan Pembayaran</h2>
            <button
              onClick={() => setShowPayment(false)}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-white text-[20px]">close</span>
            </button>
          </div>

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
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="w-full">
          <div
            className="relative flex h-[200px] md:h-[260px] w-full flex-col justify-center items-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(3, 190, 176, 0.95) 0%, rgba(6, 93, 95, 0.98) 100%)`,
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            </div>
            <div className="flex flex-col gap-3 text-center px-4 max-w-3xl relative z-10">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-2xl">
                <span className="material-symbols-outlined text-white text-4xl">shopping_cart</span>
              </div>
              <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight">
                Keranjang
              </h1>
            </div>
          </div>
        </div>

        {/* Empty State Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #E6F7F6 0%, #F0F7F7 100%)' }}>
            <span className="material-symbols-outlined text-[48px]" style={{ color: '#03BEB0' }}>remove_shopping_cart</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-500 mb-6 max-w-sm">Anda belum menambahkan item ke keranjang. Yuk mulai pilih menu favorit!</p>
          <Link
            to="/menu"
            className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all hover:opacity-90 shadow-lg"
            style={{ backgroundColor: '#03BEB0' }}
          >
            <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
            Lihat Menu
          </Link>
        </div>
      </div>
    );
  }

  // Cart with Items
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="w-full">
        <div
          className="relative flex h-[200px] md:h-[260px] w-full flex-col justify-center items-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, rgba(3, 190, 176, 0.95) 0%, rgba(6, 93, 95, 0.98) 100%)`,
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          </div>
          <div className="flex flex-col gap-3 text-center px-4 max-w-3xl relative z-10">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-2xl">
              <span className="material-symbols-outlined text-white text-4xl">shopping_cart</span>
            </div>
            <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Keranjang
            </h1>
            <p className="text-white/80 text-sm md:text-lg font-medium">
              {totalQty} item siap untuk dipesan
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-gray-500 hover:text-teal-600 transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">home</span>
            Beranda
          </Link>
          <span className="material-symbols-outlined text-[16px] text-gray-400">chevron_right</span>
          <span className="text-teal-600 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
            Keranjang
          </span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Item List (Left Column) */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.itemKey || item.menu_id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={item.image_url || (item.images && item.images[0]?.image_url) || 'https://via.placeholder.com/100'}
                      alt={item.menu_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg">{item.menu_name}</h3>
                    <p className="text-base font-semibold mt-1" style={{ color: '#03BEB0' }}>
                      Rp {Number(item.price).toLocaleString('id-ID')}
                      {item.addonsTotal > 0 && (
                        <span className="text-gray-400 font-normal"> + Rp {item.addonsTotal.toLocaleString('id-ID')}</span>
                      )}
                    </p>

                    {/* Add-ons */}
                    {item.addons?.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-gray-400">add_circle</span>
                        <span className="text-xs text-gray-500">
                          {item.addons.map(a => a.menu_name).join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-gray-400">edit_note</span>
                        <span className="text-xs text-gray-500 italic">"{item.notes}"</span>
                      </div>
                    )}
                  </div>

                  {/* Right Section: Qty & Remove */}
                  <div className="flex flex-col items-end gap-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => handleDecrement(item)}
                        disabled={item.quantity <= 1}
                        className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-teal-50 hover:text-teal-600 disabled:opacity-40 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrement(item)}
                        className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.itemKey || item.menu_id)}
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary (Right Column) */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Shipping Calculator */}
            <ShippingCalculator
              onShippingCalculated={setDistanceShipping}
              orderTotal={total()}
              defaultAddress={userDefaultAddress}
            />

            {/* Order Total */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-[20px]" style={{ color: '#03BEB0' }}>receipt_long</span>
                <h2 className="text-lg font-bold text-gray-800">Ringkasan Pesanan</h2>
              </div>

              {(() => {
                const subtotal = total();
                const shippingCost = distanceShipping?.finalCost ?? 0;
                const grandTotal = subtotal + shippingCost;

                return (
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({totalQty} item)</span>
                      <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Ongkir</span>
                      {distanceShipping ? (
                        <span
                          className="font-semibold"
                          style={{ color: distanceShipping.isFreeShipping ? '#10B981' : '#03BEB0' }}
                        >
                          {distanceShipping.isFreeShipping ? 'GRATIS' : `Rp ${shippingCost.toLocaleString('id-ID')}`}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Hitung alamat dulu</span>
                      )}
                    </div>
                    {distanceShipping && !distanceShipping.isFreeShipping && (
                      <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {distanceShipping.distance.km} km × Rp 3.000/km
                      </p>
                    )}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between text-lg font-bold" style={{ color: '#065D5F' }}>
                        <span>Total</span>
                        <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <button
                className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 px-4 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{ backgroundColor: '#03BEB0' }}
                onClick={placeOrder}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    Memproses...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    Lanjut ke Pembayaran
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="text-gray-400 text-sm">atau</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* WhatsApp Order Button */}
              <a
                href={`https://wa.me/6288970788847?text=${encodeURIComponent(generateWhatsAppOrderMessage(items, total()))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Order via WhatsApp
              </a>
              <p className="text-xs text-gray-500 text-center mt-2">
                Untuk custom order atau tanya ketersediaan
              </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}