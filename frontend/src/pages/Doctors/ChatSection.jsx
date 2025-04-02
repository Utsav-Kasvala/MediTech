import React, { useEffect, useState, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { BASE_URL } from '../../config';

const socket = io('http://localhost:5000');

const ChatSection = ({ doctorId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch conversation history on mount
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const params = new URLSearchParams({
          participant1: userId,
          participant2: doctorId,
          model1: 'User',
          model2: 'Doctor'
        });

        const response = await fetch(`${BASE_URL}/conversations?${params}`);
        const data = await response.json();

        if (response.ok && data.conversation) {
          const formattedMessages = data.conversation.messages.map(msg => ({
            _id: msg._id,
            senderId: msg.sender,
            receiverId: msg.receiver,
            text: msg.text,
            createdAt: new Date(msg.createdAt)
          }));
          setMessages(formattedMessages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [doctorId, userId]);

  // Handle received messages
  const handleReceiveMessage = useCallback((msg) => {
    setMessages(prev => {
      // Replace temporary message with actual message
      const filtered = prev.filter(m => !(m.isTemp && m.text === msg.text));
      return [...filtered, {
        _id: msg._id,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        text: msg.text,
        createdAt: new Date(msg.createdAt)
      }];
    });
  }, []);

  // Socket listeners
  useEffect(() => {
    socket.emit("user_join", userId);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [handleReceiveMessage, userId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() === '') return;

    const tempMessage = {
      tempId: Date.now(),
      senderId: userId,
      receiverId: doctorId,
      text: message,
      createdAt: new Date(),
      isTemp: true
    };

    // Optimistic update
    setMessages(prev => [...prev, tempMessage]);
    setMessage('');

    // Send message via Socket
    socket.emit("send_message", {
      senderId: userId,
      receiverId: doctorId,
      senderType: "User",
      text: message
    });
  };

  if (isLoading) return <div>Loading chat history...</div>;

  return (
    <div className="chat-container p-5 border rounded shadow-md bg-white">
      <h3 className="text-lg font-semibold mb-3">Chat with Doctor</h3>
      <div className="chat-box h-64 overflow-y-auto border p-3 mb-3 bg-gray-100 rounded">
        {messages.map((msg) => (
          <div
            key={msg._id || msg.tempId}
            className={`flex mb-2 ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`inline-block px-3 py-1 rounded-lg max-w-xs text-white text-sm ${
              msg.senderId === userId ? 'bg-blue-500' : 'bg-green-500'
            }`}>
              <p>{msg.text}</p>
              <p className="text-xs opacity-75 mt-1">
                {msg.createdAt.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
                {msg.isTemp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button 
          onClick={sendMessage} 
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={!message.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSection;