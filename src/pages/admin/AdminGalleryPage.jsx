// client/src/pages/admin/AdminGalleryPage.jsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
// ✨ Import our new upload function
import { uploadImage } from '../../services/supabase';
import { FiEdit, FiTrash2, FiX, FiPlus, FiImage, FiArrowLeft, FiUpload } from 'react-icons/fi';

// --- Modal Component ---
const GalleryModal = ({ image, onClose, onSave, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    // Set default caption. File input cannot have a default value.
    defaultValues: { caption: image?.caption || '' },
  });

  const onSubmit = (data) => {
    // onSave will now handle the async upload
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {image ? 'Edit Image' : 'Add New Image'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            
            {/* Image Preview (for editing) */}
            {image && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Image</label>
                <img src={image.image_url} alt="Current" className="mt-1 w-full h-32 object-cover rounded-md border" />
              </div>
            )}

            {/* ✨ File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {image ? 'Upload New Image (Optional)' : 'Upload Image'}
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                {...register('image_file', { 
                  // Make required only when *creating* a new image
                  required: !image ? 'An image file is required' : false 
                })}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-emerald-50 file:text-emerald-700
                  hover:file:bg-emerald-100"
              />
              {errors.image_file && <p className="mt-1 text-xs text-red-500">{errors.image_file.message}</p>}
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Caption (Optional)</label>
              <textarea
                {...register('caption')}
                rows={3}
                className="mt-1 block w-full"
              />
            </div>
          </div>
          <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <FiUpload className="animate-pulse" />
                  Uploading...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Main Page Component ---
export default function AdminGalleryPage() {
  const { menuId } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [modalLoading, setModalLoading] = useState(false); // For modal spinner

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/menu/items/${menuId}`);
      setMenuItem(data);
    } catch (error) {
      console.error("Failed to load menu data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [menuId]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentImage(null);
  };

  // ✨ This function now handles the upload logic
  const handleModalSave = async (formData) => {
    setModalLoading(true);
    let imageUrl = currentImage?.image_url; // Start with the existing URL
    
    try {
      // 1. Check if a new file was uploaded
      const file = formData.image_file?.[0];
      if (file) {
        // If yes, upload it to Supabase Storage
        imageUrl = await uploadImage(file);
      }
      
      // 2. Prepare the payload for our Express server
      const payload = {
        image_url: imageUrl,
        caption: formData.caption,
      };

      // 3. Send the payload (with the URL) to our Express server
      if (currentImage) {
        // Update
        await api.put(`/menu/gallery/${currentImage.gallery_id}`, payload);
      } else {
        // Create
        await api.post(`/menu/${menuId}/gallery`, payload);
      }
      
      handleModalClose();
      loadData(); // Refresh the list
    } catch (error) {
      console.error('Failed to save image:', error);
      alert('Failed to save image. Check the console for details.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (galleryId) => {
    if (window.confirm('Are you sure you want to delete this image? (This does not delete it from Supabase Storage, only from the gallery)')) {
      try {
        await api.delete(`/menu/gallery/${galleryId}`);
        loadData(); // Refresh
      } catch (error) {
        console.error('Failed to delete image:', error);
        alert('Failed to delete image.');
      }
    }
  };

  return (
    <div className="py-6">
      <div className="mb-4">
        <Link 
          to="/admin/menu" 
          className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800"
        >
          <FiArrowLeft />
          Back to Menu List
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">
          Manage Gallery: <span className="text-emerald-600">{menuItem?.menu_name || '...'}</span>
        </h1>
        <button
          onClick={() => {
            setCurrentImage(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-md text-sm hover:bg-emerald-700"
        >
          <FiPlus size={16} />
          Add Image
        </button>
      </div>

      {/* ... (keep Image Grid) ... */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <p className="text-gray-500">Loading images...</p>
        ) : menuItem?.images.length === 0 ? (
          <p className="text-gray-500">No gallery images found for this item.</p>
        ) : (
          menuItem?.images.map((img) => (
            <div key={img.gallery_id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <img src={img.image_url} alt={img.caption || 'Gallery image'} className="w-full h-40 object-cover" />
              <div className="p-3">
                <p className="text-sm text-gray-600 truncate">{img.caption || 'No caption'}</p>
                <div className="flex justify-end gap-3 mt-2">
                  <button 
                    onClick={() => {
                      setCurrentImage(img);
                      setIsModalOpen(true);
                    }} 
                    className="text-emerald-600 hover:text-emerald-900"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(img.gallery_id)} 
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <GalleryModal
          image={currentImage}
          onClose={handleModalClose}
          onSave={handleModalSave}
          loading={modalLoading}
        />
      )}
    </div>
  );
}