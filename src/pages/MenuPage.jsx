import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import MenuItem from '../components/MenuItem';
import AddOnModal from '../components/AddOnModal';
import { useCartStore } from '../store/cartStore';
import { showSuccess } from '../utils/swal';
import { FiSearch, FiX } from 'react-icons/fi';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const addItem = useCartStore((s) => s.addItem);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setActive(categoryFromUrl);
    }
    api.get('/menu/categories').then((r) => setCategories(r.data));
  }, [searchParams]);

  useEffect(() => {
    const url = active ? `/menu/items?category_id=${active}` : '/menu/items';
    api.get(url).then((r) => setItems(r.data));
  }, [active]);

  const filteredItems = items.filter(item =>
    !searchQuery || item.menu_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleAddWithCustomization = (item, quantity, notes, addons) => {
    addItem(item, quantity, notes, addons);
    showSuccess(`${item.menu_name} ditambahkan ke keranjang!`);
    setSelectedItem(null);
  };

  const handleQuickAdd = (item) => {
    addItem(item, 1, '', []);
    showSuccess(`${item.menu_name} ditambahkan!`);
  };

  const getButtonClass = (categoryId) => {
    const baseClass = 'px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200';
    if (active === categoryId) {
      return baseClass;
    }
    return `${baseClass} bg-white border border-gray-200 text-gray-700 hover:border-teal-300 hover:text-teal-500`;
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#065D5F' }}>Daftar Menu</h1>
        <p className="text-gray-500">Pilih menu favoritmu dan pesan sekarang</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setActive('')}
          className={getButtonClass('')}
          style={active === '' ? { backgroundColor: '#03BEB0', color: 'white' } : {}}
        >
          Semua
        </button>
        {categories.map((c) => (
          <button
            key={c.category_id}
            onClick={() => setActive(c.category_id)}
            className={getButtonClass(c.category_id)}
            style={active === c.category_id ? { backgroundColor: '#03BEB0', color: 'white' } : {}}
          >
            {c.category_name}
          </button>
        ))}
      </div>

      {/* Results Count */}
      {searchQuery && (
        <p className="text-sm text-gray-500 mb-4">
          Menampilkan {filteredItems.length} hasil untuk "{searchQuery}"
        </p>
      )}

      {/* Menu Item Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border">
          <p className="text-gray-500">Tidak ada menu ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filteredItems.map((item) => (
            <MenuItem
              key={item.menu_id}
              item={item}
              onAdd={handleQuickAdd}
              onCustomize={handleItemClick}
            />
          ))}
        </div>
      )}

      {/* Add-on Modal */}
      {selectedItem && (
        <AddOnModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onConfirm={handleAddWithCustomization}
        />
      )}
    </div>
  );
}