import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const { user } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 py-2 md:py-0 md:pb-1 font-medium transition-colors duration-200 ${isActive
      ? 'text-teal-600 md:border-b-2 md:border-teal-500'
      : 'text-gray-600 hover:text-teal-500'
    }`;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, #03BEB0 0%, #065D5F 100%)' }}
            >
              <span className="text-white font-black text-lg">MJ</span>
            </div>
            <span className="text-xl font-bold hidden sm:block" style={{ color: '#065D5F' }}>
              MJ Kitchen
            </span>
          </Link>

          {/* Desktop Nav - Centered/Right aligned */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass}>
              <span className="material-symbols-outlined text-[18px]">home</span>
              Beranda
            </NavLink>
            <NavLink to="/menu" className={navLinkClass}>
              <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
              Menu
            </NavLink>
            {user && (
              <NavLink to="/orders" className={navLinkClass}>
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                Pesanan
              </NavLink>
            )}
            <NavLink to="/cart" className="relative">
              <div className="flex items-center gap-1.5 text-gray-600 hover:text-teal-500 transition-colors font-medium">
                <div className="relative">
                  <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                  {itemCount > 0 && (
                    <span
                      className="absolute -top-2 -right-2 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold px-1"
                      style={{ backgroundColor: '#03BEB0' }}
                    >
                      {itemCount}
                    </span>
                  )}
                </div>
                Keranjang
              </div>
            </NavLink>
          </nav>

          {/* Desktop Auth - Far right */}
          <div className="hidden md:flex items-center">
            {user ? (
              <NavLink
                to="/profile"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-teal-50"
                style={{ color: '#03BEB0' }}
              >
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
                Profil
              </NavLink>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-md"
                style={{ backgroundColor: '#03BEB0' }}
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile: Cart & Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <NavLink to="/cart" className="relative p-2 text-gray-600 hover:text-teal-500 transition-colors">
              <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
              {itemCount > 0 && (
                <span
                  className="absolute top-0 right-0 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold px-1"
                  style={{ backgroundColor: '#03BEB0' }}
                >
                  {itemCount}
                </span>
              )}
            </NavLink>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[400px] pb-4' : 'max-h-0'
            }`}
        >
          <nav className="flex flex-col space-y-1 border-t border-gray-100 pt-4">
            <NavLink to="/" className={navLinkClass} onClick={closeMenu}>
              <span className="material-symbols-outlined text-[18px]">home</span>
              Beranda
            </NavLink>
            <NavLink to="/menu" className={navLinkClass} onClick={closeMenu}>
              <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
              Menu
            </NavLink>
            <NavLink to="/cart" className={navLinkClass} onClick={closeMenu}>
              <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
              Keranjang {itemCount > 0 && <span className="ml-1 text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#03BEB0' }}>{itemCount}</span>}
            </NavLink>
            {user ? (
              <>
                <NavLink to="/orders" className={navLinkClass} onClick={closeMenu}>
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  Pesanan Saya
                </NavLink>
                <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>
                  <span className="material-symbols-outlined text-[18px]">account_circle</span>
                  Profil
                </NavLink>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 py-2 font-semibold"
                style={{ color: '#03BEB0' }}
                onClick={closeMenu}
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                Masuk / Daftar
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}