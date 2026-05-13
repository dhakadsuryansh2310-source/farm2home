import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, ArrowLeft, User as UserIcon } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const Inbox = () => {
  const { userId } = useParams(); // Active chat user
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch conversations list
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/messages');
        setConversations(res.data);
      } catch (error) {
        console.error("Error fetching conversations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Fetch active chat
  useEffect(() => {
    let interval;
    const fetchChat = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${userId}`);
        setActiveChat(res.data);
        
        // Find other user details from conversations list
        const conv = conversations.find(c => c.user._id === userId);
        if (conv) {
          setOtherUser(conv.user);
        } else {
          // If not in conversation list, fetch from API
          try {
            const userRes = await axios.get(`http://localhost:5000/api/users/${userId}`);
            setOtherUser(userRes.data);
          } catch (err) {
            console.error("Error fetching other user details", err);
            setOtherUser({ _id: userId, name: "User" });
          }
        }
      } catch (error) {
        console.error("Error fetching chat", error);
      }
    };

    if (userId) {
      fetchChat();
      // Poll for new messages
      interval = setInterval(fetchChat, 5000);
    } else {
      setActiveChat([]);
      setOtherUser(null);
    }

    return () => {
      if (interval) clearInterval(interval);
    }
  }, [userId, conversations]);

  // Scroll to bottom when activeChat changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    try {
      const res = await axios.post('http://localhost:5000/api/messages', {
        receiverId: userId,
        content: newMessage
      });
      setActiveChat([...activeChat, res.data]);
      setNewMessage('');
      
      // Update conversations list locally to move this to top
      const fetchConversations = async () => {
        const res = await axios.get('http://localhost:5000/api/messages');
        setConversations(res.data);
      };
      fetchConversations();
      
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div className="bg-light min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex h-[80vh]">
        
        {/* Sidebar - Conversations */}
        <div className={`w-full md:w-1/3 border-r border-gray-100 flex flex-col ${userId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-bold text-dark">Messages</h2>
          </div>
          
          <div className="overflow-y-auto flex-grow">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No messages yet.
              </div>
            ) : (
              conversations.map((conv) => (
                <div 
                  key={conv.user._id}
                  onClick={() => navigate(`/messages/${conv.user._id}`)}
                  className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-3 ${userId === conv.user._id ? 'bg-primary-50 border-l-4 border-l-primary-500' : 'border-l-4 border-l-transparent'}`}
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold shrink-0">
                    {conv.user.name.charAt(0)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">{conv.user.name}</h3>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-dark' : 'text-gray-500'}`}>
                      {conv.lastMessage.senderId === currentUser._id ? 'You: ' : ''}{conv.lastMessage.content}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`w-full md:w-2/3 flex flex-col ${!userId ? 'hidden md:flex bg-gray-50' : 'flex'}`}>
          {!userId ? (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
              <UserIcon className="h-16 w-16 mb-4 text-gray-300" />
              <p>Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-3">
                <button className="md:hidden text-gray-500" onClick={() => navigate('/messages')}>
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                  {otherUser ? otherUser.name.charAt(0) : 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-dark">{otherUser ? otherUser.name : 'Loading...'}</h3>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
                {activeChat.map((msg, idx) => {
                  const isMine = msg.senderId === currentUser._id;
                  return (
                    <div key={msg._id || idx} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMine ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                        {msg.productId && (
                          <div className="mb-2 p-2 bg-black bg-opacity-10 rounded text-xs flex items-center gap-2">
                             <Package className="h-3 w-3"/> Inquired about a product
                          </div>
                        )}
                        <p className="break-words">{msg.content}</p>
                      </div>
                      <span className="text-xs text-gray-400 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim()}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors shrink-0"
                  >
                    <Send className="h-4 w-4 ml-1" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Inbox;
