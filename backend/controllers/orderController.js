const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
  try {
    const { products, deliveryAddress, paymentMethod, farmerId, totalAmount } = req.body;

    if (products && products.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      // Lookup marketPrice for each product to ensure accuracy
      const orderProducts = await Promise.all(products.map(async (item) => {
        const productFromDb = await Product.findById(item.productId);
        const marketPrice = productFromDb && productFromDb.marketPrice 
          ? productFromDb.marketPrice 
          : (item.price * 1.2); // Fallback: 20% higher than sale price
        
        return {
          ...item,
          marketPrice
        };
      }));

      const order = new Order({
        userId: req.user._id,
        farmerId,
        products: orderProducts,
        deliveryAddress,
        paymentMethod,
        totalAmount,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('farmerId', 'name email')
      .populate('products.productId', 'name image price');

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Farmer
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to update this order');
      }

      order.orderStatus = req.body.status || order.orderStatus;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const query = req.user.role === 'farmer' ? { farmerId: req.user._id } : { userId: req.user._id };
    const orders = await Order.find(query).populate('products.productId', 'name images').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .populate('farmerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = { addOrderItems, getOrderById, updateOrderStatus, getMyOrders, getOrders };
