import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import FloatingCart from './FloatingCart';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Main content area - full width, pages control their own max-width and padding */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>

      <Footer />

      {/* Floating buttons - fixed relative to the viewport */}
      <FloatingCart />
      <WhatsAppButton phoneNumber="6288970788847" />
    </div>
  );
}