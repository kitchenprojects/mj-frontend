import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';

export default function MenuItem({ item, onAdd, onCustomize }) {
  const firstImage = Array.isArray(item.images) && item.images[0]?.image_url;
  const displayImage = firstImage || item.image_url;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-teal-200 flex flex-col group">
      {/* Image */}
      <div className="relative overflow-hidden">
        {displayImage ? (
          <img
            src={displayImage}
            alt={item.menu_name}
            className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-40 md:h-48 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #E6F7F6 0%, #F0F7F7 100%)' }}
          >
            <span className="text-4xl">🍱</span>
          </div>
        )}
        {/* Quick add overlay on mobile */}
        <button
          onClick={() => onAdd?.(item)}
          className="md:hidden absolute bottom-2 right-2 w-10 h-10 text-white rounded-full flex items-center justify-center shadow-lg hover:opacity-90"
          style={{ backgroundColor: '#03BEB0' }}
        >
          <FaPlus size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base md:text-lg font-semibold mb-1 line-clamp-2" style={{ color: '#065D5F' }}>
          {item.menu_name}
        </h3>
        <p className="text-xs md:text-sm text-gray-400 mb-3 flex-grow line-clamp-2">
          {item.description || 'Menu lezat siap dipesan'}
        </p>

        {/* Price */}
        <div className="mb-3">
          <span className="text-lg md:text-xl font-bold" style={{ color: '#03BEB0' }}>
            Rp {Number(item.price).toLocaleString()}
          </span>
        </div>

        {/* Buttons - Desktop */}
        <div className="hidden md:flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#03BEB0' }}
            onClick={() => onAdd?.(item)}
          >
            <FaPlus size={12} />
            <span>Tambah</span>
          </button>

          {onCustomize && (
            <button
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 border-2 font-semibold rounded-xl text-sm hover:bg-teal-50 transition-colors"
              style={{ borderColor: '#03BEB0', color: '#03BEB0' }}
              onClick={() => onCustomize?.(item)}
            >
              <FiEdit2 size={14} />
              <span>Custom</span>
            </button>
          )}
        </div>

        {/* Mobile - Custom button only */}
        {onCustomize && (
          <button
            className="md:hidden flex items-center justify-center gap-1.5 px-3 py-2 border-2 font-medium rounded-xl text-sm hover:bg-teal-50 transition-colors"
            style={{ borderColor: '#03BEB0', color: '#03BEB0' }}
            onClick={() => onCustomize?.(item)}
          >
            <FiEdit2 size={14} />
            <span>Custom Order</span>
          </button>
        )}
      </div>
    </div>
  );
}