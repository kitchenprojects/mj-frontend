// Add-on selection modal component
import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiCheck } from 'react-icons/fi';
import api from '../services/api';

export default function AddOnModal({ item, onClose, onConfirm }) {
    const [addons, setAddons] = useState([]);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [notes, setNotes] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch available add-ons
        api.get('/addons')
            .then(res => setAddons(res.data))
            .catch(err => console.error('Failed to load addons:', err))
            .finally(() => setLoading(false));
    }, []);

    const toggleAddon = (addon) => {
        setSelectedAddons(prev => {
            const exists = prev.find(a => a.menu_id === addon.menu_id);
            if (exists) {
                return prev.filter(a => a.menu_id !== addon.menu_id);
            }
            return [...prev, addon];
        });
    };

    const handleConfirm = () => {
        onConfirm(item, quantity, notes, selectedAddons);
        onClose();
    };

    // Calculate total
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + Number(a.price), 0);
    const itemTotal = (Number(item.price) + addonsTotal) * quantity;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Custom Order</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Item Info */}
                    <div className="flex gap-4 bg-gray-50 p-3 rounded-lg">
                        {item.images?.[0]?.image_url && (
                            <img
                                src={item.images[0].image_url}
                                alt={item.menu_name}
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                        )}
                        <div>
                            <h3 className="font-semibold text-gray-800">{item.menu_name}</h3>
                            <p className="text-emerald-600 font-medium">
                                Rp {Number(item.price).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-100"
                            >
                                -
                            </button>
                            <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Add-ons */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tambahan (Opsional)
                        </label>
                        {loading ? (
                            <p className="text-gray-500 text-sm">Loading add-ons...</p>
                        ) : addons.length > 0 ? (
                            <div className="space-y-2">
                                {addons.map(addon => {
                                    const isSelected = selectedAddons.some(a => a.menu_id === addon.menu_id);
                                    return (
                                        <button
                                            key={addon.menu_id}
                                            onClick={() => toggleAddon(addon)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${isSelected
                                                    ? 'border-emerald-500 bg-emerald-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300'
                                                    }`}>
                                                    {isSelected && <FiCheck size={14} />}
                                                </div>
                                                <span className="text-sm text-gray-800">{addon.menu_name}</span>
                                            </div>
                                            <span className="text-sm font-medium text-emerald-600">
                                                +Rp {Number(addon.price).toLocaleString()}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">Tidak ada tambahan tersedia</p>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catatan Khusus (Opsional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Contoh: Pedas level 2, tanpa bawang, extra sambal..."
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600">Total</span>
                        <span className="text-xl font-bold text-emerald-600">
                            Rp {itemTotal.toLocaleString()}
                        </span>
                    </div>
                    <button
                        onClick={handleConfirm}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <FiPlus size={18} />
                        Tambah ke Keranjang
                    </button>
                </div>
            </div>
        </div>
    );
}
