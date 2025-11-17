// client/src/pages/admin/AdminMenuPage.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FiEdit, FiTrash2, FiX, FiPlus, FiClipboard, FiPackage, FiCheckSquare, FiImage } from 'react-icons/fi';

// --- Modal Component ---
const MenuModal = ({ item, categories, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: item || { 
      menu_name: '', 
      description: '', 
      price: 0, 
      image_url: '', 
      is_available: true,
      category_id: ''
    },
  });

  // Prepare data for the API (convert price to number)
  const onSubmit = (data) => {
    onSave({
      ...data,
      price: Number(data.price),
      is_available: Boolean(data.is_available),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto scrollbar-thin">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {item ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Menu Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Menu Name</label>
              <input
                type="text"
                {...register('menu_name', { required: 'Name is required' })}
                className="mt-1 block w-full"
              />
              {errors.menu_name && <p className="mt-1 text-xs text-red-500">{errors.menu_name.message}</p>}
            </div>
            
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                {...register('category_id', { required: 'Category is required' })}
                className="mt-1 block w-full"
              >
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id.message}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (Rp)</label>
              <input
                type="number"
                step="500"
                {...register('price', { required: 'Price is required', min: 0 })}
                className="mt-1 block w-full"
              />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
            </div>

            {/* Main Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Main Image URL (Optional)</label>
              <input
                type="text"
                {...register('image_url')}
                placeholder="https://example.com/image.png"
                className="mt-1 block w-full"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
              <textarea
                {...register('description')}
                rows={4}
                className="mt-1 block w-full"
              />
            </div>
            
            {/* Is Available */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  {...register('is_available')} 
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Is Available</span>
              </label>
            </div>

          </div>
          <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Main Page Component ---
export default function AdminMenuPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [menuRes, categoriesRes] = await Promise.all([
        api.get('/menu/items'),
        api.get('/menu/categories')
      ]);
      setItems(menuRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Failed to load menu data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleModalSave = async (data) => {
    try {
      if (currentItem) {
        // Update
        await api.put(`/menu/items/${currentItem.menu_id}`, data);
      } else {
        // Create
        // Note: The gallery 'images' field is not handled in this form for simplicity.
        // The backend controller for create handles an 'images' array, but update does not.
        await api.post('/menu/items', data);
      }
      handleModalClose();
      loadData(); // Refresh the list
    } catch (error) {
      console.error('Failed to save menu item:', error);
      alert('Failed to save menu item.');
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item? This will also delete its gallery images.')) {
      try {
        await api.delete(`/menu/items/${itemId}`);
        loadData(); // Refresh
      } catch (error) {
        console.error('Failed to delete menu item:', error);
        alert('Failed to delete menu item.');
      }
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Manage Menu</h1>
        <button
          onClick={() => {
            setCurrentItem(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-md text-sm hover:bg-emerald-700"
        >
          <FiPlus size={16} />
          Add Menu Item
        </button>
      </div>
      
      {/* Menu Item List */}
      <div className="bg-white border rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : items.map((item) => (
              <tr key={item.menu_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.menu_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.category_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Rp {Number(item.price).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 text-xs leading-5 font-semibold rounded-full px-2 py-0.5 ${
                    item.is_available
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.is_available ? <FiCheckSquare /> : <FiPackage />}
                    {item.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <Link 
                    to={`/admin/menu/${item.menu_id}/gallery`}
                    className="text-blue-600 hover:text-blue-900 inline-block"
                    title="Manage Gallery"
                  >
                    <FiImage />
                  </Link>
                  <button 
                    onClick={() => {
                      setCurrentItem(item);
                      setIsModalOpen(true);
                    }} 
                    className="text-emerald-600 hover:text-emerald-900"
                  >
                    <FiEdit />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.menu_id)} 
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <MenuModal
          item={currentItem}
          categories={categories}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}