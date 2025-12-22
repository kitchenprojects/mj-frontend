import React, { useState, useEffect } from 'react';
import { FiMapPin, FiTruck, FiX, FiCheck, FiLoader } from 'react-icons/fi';
import api from '../services/api';

/**
 * Distance-based shipping calculator component
 * Uses distancematrix.ai to calculate distance and Rp 3,000/km rate
 */
export default function ShippingCalculator({ onShippingCalculated, orderTotal = 0, defaultAddress = '' }) {
    const [address, setAddress] = useState(defaultAddress);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Update address when defaultAddress prop changes
    useEffect(() => {
        if (defaultAddress && !address) {
            setAddress(defaultAddress);
        }
    }, [defaultAddress]);

    const calculateShipping = async () => {
        if (!address.trim()) {
            setError('Masukkan alamat pengiriman');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data } = await api.get(`/shipping/calculate?destination=${encodeURIComponent(address)}`);

            if (data.success) {
                // Check if eligible for free shipping
                const isFreeShipping = orderTotal >= data.shipping.freeThreshold;
                const finalCost = isFreeShipping ? 0 : data.shipping.cost;

                const shippingResult = {
                    ...data,
                    finalCost,
                    isFreeShipping
                };

                setResult(shippingResult);
                onShippingCalculated?.(shippingResult);
            } else {
                setError(data.message || 'Gagal menghitung ongkir');
            }
        } catch (err) {
            console.error('Shipping calculation error:', err);
            setError(err.response?.data?.message || 'Alamat tidak ditemukan. Coba alamat yang lebih lengkap.');
        } finally {
            setLoading(false);
        }
    };

    const clearResult = () => {
        setResult(null);
        setAddress('');
        onShippingCalculated?.(null);
    };

    return (
        <div className="bg-white rounded-xl border p-4 space-y-4">
            <div className="flex items-center gap-2">
                <FiMapPin style={{ color: '#03BEB0' }} size={20} />
                <h3 className="font-semibold" style={{ color: '#065D5F' }}>Hitung Ongkir</h3>
            </div>

            {!result ? (
                <>
                    {/* Address Input */}
                    <div>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && calculateShipping()}
                            placeholder="Masukkan alamat lengkap tujuan..."
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Contoh: Jl. Sudirman No. 123, Jakarta Selatan
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Calculate Button */}
                    <button
                        onClick={calculateShipping}
                        disabled={loading || !address.trim()}
                        className="w-full flex items-center justify-center gap-2 py-3 text-white font-semibold rounded-lg disabled:opacity-50 transition-all"
                        style={{ backgroundColor: '#03BEB0' }}
                    >
                        {loading ? (
                            <>
                                <FiLoader className="animate-spin" size={18} />
                                Menghitung...
                            </>
                        ) : (
                            <>
                                <FiTruck size={18} />
                                Hitung Ongkir
                            </>
                        )}
                    </button>

                    {/* Info */}
                    <p className="text-xs text-gray-400 text-center">
                        Tarif: Rp 3.000/km • Gratis ongkir untuk pesanan di atas Rp 500.000
                    </p>
                </>
            ) : (
                /* Result Display */
                <div className="space-y-3">
                    {/* Destination */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Tujuan</p>
                        <p className="text-sm font-medium text-gray-800">{result.destination}</p>
                    </div>

                    {/* Distance & Duration */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">Jarak</p>
                            <p className="text-lg font-bold" style={{ color: '#065D5F' }}>
                                {result.distance.km} km
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">Estimasi</p>
                            <p className="text-lg font-bold" style={{ color: '#065D5F' }}>
                                {result.duration.text}
                            </p>
                        </div>
                    </div>

                    {/* Shipping Cost */}
                    <div
                        className="rounded-lg p-4 text-center"
                        style={{ backgroundColor: result.isFreeShipping ? '#ECFDF5' : '#E6F7F6' }}
                    >
                        {result.isFreeShipping ? (
                            <>
                                <p className="text-green-600 font-bold text-xl flex items-center justify-center gap-2">
                                    <FiCheck size={20} />
                                    GRATIS ONGKIR!
                                </p>
                                <p className="text-green-600 text-sm mt-1">
                                    Pesanan di atas Rp 500.000
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-xs text-gray-500 mb-1">Ongkos Kirim</p>
                                <p className="text-2xl font-bold" style={{ color: '#03BEB0' }}>
                                    Rp {result.finalCost.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {result.distance.km} km × Rp 3.000
                                </p>
                            </>
                        )}
                    </div>

                    {/* Change Address Button */}
                    <button
                        onClick={clearResult}
                        className="w-full flex items-center justify-center gap-2 py-2 text-gray-600 hover:text-gray-800 text-sm transition-colors"
                    >
                        <FiX size={16} />
                        Ubah Alamat
                    </button>
                </div>
            )}
        </div>
    );
}
