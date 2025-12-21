import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaShoppingCart } from 'react-icons/fa';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  const navLinkClass = ({ isActive }) =>
    `block py-2 md:py-0 md:pb-1 font-medium transition-colors duration-200 ${isActive
      ? 'text-teal-500 md:border-b-2 md:border-teal-500'
      : 'text-gray-700 hover:text-teal-500'
    }`;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 md:py-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #03BEB0 0%, #02A99C 100%)' }}
            >
              <span className="text-white font-bold text-lg">MJ</span>
            </div>
            <span className="text-xl font-bold hidden sm:block" style={{ color: '#065D5F' }}>MJ Kitchen</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClass}>
              Beranda
            </NavLink>
            <NavLink to="/menu" className={navLinkClass}>
              Menu
            </NavLink>
            {user && (
              <NavLink to="/orders" className={navLinkClass}>
                Pesanan
              </NavLink>
            )}
            <NavLink to="/cart" className="relative">
              <div className="flex items-center gap-2 text-gray-700 hover:text-teal-500 transition-colors">
                <div className="relative">
                  <FaShoppingCart size={20} />
                  {itemCount > 0 && (
                    <span
                      className="absolute -top-2 -right-2 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold"
                      style={{ backgroundColor: '#03BEB0' }}
                    >
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="font-medium">Keranjang</span>
              </div>
            </NavLink>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <NavLink to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-teal-500">
                  <FiUser size={18} />
                  <span className="font-medium">Profil</span>
                </NavLink>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-gray-500 hover:text-red-500 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                style={{ backgroundColor: '#03BEB0' }}
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile: Cart & Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <NavLink to="/cart" className="relative text-gray-700">
              <FaShoppingCart size={22} />
              {itemCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold"
                  style={{ backgroundColor: '#03BEB0' }}
                >
                  {itemCount}
                </span>
              )}
            </NavLink>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'
            }`}
        >
          <nav className="flex flex-col space-y-1 border-t pt-4">
            <NavLink to="/" className={navLinkClass} onClick={closeMenu}>
              Beranda
            </NavLink>
            <NavLink to="/menu" className={navLinkClass} onClick={closeMenu}>
              Menu
            </NavLink>
            <NavLink to="/cart" className={navLinkClass} onClick={closeMenu}>
              Keranjang {itemCount > 0 && `(${itemCount})`}
            </NavLink>
            {user ? (
              <>
                <NavLink to="/orders" className={navLinkClass} onClick={closeMenu}>
                  Pesanan Saya
                </NavLink>
                <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>
                  Profil
                </NavLink>
                <button
                  onClick={() => { logout(); closeMenu(); }}
                  className="text-left py-2 text-red-500 hover:text-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-block py-2 font-semibold"
                style={{ color: '#03BEB0' }}
                onClick={closeMenu}
              >
                Masuk / Daftar
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}