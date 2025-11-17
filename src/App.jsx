import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import { useAuthStore } from './store/authStore';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminAddressPage from './pages/admin/AdminAddressPage'; 
import ProfilePage from './pages/ProfilePage';
import AdminCategoryPage from './pages/admin/AdminCategoryPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';

// Private Route
const PrivateRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Admin Route
const AdminRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  const profile = useAuthStore((s) => s.profile);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    // Wait until profile is fetched
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (profile?.role !== 'admin') {
    // Logged in, but NOT an admin
    return <Navigate to="/" replace />;
  }

  // Logged in AND is an admin
  return children;
};

function App() {
  const init = useAuthStore((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<PrivateRoute><OrderTrackingPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        </Route>

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="menu" element={<AdminMenuPage />} />
          <Route path="categories" element={<AdminCategoryPage />} />
          <Route path="menu/:menuId/gallery" element={<AdminGalleryPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="profiles" element={<AdminProfilePage />} />
          <Route path="profiles/:userId/addresses" element={<AdminAddressPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;