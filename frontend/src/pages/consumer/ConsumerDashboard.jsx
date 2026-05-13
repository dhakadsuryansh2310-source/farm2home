import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import { Link } from 'react-router-dom';

const ConsumerDashboard = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders/myorders');
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'placed': return 'text-blue-500 bg-blue-50';
      case 'processing': return 'text-yellow-500 bg-yellow-50';
      case 'shipped': return 'text-purple-500 bg-purple-50';
      case 'delivered': return 'text-green-500 bg-green-50';
      case 'cancelled': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusStep = (status) => {
    switch(status) {
      case 'placed': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-light">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-dark">My Orders & Tracking</h1>
          <p className="text-gray-600 mt-2">Track your fresh produce deliveries in real-time.</p>
        </div>

        {orders.length === 0 ? (
          <div className="card p-12 flex flex-col items-center justify-center text-center">
            <Package className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-dark mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet. Explore the marketplace to find fresh produce!</p>
            <Link to="/marketplace" className="btn-primary">Browse Marketplace</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="card p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Order ID: <span className="font-mono text-gray-700">{order._id}</span></p>
                    <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4 md:mt-0 text-left md:text-right">
                    <p className="font-bold text-xl text-dark">₹{order.totalAmount}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(order.orderStatus)} capitalize`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Tracking Timeline */}
                {order.orderStatus !== 'cancelled' && (
                  <div className="relative mb-8 mt-4">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                      <div style={{ width: `${(getStatusStep(order.orderStatus) / 4) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-500"></div>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-gray-500">
                      <div className={`text-center flex flex-col items-center ${getStatusStep(order.orderStatus) >= 1 ? 'text-primary-600' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${getStatusStep(order.orderStatus) >= 1 ? 'bg-primary-100' : 'bg-gray-100'}`}>
                          <Package className="h-4 w-4" />
                        </div>
                        <span>Placed</span>
                      </div>
                      <div className={`text-center flex flex-col items-center ${getStatusStep(order.orderStatus) >= 2 ? 'text-primary-600' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${getStatusStep(order.orderStatus) >= 2 ? 'bg-primary-100' : 'bg-gray-100'}`}>
                          <Clock className="h-4 w-4" />
                        </div>
                        <span>Processing</span>
                      </div>
                      <div className={`text-center flex flex-col items-center ${getStatusStep(order.orderStatus) >= 3 ? 'text-primary-600' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${getStatusStep(order.orderStatus) >= 3 ? 'bg-primary-100' : 'bg-gray-100'}`}>
                          <Truck className="h-4 w-4" />
                        </div>
                        <span>Shipped</span>
                      </div>
                      <div className={`text-center flex flex-col items-center ${getStatusStep(order.orderStatus) >= 4 ? 'text-primary-600' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${getStatusStep(order.orderStatus) >= 4 ? 'bg-primary-100' : 'bg-gray-100'}`}>
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-dark mb-3 text-sm">Order Items</h4>
                  <div className="space-y-3">
                    {order.products.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded border border-gray-200 overflow-hidden flex-shrink-0">
                            {item.productId && item.productId.images && item.productId.images.length > 0 ? (
                                <img src={`http://localhost:5000${item.productId.images[0]}`} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center"><Package className="h-4 w-4 text-gray-400"/></div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{item.productId ? item.productId.name : 'Product Unavailable'}</p>
                            <p className="text-gray-500">{item.quantity} kg</p>
                          </div>
                        </div>
                        <p className="font-medium">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <Link to={`/messages/${order.farmerId}`} className="btn-secondary py-2 px-4 text-sm bg-white">
                    Contact Farmer
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ConsumerDashboard;
