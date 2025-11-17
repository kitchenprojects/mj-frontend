import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaShoppingCart } from 'react-icons/fa'; // Import an icon

export default function Navbar() {
  const { user, logout } = useAuthStore();

  // This function allows us to conditionally style the active NavLink
  const navLinkClass = ({ isActive }) =>
    `pb-1 ${
      isActive
        ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600'
        : 'text-gray-600 hover:text-emerald-600'
    } transition-colors duration-200`;

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          MJ Kitchen
        </Link>
        <nav className="flex items-center space-x-6 text-sm">
          <NavLink to="/menu" className={navLinkClass}>
            Menu
          </NavLink>
          <NavLink to="/cart" className={navLinkClass}>
            <div className="flex items-center gap-1.5">
              <FaShoppingCart />
              <span>Cart</span>
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
                className="ml-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="ml-2 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-all duration-200"
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </div>
  );
}