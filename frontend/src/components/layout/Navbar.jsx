import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();

  const cartItemCount = cart?.products?.reduce((acc, item) => acc + item.quantity, 0) || 0;

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
              <span className="font-bold text-xl tracking-tight text-dark">Farm2Table</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/marketplace" className="text-gray-600 hover:text-primary-600 font-medium">
              Marketplace
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
            
            {isAuthenticated ? (
              <>
                {user?.role === 'farmer' && (
                  <Link to="/farmer/dashboard" className="text-gray-600 hover:text-primary-600 font-medium">
                    Dashboard
                  </Link>
                )}

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
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium px-3 py-2">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign up
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
