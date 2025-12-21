import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { format } from 'date-fns';
import { FiPlus, FiEdit, FiTrash2, FiX, FiRefreshCw, FiPackage } from 'react-icons/fi';
import { showSuccess, showError, confirmDelete } from '../../utils/swal';

export default function AdminAddonsPage() {
    const [addons, setAddons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);

    // Form state
    const [form, setForm] = useState({
        menu_name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: ''
    });

    const loadAddons = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/addons');
            setAddons(data);
        } catch (error) {
            console.error('Failed to load add-ons:', error);
            showError('Gagal memuat add-ons');
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const { data } = await api.get('/menu/categories');
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    useEffect(() => {
        loadAddons();
        loadCategories();
    }, []);

    const openCreateModal = () => {
        setEditItem(null);
        setForm({
            menu_name: '',
            description: '',
            price: '',
            category_id: categories[0]?.category_id || '',
            image_url: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditItem(item);
        setForm({
            menu_name: item.menu_name,
            description: item.description || '',
            price: item.price,
            category_id: item.category_id || '',
            image_url: item.image_url || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (item) => {
        const confirmed = await confirmDelete(item.menu_name);
        if (confirmed) {
            try {
                await api.delete(`/menu/items/${item.menu_id}`);
                showSuccess('Add-on berhasil dihapus');
                loadAddons();
            } catch (error) {
                console.error('Failed to delete:', error);
                showError('Gagal menghapus add-on');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editItem) {
                // Update existing
                await api.put(`/menu/items/${editItem.menu_id}`, {
                    ...form,
                    price: Number(form.price),
                    is_available: true
                });
                showSuccess('Add-on berhasil diupdate');
            } else {
                // Create new - nama dengan prefix untuk identifikasi as add-on
                const addonName = form.menu_name.toLowerCase().includes('tambah') ||
                    form.menu_name.toLowerCase().includes('extra')
                    ? form.menu_name
                    : `Tambah ${form.menu_name}`;

                await api.post('/menu/items', {
                    ...form,
                    menu_name: addonName,
                    price: Number(form.price),
                    is_available: true,
                    images: form.image_url ? [form.image_url] : []
                });
                showSuccess('Add-on berhasil dibuat');
            }
            setIsModalOpen(false);
            loadAddons();
        } catch (error) {
            console.error('Failed to save:', error);
            showError('Gagal menyimpan add-on');
        } finally {
            setSaving(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kelola Add-ons</h1>
                    <p className="text-gray-500 text-sm">Tambahan menu untuk custom order</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={loadAddons}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <FiPlus size={16} /> Tambah Add-on
                    </button>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-800 mb-1">💡 Tips Add-on</h3>
                <p className="text-sm text-blue-700">
                    Add-on adalah item tambahan yang bisa dipilih customer saat memesan.
                    Sistem akan mendeteksi item dengan nama mengandung "Tambah" atau "Extra",
                    atau item dengan harga ≤ Rp 10.000 sebagai add-on.
                </p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">
                    <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    Loading add-ons...
                </div>
            ) : addons.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                    <FiPackage size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Belum ada add-on</p>
                    <button
                        onClick={openCreateModal}
                        className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                        Buat Add-on Pertama
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-lg border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Add-on</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Deskripsi</th>
                                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Harga</th>
                                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {addons.map((item) => (
                                <tr key={item.menu_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.menu_name} className="w-10 h-10 rounded object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                                                    <FiPackage className="text-gray-400" />
                                                </div>
                                            )}
                                            <span className="font-medium text-gray-800">{item.menu_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                                        {item.description || '-'}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-emerald-600">
                                        +Rp {Number(item.price).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <FiEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {editItem ? 'Edit Add-on' : 'Tambah Add-on Baru'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Add-on</label>
                                <input
                                    type="text"
                                    name="menu_name"
                                    value={form.menu_name}
                                    onChange={handleFormChange}
                                    placeholder="Contoh: Extra Sambal, Nasi Tambah"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Sistem akan menambah "Tambah" di depan jika belum ada
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleFormChange}
                                    placeholder="Deskripsi singkat (opsional)"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleFormChange}
                                    placeholder="5000"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select
                                    name="category_id"
                                    value={form.category_id}
                                    onChange={handleFormChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    {categories.map(c => (
                                        <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar (Opsional)</label>
                                <input
                                    type="url"
                                    name="image_url"
                                    value={form.image_url}
                                    onChange={handleFormChange}
                                    placeholder="https://..."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {saving ? 'Menyimpan...' : editItem ? 'Update' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
