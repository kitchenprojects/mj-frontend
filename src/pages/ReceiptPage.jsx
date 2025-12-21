import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import { FiPrinter, FiArrowLeft, FiCheckCircle, FiClock } from 'react-icons/fi';

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

    if (loading) {
        return (
            <div className="py-20 text-center text-gray-500">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading receipt...
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-20 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Link to="/orders" className="text-emerald-600 hover:underline">
                    ← Kembali ke My Orders
                </Link>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="py-20 text-center">
                <p className="text-gray-500 mb-4">Order tidak ditemukan</p>
                <Link to="/orders" className="text-emerald-600 hover:underline">
                    ← Kembali ke My Orders
                </Link>
            </div>
        );
    }

    const isPaid = order.payment_status === 'Paid';

    return (
        <div className="py-8 max-w-2xl mx-auto">
            {/* Print button - hidden on print */}
            <div className="print:hidden flex justify-between items-center mb-6">
                <Link to="/orders" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600">
                    <FiArrowLeft /> Kembali ke My Orders
                </Link>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                >
                    <FiPrinter /> Print Struk
                </button>
            </div>

            {/* Receipt Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden print:shadow-none print:border-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 text-center print:bg-white print:text-black">
                    <h1 className="text-2xl font-bold">MJ Kitchen</h1>
                    <p className="text-emerald-100 text-sm mt-1 print:text-gray-500">Jl. Contoh Alamat No. 123, Jakarta</p>
                    <p className="text-emerald-100 text-sm print:text-gray-500">Telp: (021) 1234-5678</p>
                </div>

                {/* Payment Status Badge */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-center">
                    {isPaid ? (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">
                            <FiCheckCircle /> Pembayaran Berhasil
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                            <FiClock /> Menunggu Pembayaran
                        </span>
                    )}
                </div>

                {/* Order Info */}
                <div className="p-6 border-b border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">No. Order</p>
                            <p className="font-mono font-medium text-gray-800">#{order.order_id.substring(0, 8).toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500">Tanggal</p>
                            <p className="font-medium text-gray-800">
                                {format(new Date(order.order_date), 'dd MMM yyyy, HH:mm')}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Pelanggan</p>
                            <p className="font-medium text-gray-800">{order.user_name || 'Customer'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500">Status</p>
                            <p className="font-medium text-gray-800">{order.status}</p>
                        </div>
                    </div>
                </div>

                {/* Delivery Address */}
                {order.street && (
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <p className="text-sm text-gray-500 mb-1">Alamat Pengiriman</p>
                        <p className="text-sm text-gray-800">
                            {order.street}{order.city ? `, ${order.city}` : ''}{order.postal_code ? ` ${order.postal_code}` : ''}
                        </p>
                    </div>
                )}

                {/* Items List */}
                <div className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Detail Pesanan</h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500 border-b">
                                <th className="pb-2">Item</th>
                                <th className="pb-2 text-center">Qty</th>
                                <th className="pb-2 text-right">Harga</th>
                                <th className="pb-2 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-100">
                                    <td className="py-3 text-gray-800">{item.menu_name || 'Menu Item'}</td>
                                    <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                                    <td className="py-3 text-right text-gray-600">
                                        Rp {Number(item.price_each).toLocaleString()}
                                    </td>
                                    <td className="py-3 text-right text-gray-800 font-medium">
                                        Rp {Number(item.subtotal).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Total */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-800">Rp {Number(order.total_amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600">Ongkos Kirim</span>
                        <span className="text-gray-800">Gratis</span>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300">
                        <span className="text-lg font-bold text-gray-800">Total</span>
                        <span className="text-lg font-bold text-emerald-600">
                            Rp {Number(order.total_amount).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 text-center text-gray-500 text-sm border-t border-gray-200">
                    <p className="mb-2">Terima kasih telah berbelanja di MJ Kitchen!</p>
                    <p className="text-xs">Struk ini merupakan bukti pembayaran yang sah.</p>
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
