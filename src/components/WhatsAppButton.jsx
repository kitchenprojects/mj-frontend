import React, { useState } from 'react';

/**
 * Floating WhatsApp button with mascot-style hover
 */
export default function WhatsAppButton({ phoneNumber = '6288970788847' }) {
  const [isHovered, setIsHovered] = useState(false);

  const message = encodeURIComponent('Halo Dapur Nekti! Saya ingin bertanya tentang menu...');
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
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
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