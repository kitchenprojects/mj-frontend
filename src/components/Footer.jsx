import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} MJ Kitchen. All rights reserved.
        </p>
      </div>
    </footer>
  );
}