import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

/**
 * Floating WhatsApp button with mascot-style hover
 */
export default function WhatsAppButton({ phoneNumber = '6288970788847' }) {
  const [isHovered, setIsHovered] = useState(false);

  const message = encodeURIComponent('Halo MJ Kitchen! Saya ingin bertanya tentang menu...');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Chat via WhatsApp"
    >
      {/* Hover Label */}
      <div
        className={`
          mr-3 bg-white text-secondary-500 px-4 py-2 rounded-xl shadow-lg font-semibold text-sm
          transition-all duration-300
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
        `}
      >
        Tanya 24 Jam
      </div>

      {/* Button */}
      <div className="relative">
        {/* Pulse Ring */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30" />

        {/* Main Button */}
        <div className="relative w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110">
          <FaWhatsapp className="text-white" size={28} />
        </div>
      </div>
    </a>
  );
}

/**
 * Helper function to generate WhatsApp order message
 */
export function generateWhatsAppOrderMessage(items, total) {
  let message = '🍱 *PESANAN MJ KITCHEN*\n\n';

  items.forEach((item, index) => {
    const itemPrice = Number(item.price) + (item.addonsTotal || 0);
    message += `${index + 1}. ${item.menu_name} x${item.quantity}\n`;
    message += `   Rp ${(itemPrice * item.quantity).toLocaleString()}\n`;

    if (item.addons?.length > 0) {
      message += `   + ${item.addons.map(a => a.menu_name).join(', ')}\n`;
    }
    if (item.notes) {
      message += `   📝 ${item.notes}\n`;
    }
    message += '\n';
  });

  message += `━━━━━━━━━━━━━━━\n`;
  message += `*TOTAL: Rp ${total.toLocaleString()}*\n\n`;
  message += `Mohon konfirmasi pesanan ini. Terima kasih! 🙏`;

  return message;
}