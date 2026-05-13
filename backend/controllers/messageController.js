const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, productId, content } = req.body;

    if (!receiverId || !content) {
      res.status(400);
      throw new Error('Please provide receiver and content');
    }

    const message = new Message({
      senderId: req.user._id,
      receiverId,
      productId,
      content,
    });

    const createdMessage = await message.save();
    res.status(201).json(createdMessage);
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat history between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
const getChatHistory = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('productId', 'name image price');

    // Mark messages as read
    await Message.updateMany(
      { senderId: otherUserId, receiverId: currentUserId, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of conversations (inbox)
// @route   GET /api/messages
// @access  Private
const getConversations = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    // Find all distinct users the current user has chatted with
    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    }).sort({ createdAt: -1 });

    const conversations = [];
    const userIds = new Set();

    for (let msg of messages) {
      const otherUser = msg.senderId.toString() === currentUserId.toString() ? msg.receiverId : msg.senderId;
      
      if (!userIds.has(otherUser.toString())) {
        userIds.add(otherUser.toString());
        
        // Populate the other user info
        const user = await User.findById(otherUser).select('name email role avatar');
        
        // Count unread messages from this user
        const unreadCount = await Message.countDocuments({
          senderId: otherUser,
          receiverId: currentUserId,
          read: false
        });

        if (user) {
          conversations.push({
            user,
            lastMessage: msg,
            unreadCount
          });
        }
      }
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getChatHistory, getConversations };
