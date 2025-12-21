// client/src/components/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  FiGrid,
  FiClipboard,
  FiShoppingCart,
  FiChevronsLeft,
  FiChevronsRight,
  FiUsers,
  FiTag,
  FiFileText,
  FiPlusSquare,
  FiMenu,
  FiX
} from 'react-icons/fi';

/**
 * A custom NavLink component to handle the collapsed state
 */
function AdminNavLink({ to, icon: Icon, label, isExpanded, onClick }) {
  const navLinkClass = ({ isActive }) =>
    `flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 ${isActive ? 'bg-emerald-100 text-emerald-700 font-semibold' : ''
    } transition-colors duration-200`;

  return (
    <NavLink to={to} end className={navLinkClass} onClick={onClick}>
      <Icon size={22} className="flex-shrink-0" />
      <span
        className={`ml-4 overflow-hidden whitespace-nowrap transition-all duration-200 ${isExpanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0 md:max-w-0 md:opacity-0'
          }`}
      >
        {label}
      </span>
    </NavLink>
  );
}

/**
 * The main Admin Layout with a responsive sidebar
 */
export default function AdminLayout() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobile = () => setIsMobileOpen(false);

  const navItems = [
    { to: '/admin', icon: FiGrid, label: 'Dashboard' },
    { to: '/admin/menu', icon: FiClipboard, label: 'Menu' },
    { to: '/admin/categories', icon: FiTag, label: 'Categories' },
    { to: '/admin/addons', icon: FiPlusSquare, label: 'Add-ons' },
    { to: '/admin/orders', icon: FiShoppingCart, label: 'Orders' },
    { to: '/admin/profiles', icon: FiUsers, label: 'Profiles' },
    { to: '/admin/reports', icon: FiFileText, label: 'Reports' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-40 flex items-center justify-between px-4">
        <Link to="/admin" className="text-xl font-bold text-emerald-600">
          MJ Admin
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          aria-label="Open menu"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white shadow-xl z-50 flex flex-col transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${isExpanded ? 'w-64' : 'md:w-20'}
          w-64
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 md:h-16 border-b px-4">
          <Link
            to="/admin"
            className="text-xl md:text-2xl font-bold text-emerald-600 overflow-hidden whitespace-nowrap"
          >
            {isExpanded ? 'MJ Admin' : 'MJ'}
          </Link>
          <button
            onClick={closeMobile}
            className="md:hidden p-2 text-gray-400 hover:text-gray-600"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <AdminNavLink
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isExpanded={isExpanded}
              onClick={closeMobile}
            />
          ))}
        </nav>

        {/* Toggle Button (Desktop only) */}
        <div className="hidden md:block p-4 border-t">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? <FiChevronsLeft size={22} /> : <FiChevronsRight size={22} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`
          flex-grow transition-all duration-300 ease-in-out
          pt-14 md:pt-0
          ${isExpanded ? 'md:ml-64' : 'md:ml-20'}
          p-4 md:p-6
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}