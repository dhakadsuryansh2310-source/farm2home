import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, UserCog, Package, ShoppingBag, DollarSign, TrendingUp, PiggyBank, HeartHandshake } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import useAuthStore from '../../store/useAuthStore';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [consumers, setConsumers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const [statsRes, farmersRes, consumersRes, productsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/analytics/overview', config),
          axios.get('http://localhost:5000/api/analytics/farmers', config),
          axios.get('http://localhost:5000/api/analytics/consumers', config),
          axios.get('http://localhost:5000/api/products') // products is public
        ]);
        setStats(statsRes.data);
        
        // Sort to get top performers
        const sortedFarmers = farmersRes.data.sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5);
        const sortedConsumers = consumersRes.data.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
        
        setFarmers(sortedFarmers);
        setConsumers(sortedConsumers);
        setProducts(productsRes.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const overview = stats?.overview;
  const salesTrend = stats?.salesTrend || [];

  const statCards = [
    { title: 'Total Farmers', value: overview?.totalFarmers || 0, icon: UserCog, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12%' },
    { title: 'Total Consumers', value: overview?.totalConsumers || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100', trend: '+24%' },
    { title: 'Products Listed', value: overview?.totalProducts || 0, icon: Package, color: 'text-green-600', bg: 'bg-green-100', trend: '+8%' },
    { title: 'Total Orders', value: overview?.totalOrders || 0, icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-100', trend: '+18%' },
    { title: 'Total Revenue', value: `₹${(overview?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100', trend: '+32%' },
    { title: 'Platform Profit', value: `₹${(overview?.platformProfit || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-100', trend: '+15%' },
    { title: 'Farmer Profit', value: `₹${(overview?.farmerProfit || 0).toLocaleString()}`, icon: PiggyBank, color: 'text-teal-600', bg: 'bg-teal-100', trend: '+28%' },
    { title: 'Consumer Savings', value: `₹${(overview?.consumerSavings || 0).toLocaleString()}`, icon: HeartHandshake, color: 'text-rose-600', bg: 'bg-rose-100', trend: '+21%' },
  ];

  // Dummy data for User Distribution Pie Chart
  const userDistributionData = [
    { name: 'Farmers', value: overview?.totalFarmers || 0 },
    { name: 'Consumers', value: overview?.totalConsumers || 0 },
  ];
  const COLORS = ['#10B981', '#6366F1'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Platform Overview</h1>
          <p className="text-gray-500 mt-1">Real-time statistics and insights across the marketplace.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={idx} 
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-500 font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {card.trend}
                </span>
                <span className="text-gray-400 ml-2">vs last month</span>
              </div>
              {/* Decorative background glow */}
              <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ${card.bg}`}></div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Sales vs Market Value (Last 6 Months)</h3>
            <select className="text-sm border-gray-200 rounded-lg text-gray-600 focus:ring-primary-500 focus:border-primary-500 bg-gray-50">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value, name) => [`₹${value.toLocaleString()}`, name === 'marketValue' ? 'Market Value' : 'Revenue (Sale Price)']}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" dataKey="marketValue" name="Market Value" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorMarket)" />
                <Area type="monotone" dataKey="revenue" name="Revenue (Sale Price)" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">User Distribution</h3>
          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-gray-900">{overview?.totalFarmers + overview?.totalConsumers}</span>
              <span className="text-xs text-gray-500">Total Users</span>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            {userDistributionData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span className="text-gray-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Farmers and Consumers Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Top Performing Farmers</h3>
            <span className="text-sm text-primary-600 font-medium cursor-pointer">View All</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="p-4 text-sm font-semibold text-gray-600">Farmer Name</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {farmers.length > 0 ? (
                  farmers.map((farmer, idx) => (
                    <tr key={farmer._id || idx} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{farmer.name}</td>
                      <td className="p-4 text-right font-bold text-emerald-600">
                        ₹{farmer.totalRevenue?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="p-4 text-center text-gray-500 text-sm">No farmers data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Top Consumers</h3>
            <span className="text-sm text-primary-600 font-medium cursor-pointer">View All</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="p-4 text-sm font-semibold text-gray-600">Consumer Name</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-right">Amount Spent</th>
                </tr>
              </thead>
              <tbody>
                {consumers.length > 0 ? (
                  consumers.map((consumer, idx) => (
                    <tr key={consumer._id || idx} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{consumer.name}</td>
                      <td className="p-4 text-right font-bold text-rose-600">
                        ₹{consumer.totalSpent?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="p-4 text-center text-gray-500 text-sm">No consumers data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Latest Products */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Latest Products</h3>
          <span className="text-sm text-primary-600 font-medium cursor-pointer">View All</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="p-4 text-sm font-semibold text-gray-600">Product Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Price</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, idx) => (
                  <tr key={product._id || idx} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{product.name}</td>
                    <td className="p-4 text-gray-600 text-sm capitalize">{product.category}</td>
                    <td className="p-4 text-gray-900 font-bold">₹{product.price}</td>
                    <td className="p-4 text-right text-gray-600">{product.stock} kg</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500 text-sm">No products data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
