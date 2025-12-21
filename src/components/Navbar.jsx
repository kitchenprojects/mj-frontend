import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaShoppingCart } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  const navLinkClass = ({ isActive }) =>
    `block py-2 md:py-0 md:pb-1 ${isActive
      ? 'text-emerald-600 font-semibold md:border-b-2 md:border-emerald-600'
      : 'text-gray-600 hover:text-emerald-600'
    } transition-colors duration-200`;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 md:py-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold text-gray-800">
            MJ Kitchen
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <NavLink to="/menu" className={navLinkClass}>
              Menu
            </NavLink>
            <NavLink to="/cart" className={navLinkClass}>
              <div className="flex items-center gap-1.5">
                <FaShoppingCart />
                <span>Cart</span>
                {itemCount > 0 && (
                  <span className="bg-emerald-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
            </NavLink>
            {user ? (
              <>
                <NavLink to="/orders" className={navLinkClass}>
                  My Orders
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  My Profile
                </NavLink>
                <button
                  onClick={logout}
                  className="ml-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="ml-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-all"
              >
                Login
              </NavLink>
            )}
          </nav>

          {/* Mobile: Cart & Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <NavLink to="/cart" className="relative text-gray-700">
              <FaShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
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
            <NavLink to="/menu" className={navLinkClass} onClick={closeMenu}>
              Menu
            </NavLink>
            <NavLink to="/cart" className={navLinkClass} onClick={closeMenu}>
              Cart {itemCount > 0 && `(${itemCount})`}
            </NavLink>
            {user ? (
              <>
                <NavLink to="/orders" className={navLinkClass} onClick={closeMenu}>
                  My Orders
                </NavLink>
                <NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>
                  My Profile
                </NavLink>
                <button
                  onClick={() => { logout(); closeMenu(); }}
                  className="text-left py-2 text-red-500 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="block py-2 text-emerald-600 font-semibold"
                onClick={closeMenu}
              >
                Login
              </NavLink>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}