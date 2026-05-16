import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import Marketplace from './pages/consumer/Marketplace';
import Cart from './pages/consumer/Cart';
import ProductDetails from './pages/consumer/ProductDetails';
import ConsumerDashboard from './pages/consumer/ConsumerDashboard';
import Inbox from './pages/messages/Inbox';
import Profile from './pages/profile/Profile';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import FarmerAnalytics from './pages/admin/FarmerAnalytics';
import ConsumerAnalytics from './pages/admin/ConsumerAnalytics';
import OrdersInsights from './pages/admin/OrdersInsights';
import MarketComparison from './pages/admin/MarketComparison';
import ProfitReports from './pages/admin/ProfitReports';
import useAuthStore from './store/useAuthStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-light">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute allowedRoles={['consumer', 'admin']}>
                  <Cart />
                </ProtectedRoute>
              } 
            />
            
            {/* Farmer Routes */}
            <Route 
              path="/farmer/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                  <FarmerDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      {/* Phase 2 routes */}
                      <Route path="/farmers" element={<FarmerAnalytics />} />
                      <Route path="/consumers" element={<ConsumerAnalytics />} />
                      <Route path="/orders" element={<OrdersInsights />} />
                      <Route path="/market" element={<MarketComparison />} />
                      <Route path="/reports" element={<ProfitReports />} />
                      <Route path="/settings" element={<div className="p-8 text-center">Settings coming soon</div>} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />

            {/* Consumer Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['consumer', 'admin']}>
                  <ConsumerDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Messages Routes */}
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <Inbox />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages/:userId" 
              element={
                <ProtectedRoute>
                  <Inbox />
                </ProtectedRoute>
              } 
            />

            {/* Profile Route */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
