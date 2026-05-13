const express = require('express');
const router = express.Router();
const { getUsers, updateUserProfile } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, authorize('admin'), getUsers);
router.route('/profile').put(protect, updateUserProfile);
router.route('/:id').get(protect, getUserById);

module.exports = router;
