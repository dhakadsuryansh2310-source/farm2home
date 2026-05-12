const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId', 'name price images stock farmerId');
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, products: [] });
    }
    
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, products: [] });
    }

    const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    
    const updatedCart = await Cart.findOne({ userId: req.user._id }).populate('products.productId', 'name price images stock farmerId');
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      cart.products = cart.products.filter(p => p.productId.toString() !== productId);
      await cart.save();
      const updatedCart = await Cart.findOne({ userId: req.user._id }).populate('products.productId', 'name price images stock farmerId');
      res.json(updatedCart);
    } else {
      res.status(404);
      throw new Error('Cart not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, removeFromCart };
