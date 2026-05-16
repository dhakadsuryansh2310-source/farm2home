const express = require('express');
const router = express.Router();
const { getOverviewStats, getFarmerAnalytics, getConsumerAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.route('/overview').get(protect, authorize('admin'), getOverviewStats);
router.route('/farmers').get(protect, authorize('admin'), getFarmerAnalytics);
router.route('/consumers').get(protect, authorize('admin'), getConsumerAnalytics);

module.exports = router;
