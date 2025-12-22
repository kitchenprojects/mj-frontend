import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function ReceiptPage() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${orderId}`);
                setOrder(data);
            } catch (err) {
                console.error('Failed to fetch order:', err);
                setError('Gagal memuat struk pembayaran');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const handlePrint = () => {
        window.print();
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-[48px] text-gray-300 animate-spin">progress_activity</span>
                <p className="text-gray-400 mt-4">Memuat struk...</p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-red-50">
                    <span className="material-symbols-outlined text-[40px] text-red-400">error</span>
                </div>
                <p className="text-red-500 font-semibold mb-4">{error}</p>
                <Link
                    to="/orders"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors hover:opacity-80"
                    style={{ color: '#03BEB0' }}
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Kembali ke Pesanan
                </Link>
            </div>
        );
    }

    // Not Found State
    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #E6F7F6 0%, #F0F7F7 100%)' }}>
                    <span className="material-symbols-outlined text-[40px]" style={{ color: '#03BEB0' }}>search_off</span>
                </div>
                <p className="text-gray-600 font-semibold mb-4">Order tidak ditemukan</p>
                <Link
                    to="/orders"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors hover:opacity-80"
                    style={{ color: '#03BEB0' }}
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Kembali ke Pesanan
                </Link>
            </div>
        );
    }

    const isPaid = order.payment_status === 'Paid';

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="w-full print:hidden">
                <div
                    className="relative flex h-[180px] md:h-[220px] w-full flex-col justify-center items-center overflow-hidden"
                    style={{
                        background: isPaid
                            ? `linear-gradient(135deg, rgba(3, 190, 176, 0.95) 0%, rgba(6, 93, 95, 0.98) 100%)`
                            : `linear-gradient(135deg, rgba(245, 158, 11, 0.95) 0%, rgba(180, 83, 9, 0.98) 100%)`,
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
                    <div className="flex flex-col gap-2 text-center px-4 max-w-3xl relative z-10">
                        <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-2xl">
                            <span className="material-symbols-outlined text-white text-3xl">
                                {isPaid ? 'check_circle' : 'schedule'}
                            </span>
                        </div>
                        <h1 className="text-white text-2xl md:text-4xl font-black leading-tight tracking-tight">
                            {isPaid ? 'Pembayaran Berhasil' : 'Menunggu Pembayaran'}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 print:py-0 print:max-w-none">
                {/* Action Buttons - hidden on print */}
                <div className="print:hidden flex justify-between items-center mb-6">
                    <Link
                        to="/orders"
                        className="flex items-center gap-2 text-gray-500 hover:text-teal-600 transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Kembali ke Pesanan
                    </Link>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl font-semibold transition-all hover:opacity-90"
                        style={{ backgroundColor: '#03BEB0' }}
                    >
                        <span className="material-symbols-outlined text-[18px]">print</span>
                        Cetak Struk
                    </button>
                </div>

                {/* Receipt Card */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden print:shadow-none print:border-0 print:rounded-none">
                    {/* Header */}
                    <div
                        className="text-white p-6 text-center print:bg-white print:text-black"
                        style={{ background: 'linear-gradient(135deg, #03BEB0 0%, #065D5F 100%)' }}
                    >
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-[28px] print:text-gray-800">restaurant</span>
                            <h1 className="text-2xl font-black tracking-tight">MJ Kitchen</h1>
                        </div>
                        <p className="text-white/80 text-sm print:text-gray-500">Jl. Contoh Alamat No. 123, Jakarta</p>
                        <p className="text-white/80 text-sm print:text-gray-500">Telp: (021) 1234-5678</p>
                    </div>

                    {/* Payment Status Badge */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-center">
                        {isPaid ? (
                            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-50 text-teal-700 rounded-xl font-semibold border border-teal-200">
                                <span className="material-symbols-outlined text-[18px]">verified</span>
                                Pembayaran Berhasil
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 text-amber-700 rounded-xl font-semibold border border-amber-200">
                                <span className="material-symbols-outlined text-[18px]">schedule</span>
                                Menunggu Pembayaran
                            </span>
                        )}
                    </div>

                    {/* Order Info */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-gray-400 text-xs mb-1">No. Order</p>
                                <p className="font-mono font-bold text-gray-800">#{order.order_id.substring(0, 8).toUpperCase()}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-right">
                                <p className="text-gray-400 text-xs mb-1">Tanggal</p>
                                <p className="font-semibold text-gray-800">
                                    {format(new Date(order.order_date), 'dd MMM yyyy, HH:mm', { locale: id })}
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-gray-400 text-xs mb-1">Pelanggan</p>
                                <p className="font-semibold text-gray-800">{order.user_name || 'Customer'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-right">
                                <p className="text-gray-400 text-xs mb-1">Status</p>
                                <p className="font-semibold text-gray-800">{order.status}</p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    {order.street && (
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-[20px]" style={{ color: '#03BEB0' }}>location_on</span>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Alamat Pengiriman</p>
                                    <p className="text-sm text-gray-800 font-medium">
                                        {order.street}{order.city ? `, ${order.city}` : ''}{order.postal_code ? ` ${order.postal_code}` : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Items List */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-[18px]" style={{ color: '#03BEB0' }}>receipt_long</span>
                            <h3 className="font-bold text-gray-800">Detail Pesanan</h3>
                        </div>
                        <div className="space-y-3">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{item.menu_name || 'Menu Item'}</p>
                                        <p className="text-sm text-gray-400">
                                            {item.quantity} × Rp {Number(item.price_each).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <p className="font-bold text-gray-800">
                                        Rp {Number(item.subtotal).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="px-6 py-5 border-t border-gray-100" style={{ background: 'linear-gradient(135deg, #E6F7F6 0%, #F0F7F7 100%)' }}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="text-gray-700 font-medium">Rp {Number(order.total_amount).toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-500">Ongkos Kirim</span>
                            <span className="font-semibold" style={{ color: '#03BEB0' }}>Gratis</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-teal-200">
                            <span className="text-lg font-bold" style={{ color: '#065D5F' }}>Total</span>
                            <span className="text-xl font-black" style={{ color: '#03BEB0' }}>
                                Rp {Number(order.total_amount).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 text-center border-t border-gray-100">
                        <div className="flex items-center justify-center gap-2 mb-2" style={{ color: '#03BEB0' }}>
                            <span className="material-symbols-outlined text-[20px]">favorite</span>
                            <p className="font-semibold">Terima kasih!</p>
                        </div>
                        <p className="text-gray-500 text-sm">Terima kasih telah berbelanja di MJ Kitchen</p>
                        <p className="text-gray-400 text-xs mt-1">Struk ini merupakan bukti pembayaran yang sah</p>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    #root, #root * {
                        visibility: visible;
                    }
                    #root {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
