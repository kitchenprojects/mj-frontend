// client/src/components/AddressManager.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { FiMapPin, FiPlus, FiEdit, FiTrash2, FiX, FiHome } from 'react-icons/fi';

// This is the modal component, defined in the same file for simplicity
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


// This is the main AddressManager component
export default function AddressManager() {
  const profile = useAuthStore((s) => s.profile);
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const loadAddresses = async () => {
    if (profile?.id) {
      try {
        const { data } = await api.get(`/users/me/addresses`);
        setAddresses(data);
      } catch (error) {
        console.error('Failed to load addresses:', error);
      }
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [profile]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleModalSave = async (data) => {
    try {
      if (editingAddress) {
        await api.put(`/users/me/addresses/${editingAddress.address_id}`, data);
      } else {
        await api.post(`/users/me/addresses`, data);
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
        await api.delete(`/users/me/addresses/${addressId}`);
        loadAddresses(); // Refresh
      } catch (error) {
        console.error('Failed to delete address:', error);
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <FiMapPin className="text-emerald-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">My Addresses</h2>
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
          <p className="text-gray-500 text-sm">You haven't added any addresses yet.</p>
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