const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, updateOrderStatus, getMyOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, authorize('farmer', 'admin'), updateOrderStatus);

module.exports = router;
