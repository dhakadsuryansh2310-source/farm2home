import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { IndianRupee, PieChart as PieChartIcon, Search, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import useAuthStore from '../../store/useAuthStore';

const ProfitReports = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data.filter(o => o.paymentStatus === 'completed'));
      } catch (error) {
        console.error("Error fetching orders for profit reports", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.farmerId?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Aggregate stats
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const platformProfit = totalRevenue * 0.05;
  const farmerPayouts = totalRevenue * 0.95;

  // Group by Date for Chart
  const monthlyDataMap = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  orders.forEach(order => {
    const d = new Date(order.createdAt);
    const monthName = monthNames[d.getMonth()];
    
    if (!monthlyDataMap[monthName]) {
      monthlyDataMap[monthName] = { name: monthName, profit: 0, sortIdx: d.getMonth() };
    }
    
    monthlyDataMap[monthName].profit += (order.totalAmount * 0.05);
  });

  const chartData = Object.values(monthlyDataMap).sort((a, b) => {
    const currentMonth = new Date().getMonth();
    const aIdx = a.sortIdx > currentMonth ? a.sortIdx - 12 : a.sortIdx;
    const bIdx = b.sortIdx > currentMonth ? b.sortIdx - 12 : b.sortIdx;
    return aIdx - bIdx;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profit Reports</h1>
          <p className="text-gray-500 mt-1">Detailed breakdown of platform commissions and farmer payouts.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Transaction Volume</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group border-l-4 border-l-indigo-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Platform Revenue (5%)</p>
              <h3 className="text-2xl font-bold text-indigo-700">₹{platformProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
              <PieChartIcon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Farmer Payouts (95%)</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{farmerPayouts.toLocaleString(undefined, { maximumFractionDigits: 2 })}</h3>
            </div>
            <div className="p-3 rounded-xl bg-teal-100 text-teal-600">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Platform Profit Trend</h3>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`₹${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 'Platform Profit']}
                />
                <Area type="monotone" dataKey="profit" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <h3 className="text-lg font-bold text-gray-900">Transaction Ledger</h3>
           <div className="relative">
            <input 
              type="text" 
              placeholder="Search Order ID or Farmer..." 
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
                <th className="p-4 text-sm font-semibold text-gray-600">Order ID & Date</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Farmer</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Total Amount</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Farmer Payout (95%)</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Platform Fee (5%)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => {
                  const fee = order.totalAmount * 0.05;
                  const payout = order.totalAmount * 0.95;
                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={order._id} 
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="text-sm font-bold text-gray-900">#{order._id.substring(order._id.length - 6).toUpperCase()}</div>
                        <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4 text-gray-700 text-sm">{order.farmerId?.name || 'Unknown'}</td>
                      <td className="p-4 text-right font-medium text-gray-900">₹{order.totalAmount.toLocaleString()}</td>
                      <td className="p-4 text-right text-gray-600">₹{payout.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td className="p-4 text-right font-bold text-indigo-600">+₹{fee.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No completed orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ProfitReports;
