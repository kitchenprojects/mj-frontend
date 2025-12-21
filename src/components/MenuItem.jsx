import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';

export default function MenuItem({ item, onAdd, onCustomize }) {
  // Use the image from your SQL schema 'menu.image_url' or 'gallery'
  const firstImage = Array.isArray(item.images) && item.images[0]?.image_url;
  const displayImage = firstImage || item.image_url;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col">
      {displayImage ? (
        <img src={displayImage} alt={item.menu_name} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No Image
        </div>
      )}

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.menu_name}</h3>
        <p className="text-sm text-gray-500 mb-4 flex-grow">
          {item.description || 'No description available.'}
        </p>

        {/* Price and Buttons */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-emerald-600">
              Rp {Number(item.price).toLocaleString()}
            </span>
          </div>

          <div className="flex gap-2">
            {/* Quick Add Button */}
            <button
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white font-semibold rounded-md text-sm hover:bg-emerald-700 transition-colors"
              onClick={() => onAdd?.(item)}
              aria-label={`Add ${item.menu_name} to cart`}
            >
              <FaPlus size={12} />
              <span>Add</span>
            </button>

            {/* Customize Button */}
            {onCustomize && (
              <button
                className="flex items-center justify-center gap-1.5 px-3 py-2 border border-emerald-600 text-emerald-600 font-semibold rounded-md text-sm hover:bg-emerald-50 transition-colors"
                onClick={() => onCustomize?.(item)}
                aria-label={`Customize ${item.menu_name}`}
              >
                <FiEdit2 size={14} />
                <span>Custom</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}