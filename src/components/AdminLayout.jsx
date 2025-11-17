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
  FiTag
} from 'react-icons/fi';

/**
 * A custom NavLink component to handle the collapsed state
 */
function AdminNavLink({ to, icon: Icon, label, isExpanded }) {
  // ... (no changes to this helper component)
  const navLinkClass = ({ isActive }) =>
    `flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 ${
      isActive ? 'bg-emerald-100 text-emerald-700 font-semibold' : ''
    } transition-colors duration-200`;

  return (
    <NavLink to={to} end className={navLinkClass}>
      <Icon size={22} className="flex-shrink-0" />
      <span 
        className={`ml-4 overflow-hidden whitespace-nowrap transition-all duration-200 ${
          isExpanded ? 'max-w-xs' : 'max-w-0'
        }`}
      >
        {label}
      </span>
    </NavLink>
  );
}

/**
 * The main Admin Layout with a retractable sidebar
 */
export default function AdminLayout() {
  // ... (no changes to state)
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- Sidebar --- */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-white shadow-xl z-50 flex flex-col transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-20'
        }`}
      >
        {/* ... (no changes to Logo/Header) */}
        <div className="flex items-center justify-center h-16 border-b p-4">
          <Link 
            to="/admin" 
            className="text-2xl font-bold text-emerald-600 overflow-hidden whitespace-nowrap transition-all"
          >
            {isExpanded ? 'MJ Admin' : 'MJ'}
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-grow p-4 space-y-2">
          <AdminNavLink 
            to="/admin" 
            icon={FiGrid} 
            label="Dashboard" 
            isExpanded={isExpanded} 
          />
          <AdminNavLink 
            to="/admin/menu" 
            icon={FiClipboard} 
            label="Menu" 
            isExpanded={isExpanded} 
          />
          <AdminNavLink 
            to="/admin/categories" 
            icon={FiTag} 
            label="Categories" 
            isExpanded={isExpanded} 
          />
          <AdminNavLink 
            to="/admin/orders" 
            icon={FiShoppingCart} 
            label="Orders" 
            isExpanded={isExpanded} 
          />
          {/* ✨ ADD THIS NEW NAV LINK */}
          <AdminNavLink 
            to="/admin/profiles" 
            icon={FiUsers} 
            label="Profiles" 
            isExpanded={isExpanded} 
          />
        </nav>

        {/* ... (no changes to Toggle Button) */}
        <div className="p-4 border-t">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? <FiChevronsLeft size={22} /> : <FiChevronsRight size={22} />}
          </button>
        </div>
      </aside>

      {/* ... (no changes to Main Content) */}
      <main 
        className={`flex-grow p-4 md:p-6 transition-all duration-300 ease-in-out ${
          isExpanded ? 'ml-64' : 'ml-20'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}