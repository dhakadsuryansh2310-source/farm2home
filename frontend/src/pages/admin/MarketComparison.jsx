import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TrendingDown, Scale, IndianRupee, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import useAuthStore from '../../store/useAuthStore';

const MarketComparison = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products for market comparison", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProducts();
  }, [token]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Aggregate stats
  const totalMarketValue = products.reduce((acc, p) => acc + ((p.marketPrice || (p.price * 1.2)) * p.stock), 0);
  const totalPlatformValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const totalSavings = totalMarketValue - totalPlatformValue;
  const averageSavingsPercent = totalMarketValue > 0 ? ((totalSavings / totalMarketValue) * 100).toFixed(1) : 0;

  // Chart data (top 10 products by stock)
  const chartData = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 10)
    .map(p => ({
      name: p.name,
      'Market Price': p.marketPrice || Math.round(p.price * 1.2),
      'Platform Price': p.price,
    }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Market Comparison</h1>
          <p className="text-gray-500 mt-1">Analyze platform prices against traditional offline markets.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Market Value</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{totalMarketValue.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Scale className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Estimated retail value of all active inventory</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Platform Value</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{totalPlatformValue.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Total selling price on platform</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Consumer Savings</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{totalSavings.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-4 font-medium flex items-center">
            <TrendingDown className="w-4 h-4 mr-1" />
            {averageSavingsPercent}% cheaper than market
          </p>
        </motion.div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Price Comparison (Top 10 Inventory)</h3>
        {loading ? (
          <div className="flex justify-center items-center h-[350px]">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <RechartsTooltip cursor={{fill: '#F3F4F6'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Legend iconType="circle" />
                <Bar dataKey="Market Price" fill="#94A3B8" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="Platform Price" fill="#10B981" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <h3 className="text-lg font-bold text-gray-900">Detailed Product Comparison</h3>
           <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm w-48 sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="p-4 text-sm font-semibold text-gray-600">Product Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Market Price</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Platform Price</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Difference</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, idx) => {
                  const mPrice = product.marketPrice || Math.round(product.price * 1.2);
                  const savings = mPrice - product.price;
                  const savingsPercent = ((savings / mPrice) * 100).toFixed(0);
                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={product._id} 
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-900">{product.name}</td>
                      <td className="p-4 text-gray-600 text-sm capitalize">{product.category}</td>
                      <td className="p-4 text-right text-gray-500">₹{mPrice.toLocaleString()}</td>
                      <td className="p-4 text-right font-bold text-gray-900">₹{product.price.toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-xs font-bold">
                          -₹{savings.toLocaleString()} (-{savingsPercent}%)
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default MarketComparison;
