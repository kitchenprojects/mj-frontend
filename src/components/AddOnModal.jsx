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

    const addonsTotal = selectedAddons.reduce((sum, a) => sum + Number(a.price), 0);
    const itemTotal = (Number(item.price) + addonsTotal) * quantity;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold text-secondary-500">Custom Order</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    {/* Item Info */}
                    <div className="flex gap-4 bg-accent-100 p-4 rounded-xl">
                        {item.images?.[0]?.image_url && (
                            <img
                                src={item.images[0].image_url}
                                alt={item.menu_name}
                                className="w-16 h-16 rounded-xl object-cover"
                            />
                        )}
                        <div>
                            <h3 className="font-semibold text-secondary-500">{item.menu_name}</h3>
                            <p className="text-primary-500 font-bold">
                                Rp {Number(item.price).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-semibold text-secondary-500 mb-2">Jumlah</label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 text-lg font-medium text-secondary-500"
                            >
                                -
                            </button>
                            <span className="w-12 text-center font-bold text-lg text-secondary-500">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 text-lg font-medium text-secondary-500"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Add-ons */}
                    <div>
                        <label className="block text-sm font-semibold text-secondary-500 mb-2">
                            Tambahan (Opsional)
                        </label>
                        {loading ? (
                            <p className="text-gray-400 text-sm">Loading...</p>
                        ) : addons.length > 0 ? (
                            <div className="space-y-2">
                                {addons.map(addon => {
                                    const isSelected = selectedAddons.some(a => a.menu_id === addon.menu_id);
                                    return (
                                        <button
                                            key={addon.menu_id}
                                            onClick={() => toggleAddon(addon)}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${isSelected
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-gray-200 hover:border-primary-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-300'
                                                    }`}>
                                                    {isSelected && <FiCheck size={12} />}
                                                </div>
                                                <span className="text-sm text-secondary-500 font-medium">{addon.menu_name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-primary-500">
                                                +Rp {Number(addon.price).toLocaleString()}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">Tidak ada tambahan tersedia</p>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-secondary-500 mb-2">
                            Catatan Khusus (Opsional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Contoh: Pedas level 2, tanpa bawang..."
                            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-secondary-500 font-medium">Total</span>
                        <span className="text-2xl font-bold text-primary-500">
                            Rp {itemTotal.toLocaleString()}
                        </span>
                    </div>
                    <button
                        onClick={handleConfirm}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors text-lg"
                    >
                        <FiPlus size={18} />
                        Tambah ke Keranjang
                    </button>
                </div>
            </div>
        </div>
    );
}
