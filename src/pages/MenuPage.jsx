import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MenuItem from '../components/MenuItem';
import { useCartStore } from '../store/cartStore';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState('');
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    api.get('/menu/categories').then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    const url = active ? `/menu/items?category_id=${active}` : '/menu/items';
    api.get(url).then((r) => setItems(r.data));
  }, [active]);

  // Helper function for styling the category buttons
  const getButtonClass = (categoryId) => {
    const baseClass = 'px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200';
    if (active === categoryId) {
      return `${baseClass} bg-emerald-600 text-white border border-emerald-600`;
    }
    return `${baseClass} bg-white border border-gray-300 text-gray-700 hover:bg-gray-100`;
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Our Menu</h1>
      
      {/* Category Filters */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <button
          onClick={() => setActive('')}
          className={getButtonClass('')}
        >
          All
        </button>
        {categories.map((c) => (
          <button 
            key={c.category_id} 
            onClick={() => setActive(c.category_id)}
            className={getButtonClass(c.category_id)}
          >
            {c.category_name}
          </button>
        ))}
      </div>
      
      {/* Menu Item Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item) => (
          <MenuItem key={item.menu_id} item={item} onAdd={addItem} />
        ))}
      </div>
    </div>
  );
}