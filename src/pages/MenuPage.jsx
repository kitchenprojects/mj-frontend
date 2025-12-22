import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import AddOnModal from '../components/AddOnModal';
import { useCartStore } from '../store/cartStore';
import { showSuccess } from '../utils/swal';

// Category icon mapping
const categoryIcons = {
  'default': 'restaurant_menu',
  'appetizer': 'tapas',
  'main': 'restaurant',
  'salad': 'nutrition',
  'dessert': 'icecream',
  'beverage': 'local_cafe',
  'nasi': 'rice_bowl',
  'ayam': 'egg_alt',
  'ikan': 'set_meal',
  'sayur': 'eco',
  'sambal': 'whatshot',
  'paket': 'takeout_dining',
};

function getCategoryIcon(categoryName) {
  const name = categoryName?.toLowerCase() || '';
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (name.includes(key)) return icon;
  }
  return categoryIcons.default;
}

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilters, setDietaryFilters] = useState([]);
  const addItem = useCartStore((s) => s.addItem);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
    api.get('/menu/categories').then((r) => setCategories(r.data));
    api.get('/menu/items').then((r) => setItems(r.data));
  }, [searchParams]);

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const grouped = {};
    items.forEach((item) => {
      const catId = item.category_id || 'uncategorized';
      if (!grouped[catId]) {
        grouped[catId] = [];
      }
      grouped[catId].push(item);
    });
    return grouped;
  }, [items]);

  // Filter items based on search and dietary filters
  const filterItems = (itemsList) => {
    return itemsList.filter((item) => {
      const matchesSearch = !searchQuery ||
        item.menu_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // For now, dietary filters are placeholder - can be enhanced with actual data
      return matchesSearch;
    });
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId) {
      const element = document.getElementById(`category-${categoryId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToOrder = (item) => {
    addItem(item, 1, '', []);
    showSuccess(`${item.menu_name} ditambahkan ke keranjang!`);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleAddWithCustomization = (item, quantity, notes, addons) => {
    addItem(item, quantity, notes, addons);
    showSuccess(`${item.menu_name} ditambahkan ke keranjang!`);
    setSelectedItem(null);
  };

  const toggleDietaryFilter = (filter) => {
    setDietaryFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="min-h-screen -mx-4 md:-mx-6 lg:-mx-8 -my-8">
      {/* Hero Section */}
      <div className="w-full">
        <div
          className="relative flex h-[280px] md:h-[360px] w-full flex-col justify-center items-center bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(6, 93, 95, 0.7) 0%, rgba(6, 93, 95, 0.85) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-I5u466OuVHim7-62CyBEaYbre9MsOUSyMr0VmYcWsj7s9t2QMyoEQwHysHffldmmgakEXdc0x_WZY3zxI-7BWt_YMtoK0mCzTlaDpgRQE7bXxXUTgGp-mwlNMNrBV-38lOnNrXCx-rpVg4Y64sgQzzEMQzjVg_OOit9AnUkyqvvwRrspWuTJA_5k6uaoVObbdoxWRilhNJSnTJ5Y0tFNjWWWM0JoodTS9QWvg-5JZAF7oEGH36wDNXsHjrMNidrg5uXvYxMYgNTU")`,
          }}
        >
          <div className="flex flex-col gap-4 text-center px-4 max-w-3xl">
            <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
              Daftar Menu
            </h1>
            <h2 className="text-gray-100 text-base md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              Jelajahi menu kuliner kami yang beragam, dibuat dengan bahan-bahan segar dan penuh cinta.
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-1/4 flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Search */}
              <div className="w-full">
                <label className="flex flex-col w-full h-12">
                  <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
                    <div className="text-gray-400 flex border-none bg-white items-center justify-center pl-4 rounded-l-xl">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl rounded-l-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 border-none bg-white h-full placeholder:text-gray-400 px-4 pl-2 text-base font-normal leading-normal"
                      placeholder="Cari menu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </label>
              </div>

              {/* Categories Nav */}
              <div className="flex flex-col bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col mb-3">
                  <h3 className="text-gray-800 text-lg font-bold leading-normal">Kategori</h3>
                </div>
                <div className="flex flex-col gap-1">
                  {/* All categories */}
                  <button
                    onClick={() => handleCategoryClick('')}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group text-left ${activeCategory === ''
                      ? 'bg-teal-50 text-teal-600'
                      : 'hover:bg-gray-50'
                      }`}
                  >
                    <span className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-110 ${activeCategory === '' ? 'text-teal-600' : 'text-gray-400 group-hover:text-teal-500'
                      }`}>
                      apps
                    </span>
                    <p className={`text-sm font-medium leading-normal ${activeCategory === '' ? 'font-bold text-teal-600' : 'text-gray-700 group-hover:text-teal-500'
                      }`}>
                      Semua Menu
                    </p>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.category_id}
                      onClick={() => handleCategoryClick(cat.category_id)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group text-left ${activeCategory === cat.category_id
                        ? 'bg-teal-50 text-teal-600'
                        : 'hover:bg-gray-50'
                        }`}
                    >
                      <span className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-110 ${activeCategory === cat.category_id ? 'text-teal-600' : 'text-gray-400 group-hover:text-teal-500'
                        }`}>
                        {getCategoryIcon(cat.category_name)}
                      </span>
                      <p className={`text-sm font-medium leading-normal ${activeCategory === cat.category_id ? 'font-bold text-teal-600' : 'text-gray-700 group-hover:text-teal-500'
                        }`}>
                        {cat.category_name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Filters */}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-gray-500 px-1">Preferensi Diet</h3>
                <div className="flex flex-wrap gap-2">
                  {['Vegetarian', 'Vegan', 'Halal', 'Pedas'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => toggleDietaryFilter(filter)}
                      className={`flex h-8 items-center justify-center gap-x-2 rounded-lg border px-3 transition-colors ${dietaryFilters.includes(filter)
                        ? 'bg-teal-500 border-teal-500 text-white'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-teal-300'
                        }`}
                    >
                      <p className="text-xs font-medium leading-normal">{filter}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Content (Menu Grid) */}
          <main className="w-full lg:w-3/4 flex flex-col gap-10">
            {/* Search Results Info */}
            {searchQuery && (
              <p className="text-sm text-gray-500">
                Menampilkan hasil untuk "{searchQuery}"
              </p>
            )}

            {/* Menu Sections by Category */}
            {categories.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border">
                <p className="text-gray-500">Memuat kategori...</p>
              </div>
            ) : (
              categories.map((cat) => {
                const categoryItems = filterItems(itemsByCategory[cat.category_id] || []);

                if (categoryItems.length === 0) return null;

                return (
                  <section
                    key={cat.category_id}
                    id={`category-${cat.category_id}`}
                    className="scroll-mt-28"
                  >
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 whitespace-nowrap">
                        {cat.category_name}
                      </h2>
                      <div className="h-px flex-1 bg-gray-200"></div>
                    </div>

                    {/* Menu Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryItems.map((item) => (
                        <MenuCard
                          key={item.menu_id}
                          item={item}
                          onAdd={handleAddToOrder}
                          onClick={handleItemClick}
                        />
                      ))}
                    </div>
                  </section>
                );
              })
            )}

            {/* Empty State */}
            {items.length > 0 && categories.every(cat => filterItems(itemsByCategory[cat.category_id] || []).length === 0) && (
              <div className="text-center py-12 bg-white rounded-2xl border">
                <p className="text-gray-500">Tidak ada menu ditemukan</p>
              </div>
            )}
          </main>
        </div>
      </div>

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

// Menu Card Component
function MenuCard({ item, onAdd, onClick }) {
  const firstImage = Array.isArray(item.images) && item.images[0]?.image_url;
  const displayImage = firstImage || item.image_url;

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100 hover:border-teal-200"
    >
      {/* Image */}
      <div
        className="h-48 overflow-hidden bg-gray-100 relative cursor-pointer"
        onClick={() => onClick(item)}
      >
        {displayImage ? (
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            src={displayImage}
            alt={item.menu_name}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #E6F7F6 0%, #F0F7F7 100%)' }}
          >
            <span className="text-5xl">🍱</span>
          </div>
        )}
        {/* Badge placeholder - can be enhanced with actual dietary data */}
        {item.is_vegetarian && (
          <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-green-700 backdrop-blur-sm">
            Veg
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{item.menu_name}</h3>
          <span className="text-teal-600 font-bold whitespace-nowrap">
            Rp {Number(item.price).toLocaleString()}
          </span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
          {item.description || 'Menu lezat siap dipesan'}
        </p>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-2">
          {/* Quick Add Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(item);
            }}
            className="flex-1 py-2.5 bg-teal-500 text-white font-semibold text-sm rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah
          </button>

          {/* Custom Order Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(item);
            }}
            className="py-2.5 px-3 border-2 border-teal-500 text-teal-600 font-semibold text-sm rounded-lg hover:bg-teal-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Custom
          </button>
        </div>
      </div>
    </div>
  );
}