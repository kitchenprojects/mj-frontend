// client/src/pages/ProfilePage.jsx
import React from 'react';
import ProfileDetails from '../components/ProfileDetails';
import AddressManager from '../components/AddressManager';

export default function ProfilePage() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
      
      {/* We use a grid for a clean, responsive two-section layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Details (RUD) */}
        <div className="lg:col-span-1">
          <ProfileDetails />
        </div>

        {/* Address Manager (CRUD) */}
        <div className="lg:col-span-2">
          <AddressManager />
        </div>

      </div>
    </div>
  );
}