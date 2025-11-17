// client/src/pages/admin/AdminCategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { FiEdit, FiTrash2, FiX, FiPlus, FiTag } from 'react-icons/fi';

// --- Modal Component ---
const CategoryModal = ({ category, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: category || { category_name: '', description: '', image_url: '' },
  });

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {category ? 'Edit Category' : 'Add New Category'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                {...register('category_name', { required: 'Name is required' })}
                className="mt-1 block w-full"
              />
              {errors.category_name && <p className="mt-1 text-xs text-red-500">{errors.category_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
              <input
                type="text"
                {...register('image_url')}
                placeholder="https://example.com/image.png"
                className="mt-1 block w-full"
              />
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
export default function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/menu/categories');
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
  };

  const handleModalSave = async (data) => {
    try {
      if (currentCategory) {
        // Update
        await api.put(`/menu/categories/${currentCategory.category_id}`, data);
      } else {
        // Create
        await api.post('/menu/categories', data);
      }
      handleModalClose();
      loadCategories(); // Refresh the list
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category.');
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure? Deleting a category may affect existing menu items.')) {
      try {
        await api.delete(`/menu/categories/${categoryId}`);
        loadCategories(); // Refresh
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert('Failed to delete category.');
      }
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Manage Categories</h1>
        <button
          onClick={() => {
            setCurrentCategory(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-md text-sm hover:bg-emerald-700"
        >
          <FiPlus size={16} />
          Add Category
        </button>
      </div>
      
      {/* Category List */}
      <div className="bg-white border rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="3" className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.category_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{cat.category_name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate" style={{ maxWidth: '300px' }}>
                  {cat.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button 
                    onClick={() => {
                      setCurrentCategory(cat);
                      setIsModalOpen(true);
                    }} 
                    className="text-emerald-600 hover:text-emerald-900"
                  >
                    <FiEdit />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.category_id)} 
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
        <CategoryModal
          category={currentCategory}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}