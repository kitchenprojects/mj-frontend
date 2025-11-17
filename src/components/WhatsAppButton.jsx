import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

// Pass your phone number as a prop
export default function WhatsAppButton({ phoneNumber = '6288970788847' }) {
  // Ensure the number is just digits, starting with the country code (e.g., 62 for Indonesia)
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transform hover:scale-110 transition-all duration-300 ease-in-out"
    >
      <FaWhatsapp size={28} />
    </a>
  );
}