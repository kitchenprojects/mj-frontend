import React, { useState, useEffect } from 'react';
import { FiMapPin, FiTruck, FiX, FiCheck, FiLoader, FiPlus, FiChevronDown } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { showSuccess, showError } from '../utils/swal';

// Mini Address Modal for adding new address in cart
const AddAddressModal = ({ onClose, onSave }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            label: '',
            street: '',
            city: '',
            postal_code: '',
            is_default: false,
        },
    });

    const onSubmit = (data) => {
        onSave(data);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Modal Header */}
                <div
                    className="relative p-5 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #03BEB0 0%, #065D5F 100%)' }}
                >
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M20 20c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z'/%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>
                    <div className="relative flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-[22px]">
                                    add_location_alt
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white">
                                Tambah Alamat Baru
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                        >
                            <span className="material-symbols-outlined text-white text-[20px]">close</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-6 space-y-4">
                        {/* Label */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-gray-400">label</span>
                                Label Alamat
                            </label>
                            <input
                                type="text"
                                {...register('label', { required: 'Label wajib diisi' })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                                placeholder="Contoh: Rumah, Kantor, dll"
                            />
                            {errors.label && <p className="mt-1 text-xs text-red-500">{errors.label.message}</p>}
                        </div>

                        {/* Street */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-gray-400">signpost</span>
                                Alamat Lengkap
                            </label>
                            <input
                                type="text"
                                {...register('street', { required: 'Alamat wajib diisi' })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                                placeholder="Jalan, No. Rumah, RT/RW, Kelurahan"
                            />
                            {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street.message}</p>}
                        </div>

                        {/* City & Postal Code */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">location_city</span>
                                    Kota
                                </label>
                                <input
                                    type="text"
                                    {...register('city', { required: 'Kota wajib diisi' })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                                    placeholder="Nama Kota"
                                />
                                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">markunread_mailbox</span>
                                    Kode Pos
                                </label>
                                <input
                                    type="text"
                                    {...register('postal_code')}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                                    placeholder="12345"
                                />
                            </div>
                        </div>

                        {/* Default Checkbox */}
                        <div className="pt-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    {...register('is_default')}
                                    className="w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500 transition-colors"
                                />
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-teal-500 transition-colors">home</span>
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Jadikan alamat utama</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Modal Actions */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-4 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90"
                            style={{ backgroundColor: '#03BEB0' }}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                    Simpan Alamat
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/**
 * Distance-based shipping calculator component with address dropdown
 * Uses distancematrix.ai to calculate distance and Rp 3,000/km rate
 */
export default function ShippingCalculator({ onShippingCalculated, orderTotal = 0 }) {
    const profile = useAuthStore((s) => s.profile);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [loading, setLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Load user addresses
    const loadAddresses = async () => {
        if (!profile) {
            setAddressLoading(false);
            return;
        }
        try {
            setAddressLoading(true);
            const { data } = await api.get('/users/me/addresses');
            setAddresses(data);

            // Auto-select default address
            const defaultAddr = data.find(addr => addr.is_default) || data[0];
            if (defaultAddr && !selectedAddressId) {
                setSelectedAddressId(defaultAddr.address_id);
            }
        } catch (error) {
            console.error('Failed to load addresses:', error);
        } finally {
            setAddressLoading(false);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, [profile]);

    // Get selected address object
    const selectedAddress = addresses.find(a => a.address_id === selectedAddressId);

    // Get full address string for API
    const getFullAddressString = (addr) => {
        if (!addr) return '';
        return [addr.street, addr.city].filter(Boolean).join(', ');
    };

    const calculateShipping = async () => {
        if (!selectedAddress) {
            setError('Pilih alamat pengiriman');
            return;
        }

        const addressString = getFullAddressString(selectedAddress);
        if (!addressString.trim()) {
            setError('Alamat tidak lengkap');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data } = await api.get(`/shipping/calculate?destination=${encodeURIComponent(addressString)}`);

            if (data.success) {
                // Check if eligible for free shipping
                const isFreeShipping = orderTotal >= data.shipping.freeThreshold;
                const finalCost = isFreeShipping ? 0 : data.shipping.cost;

                const shippingResult = {
                    ...data,
                    finalCost,
                    isFreeShipping,
                    selectedAddress
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
        onShippingCalculated?.(null);
    };

    const handleAddAddress = async (data) => {
        try {
            const response = await api.post('/users/me/addresses', data);
            showSuccess('Alamat baru berhasil ditambahkan!');
            setShowAddModal(false);
            await loadAddresses();
            // Select the newly added address
            if (response.data?.address_id) {
                setSelectedAddressId(response.data.address_id);
            }
        } catch (error) {
            console.error('Failed to save address:', error);
            showError('Gagal menyimpan alamat.');
        }
    };

    const handleSelectAddress = (addressId) => {
        if (addressId === 'add_new') {
            setShowAddModal(true);
        } else {
            setSelectedAddressId(addressId);
            // Clear previous result when address changes
            if (result) {
                clearResult();
            }
        }
        setIsDropdownOpen(false);
    };

    // If not logged in
    if (!profile) {
        return (
            <div className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-2 mb-3">
                    <FiMapPin style={{ color: '#03BEB0' }} size={20} />
                    <h3 className="font-semibold" style={{ color: '#065D5F' }}>Hitung Ongkir</h3>
                </div>
                <p className="text-gray-500 text-sm text-center py-4">
                    Silakan login untuk melihat alamat pengiriman
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border p-4 space-y-4">
            <div className="flex items-center gap-2">
                <FiMapPin style={{ color: '#03BEB0' }} size={20} />
                <h3 className="font-semibold" style={{ color: '#065D5F' }}>Hitung Ongkir</h3>
            </div>

            {!result ? (
                <>
                    {/* Address Dropdown */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-gray-400">location_on</span>
                            Alamat Pengiriman
                        </label>

                        {addressLoading ? (
                            <div className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 flex items-center gap-2">
                                <FiLoader className="animate-spin text-gray-400" size={16} />
                                <span className="text-gray-400 text-sm">Memuat alamat...</span>
                            </div>
                        ) : addresses.length === 0 ? (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-4 hover:border-teal-400 hover:bg-teal-50/50 transition-all flex items-center justify-center gap-2 group"
                            >
                                <FiPlus className="text-gray-400 group-hover:text-teal-500 transition-colors" size={20} />
                                <span className="text-gray-500 group-hover:text-teal-600 font-medium transition-colors">
                                    Tambah Alamat Pertama
                                </span>
                            </button>
                        ) : (
                            <div className="relative">
                                {/* Selected Address Display */}
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-left bg-white hover:border-teal-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all flex items-center justify-between"
                                >
                                    {selectedAddress ? (
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-800 text-sm">{selectedAddress.label}</span>
                                                {selectedAddress.is_default && (
                                                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700 font-medium">
                                                        Utama
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-sm truncate mt-0.5">
                                                {selectedAddress.street}, {selectedAddress.city}
                                            </p>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">Pilih alamat...</span>
                                    )}
                                    <FiChevronDown
                                        className={`text-gray-400 transition-transform flex-shrink-0 ml-2 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        size={20}
                                    />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                                        <div className="max-h-64 overflow-y-auto">
                                            {addresses.map((addr) => (
                                                <button
                                                    key={addr.address_id}
                                                    onClick={() => handleSelectAddress(addr.address_id)}
                                                    className={`w-full px-4 py-3 text-left hover:bg-teal-50 transition-colors border-b border-gray-100 last:border-b-0 ${selectedAddressId === addr.address_id ? 'bg-teal-50' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="material-symbols-outlined text-[18px]"
                                                            style={{ color: addr.is_default ? '#03BEB0' : '#9CA3AF' }}
                                                        >
                                                            {addr.is_default ? 'home' : 'location_on'}
                                                        </span>
                                                        <span className="font-semibold text-gray-800 text-sm">{addr.label}</span>
                                                        {addr.is_default && (
                                                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-700 font-medium">
                                                                Utama
                                                            </span>
                                                        )}
                                                        {selectedAddressId === addr.address_id && (
                                                            <FiCheck className="ml-auto text-teal-500" size={16} />
                                                        )}
                                                    </div>
                                                    <p className="text-gray-500 text-sm mt-0.5 pl-6 truncate">
                                                        {addr.street}, {addr.city}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Add New Address Option */}
                                        <button
                                            onClick={() => handleSelectAddress('add_new')}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-t border-gray-200 flex items-center gap-2"
                                            style={{ color: '#03BEB0' }}
                                        >
                                            <FiPlus size={18} />
                                            <span className="font-semibold text-sm">Tambah Alamat Baru</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
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
                        disabled={loading || !selectedAddress}
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
                        <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-[16px]" style={{ color: '#03BEB0' }}>
                                {result.selectedAddress?.is_default ? 'home' : 'location_on'}
                            </span>
                            <span className="text-sm font-semibold text-gray-800">{result.selectedAddress?.label}</span>
                        </div>
                        <p className="text-sm text-gray-600 pl-6">{result.destination}</p>
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

            {/* Add Address Modal */}
            {showAddModal && (
                <AddAddressModal
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddAddress}
                />
            )}
        </div>
    );
}
