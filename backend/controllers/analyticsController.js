const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get dashboard overview stats
// @route   GET /api/analytics/overview
// @access  Private/Admin
const getOverviewStats = async (req, res, next) => {
  try {
    // 1. User Stats
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalConsumers = await User.countDocuments({ role: 'consumer' });

    // 2. Product Stats
    const totalProducts = await Product.countDocuments();

    // 3. Order Stats
    const totalOrders = await Order.countDocuments();
    
    // Revenue & Profit Aggregation
    const completedOrders = await Order.find({ paymentStatus: 'completed' });
    
    let totalRevenue = 0;
    let totalMarketValue = 0;
    let totalSaleValueOfProducts = 0;

    completedOrders.forEach(order => {
      totalRevenue += order.totalAmount;
      order.products.forEach(p => {
        const mPrice = p.marketPrice || (p.price * 1.2);
        totalMarketValue += (mPrice * p.quantity);
        totalSaleValueOfProducts += (p.price * p.quantity);
      });
    });
    
    // For MVP Platform Profit, we assume a 5% commission on total revenue
    const platformProfit = totalRevenue * 0.05;
    const farmerProfit = totalRevenue * 0.95;

    // Real Savings Calculation
    const consumerSavings = totalMarketValue - totalSaleValueOfProducts;

    // Last 6 months sales data for chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentOrders = await Order.find({ 
      createdAt: { $gte: sixMonthsAgo }, 
      paymentStatus: 'completed' 
    }).sort({ createdAt: 1 });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyDataMap = {};

    recentOrders.forEach(order => {
      const monthIdx = order.createdAt.getMonth();
      const monthName = monthNames[monthIdx];

      if (!monthlyDataMap[monthName]) {
        monthlyDataMap[monthName] = { name: monthName, revenue: 0, marketValue: 0, orders: 0, sortIdx: monthIdx };
      }

      monthlyDataMap[monthName].orders += 1;
      monthlyDataMap[monthName].revenue += order.totalAmount;

      let mValue = 0;
      order.products.forEach(p => {
        const mPrice = p.marketPrice || (p.price * 1.2);
        mValue += (mPrice * p.quantity);
      });
      monthlyDataMap[monthName].marketValue += mValue;
    });

    const formattedSalesTrend = Object.values(monthlyDataMap).sort((a, b) => {
       // A simple sort to keep chronological order based on the past 6 months
       // If current month is May (4), and we have Dec (11), Dec should come before May.
       const currentMonth = new Date().getMonth();
       const aIdx = a.sortIdx > currentMonth ? a.sortIdx - 12 : a.sortIdx;
       const bIdx = b.sortIdx > currentMonth ? b.sortIdx - 12 : b.sortIdx;
       return aIdx - bIdx;
    }).map(({ name, revenue, marketValue, orders }) => ({ name, revenue, marketValue, orders }));

    res.json({
      overview: {
        totalFarmers,
        totalConsumers,
        totalProducts,
        totalOrders,
        totalRevenue,
        platformProfit,
        farmerProfit,
        consumerSavings
      },
      salesTrend: formattedSalesTrend
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get farmer analytics
// @route   GET /api/analytics/farmers
// @access  Private/Admin
const getFarmerAnalytics = async (req, res, next) => {
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password');
    const farmerStats = await Promise.all(farmers.map(async (farmer) => {
      const products = await Product.countDocuments({ farmerId: farmer._id });
      const orders = await Order.find({ farmerId: farmer._id, paymentStatus: 'completed' });
      
      const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
      
      return {
        _id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        phone: farmer.phone,
        totalProducts: products,
        totalOrders: orders.length,
        totalRevenue: totalRevenue * 0.95 // Assuming 95% is farmer profit
      };
    }));
    
    res.json(farmerStats);
  } catch (error) {
    next(error);
  }
};

// @desc    Get consumer analytics
// @route   GET /api/analytics/consumers
// @access  Private/Admin
const getConsumerAnalytics = async (req, res, next) => {
  try {
    const consumers = await User.find({ role: 'consumer' }).select('-password');
    const consumerStats = await Promise.all(consumers.map(async (consumer) => {
      const orders = await Order.find({ userId: consumer._id, paymentStatus: 'completed' });
      
      const totalSpent = orders.reduce((acc, order) => acc + order.totalAmount, 0);
      
      return {
        _id: consumer._id,
        name: consumer.name,
        email: consumer.email,
        phone: consumer.phone,
        totalOrders: orders.length,
        totalSpent
      };
    }));
    
    res.json(consumerStats);
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverviewStats, getFarmerAnalytics, getConsumerAnalytics };
