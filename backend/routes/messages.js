const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, sendMessage)
  .get(protect, getConversations);

router.route('/:userId')
  .get(protect, getChatHistory);

module.exports = router;
