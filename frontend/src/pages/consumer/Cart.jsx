import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';

const Cart = () => {
  const { cart, setCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cart');
        setCart(res.data);
      } catch (error) {
        console.error("Error fetching cart", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [setCart]);

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete('http://localhost:5000/api/cart/remove', {
        data: { productId }
      });
      setCart(res.data);
    } catch (error) {
      console.error("Error removing from cart", error);
    }
  };

  const handleCheckout = () => {
    // In a real app, this would redirect to Razorpay/Stripe checkout.
    // For now, we'll just alert and clear cart or redirect to a simple success page.
    alert("Proceeding to checkout with Razorpay...");
    // navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-light">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!cart || !cart.products) return 0;
    return cart.products.reduce((acc, item) => {
      return acc + (item.productId?.price || 0) * item.quantity;
    }, 0);
  };

  return (
    <div className="bg-light min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark mb-8 flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary-600" /> Your Cart
        </h1>

        {!cart || !cart.products || cart.products.length === 0 ? (
          <div className="card p-12 text-center max-w-2xl mx-auto">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any fresh farm produce yet.</p>
            <Link to="/marketplace" className="btn-primary inline-flex items-center gap-2">
              Browse Marketplace <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.products.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={item._id} 
                  className="card p-4 flex flex-col sm:flex-row items-center gap-4"
                >
                  <img 
                    src={item.productId?.images && item.productId.images.length > 0 ? `http://localhost:5000${item.productId.images[0]}` : 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&w=150&q=80'} 
                    alt={item.productId?.name} 
                    className="w-24 h-24 rounded-lg object-cover bg-gray-100"
                  />
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="font-bold text-lg">{item.productId?.name}</h3>
                    <p className="text-gray-500 text-sm">{item.productId?.category}</p>
                    <div className="mt-2 text-primary-600 font-semibold">
                      ₹{item.productId?.price} / kg
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg font-medium">
                      Qty: {item.quantity} kg
                    </div>
                    <button 
                      onClick={() => handleRemove(item.productId?._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h3 className="font-bold text-xl mb-4 border-b border-gray-100 pb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="text-green-600">Free</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary-600">₹{calculateTotal()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full btn-primary py-3 flex justify-center items-center gap-2 text-lg"
                >
                  Buy Now <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
