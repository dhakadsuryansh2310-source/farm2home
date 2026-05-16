import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, ShoppingCart, User as UserIcon, LogOut, Bell, Globe, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showNotifications, setShowNotifications] = useState(false);

  const cartItemCount = cart?.products?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const notifications = [
    { id: 1, text: t('notif_order_received', { id: '1024' }) },
    { id: 2, text: t('notif_message', { name: 'Rahul' }) }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl tracking-tight text-dark">{t('nav_farm2table')}</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/marketplace" className="text-gray-600 hover:text-primary-600 font-medium">
              {t('nav_marketplace')}
            </Link>

            {user?.role !== 'farmer' && (
              <Link to="/cart" className="text-gray-600 hover:text-primary-600 relative ml-2 mr-2">
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            <button onClick={toggleLanguage} className="text-gray-600 hover:text-primary-600 ml-2 mr-2 flex items-center gap-1 font-medium" title="Toggle Language">
              <Globe className="h-5 w-5" />
              <span className="text-sm uppercase">{i18n.language || 'en'}</span>
            </button>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <Link to="/admin" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                    Universal Dashboard
                  </Link>
                ) : user?.role === 'farmer' ? (
                  <Link to="/farmer/dashboard" className="text-gray-600 hover:text-primary-600 font-medium">
                    {t('nav_dashboard')}
                  </Link>
                ) : (
                  <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 font-medium">
                    Dashboard
                  </Link>
                )}

                <Link to="/messages" className="text-gray-600 hover:text-primary-600 relative ml-2 mr-2">
                  <MessageSquare className="h-6 w-6" />
                </Link>

                <div className="relative ml-2 mr-2">
                  <button onClick={() => setShowNotifications(!showNotifications)} className="text-gray-600 hover:text-primary-600 relative">
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">2</span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <span className="font-medium text-sm text-gray-900">{t('nav_notifications')}</span>
                      </div>
                      {notifications.length > 0 ? notifications.map(n => (
                        <div key={n.id} className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer">
                          {n.text}
                        </div>
                      )) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">{t('notif_empty')}</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative group ml-4 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('nav_profile')}</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      {t('nav_signout')}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium px-3 py-2">
                  {t('nav_login')}
                </Link>
                <Link to="/register" className="btn-primary">
                  {t('nav_signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
