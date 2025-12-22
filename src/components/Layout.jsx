import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer'; // Import the new Footer
import WhatsAppButton from './WhatsAppButton'; // Import the new Button

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Main content area - full width, pages control their own max-width and padding */}
      <main className="flex-grow w-full">
        <Outlet />
      </main>

      <Footer />

      {/* The WhatsApp button is fixed relative to the viewport,
          so it lives outside the main page flow. */}
      {/* TODO: Add your real phone number here */}
      <WhatsAppButton phoneNumber="6281234567890" />
    </div>
  );
}