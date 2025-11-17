import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer'; // Import the new Footer
import WhatsAppButton from './WhatsAppButton'; // Import the new Button

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* This 'main' section is set to grow, pushing the footer down.
        The content inside is constrained by 'max-w-5xl'.
      */}
      <main className="flex-grow w-full max-w-5xl mx-auto p-4 md:p-6">
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