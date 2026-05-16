import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const FarmerAnalytics = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/analytics/farmers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFarmers(res.data);
      } catch (error) {
        console.error("Error fetching farmers", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchFarmers();
  }, [token]);

  const filteredFarmers = farmers.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Farmer Analytics</h1>
          <p className="text-gray-500 mt-1">Monitor all registered farmers and their performance.</p>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search farmers..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-sm font-semibold text-gray-600">Farmer Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Email</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-center">Products Listed</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-center">Total Orders</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Revenue Generated</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </td>
                </tr>
              ) : filteredFarmers.length > 0 ? (
                filteredFarmers.map((farmer, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={farmer._id} 
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">{farmer.name}</td>
                    <td className="p-4 text-gray-600 text-sm">{farmer.email}</td>
                    <td className="p-4 text-center">
                      <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-bold">{farmer.totalProducts}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-purple-100 text-purple-700 py-1 px-3 rounded-full text-xs font-bold">{farmer.totalOrders}</span>
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-600">
                      ₹{farmer.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No farmers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FarmerAnalytics;
