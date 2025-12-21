import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

/**
 * Floating WhatsApp button component
 * Allows customers to quickly contact admin via WhatsApp
 */
export default function WhatsAppButton({
  phoneNumber = '6288970788847',
  message = 'Halo MJ Kitchen, saya ingin bertanya tentang menu.'
}) {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transform hover:scale-110 transition-all duration-300 ease-in-out flex items-center gap-2 group"
    >
      <FaWhatsapp size={28} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-medium pr-0 group-hover:pr-2">
        Chat Admin
      </span>
    </a>
  );
}

/**
 * Generate WhatsApp order message from cart items
 */
export function generateWhatsAppOrderMessage(items, total, notes = '') {
  let message = '🍽️ *PESANAN BARU - MJ Kitchen*\n\n';
  message += '📋 *Detail Pesanan:*\n';

  items.forEach((item, idx) => {
    message += `${idx + 1}. ${item.menu_name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString()}\n`;
  });

  message += `\n💰 *Total: Rp ${total.toLocaleString()}*\n`;

  if (notes) {
    message += `\n📝 *Catatan:* ${notes}\n`;
  }

  message += '\n---\nMohon konfirmasi ketersediaan dan ongkir. Terima kasih! 🙏';

  return message;
}