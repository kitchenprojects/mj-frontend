// client/src/pages/admin/AdminAddressPage.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { FiMapPin, FiPlus, FiEdit, FiTrash2, FiX, FiHome, FiArrowLeft } from 'react-icons/fi';

// NOTE: This is the same modal from AddressManager.jsx
// For larger apps, you might move this to a shared component.
const AddressModal = ({ address, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: address || {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {address ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Label (e.g. "Home", "Work")</label>
              <input
                type="text"
                {...register('label', { required: 'Label is required' })}
                className="mt-1 block w-full"
              />
              {errors.label && <p className="mt-1 text-xs text-red-500">{errors.label.message}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Street</label>
              <input
                type="text"
                {...register('street', { required: 'Street is required' })}
                className="mt-1 block w-full"
              />
              {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street.message}</p>}
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                {...register('city', { required: 'City is required' })}
                className="mt-1 block w-full"
              />
              {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                {...register('postal_code')}
                className="mt-1 block w-full"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register('is_default')} className="rounded" />
                <span className="text-sm text-gray-700">Set as default address</span>
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
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// This is the main AdminAddressPage
export default function AdminAddressPage() {
  const { userId } = useParams(); // Get the user ID from the URL
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [userName, setUserName] = useState('');

  const loadAddresses = async () => {
    if (userId) {
      try {
        // We can't get the user name from this endpoint, so we'll just load addresses
        const { data } = await api.get(`/users/admin/${userId}/addresses`);
        setAddresses(data);
        // A full app might fetch the user's name separately, but we'll skip for simplicity
      } catch (error) {
        console.error('Failed to load addresses:', error);
      }
    }
  };

  useEffect(() => {
    loadAddresses();
    // We could fetch the user's name here:
    // api.get(`/users`).then(r => setUserName(r.data.find(u => u.id === userId)?.name))
  }, [userId]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleModalSave = async (data) => {
    try {
      if (editingAddress) {
        // Use admin route
        await api.put(`/users/admin/${userId}/addresses/${editingAddress.address_id}`, data);
      } else {
        // Use admin route
        await api.post(`/users/admin/${userId}/addresses`, data);
      }
      handleModalClose();
      loadAddresses(); // Refresh the list
    } catch (error) {
      console.error('Failed to save address:', error);
      alert('Failed to save address.');
    }
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        // Use admin route
        await api.delete(`/users/admin/${userId}/addresses/${addressId}`);
        loadAddresses(); // Refresh
      } catch (error) {
        console.error('Failed to delete address:', error);
      }
    }
  };

  return (
    <div className="py-6">
      <div className="mb-4">
        <Link 
          to="/admin/profiles" 
          className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800"
        >
          <FiArrowLeft />
          Back to Profiles
        </Link>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <FiMapPin className="text-emerald-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">
              Manage Addresses (User: {userId.substring(0, 8)}...)
            </h2>
          </div>
          <button
            onClick={() => {
              setEditingAddress(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700"
          >
            <FiPlus size={16} />
            Add New
          </button>
        </div>

        <div className="p-6">
          {addresses.length === 0 ? (
            <p className="text-gray-500 text-sm">This user has no addresses.</p>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.address_id} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-gray-800">{addr.label}</span>
                      {addr.is_default && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <FiHome size={12} /> Default
                        </span>
                      )}
                      <p className="text-sm text-gray-600">{addr.street}</p>
                      <p className="text-sm text-gray-600">{addr.city}, {addr.postal_code}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingAddress(addr);
                          setIsModalOpen(true);
                        }}
                        className="text-gray-500 hover:text-emerald-600"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(addr.address_id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <AddressModal
          address={editingAddress}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}