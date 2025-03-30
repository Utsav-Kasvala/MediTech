import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { BASE_URL } from '../../config';

const socket = io('http://localhost:5000');

const ChatSection = ({ doctorId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Join as user
    socket.emit("user_join", userId);

    // Listen for messages
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [doctorId, userId]);

  const sendMessage = () => {
    if (message.trim() === '') return;

    const msgData = {
      senderId: userId,
      receiverId: doctorId,
      text: message,
    };

    // Optimistic update
    setMessages((prev) => [...prev, msgData]);
    setMessage('');
    socket.emit("send_message", msgData);
  };

  return (
    <div className="chat-container p-5 border rounded shadow-md bg-white">
      <h3 className="text-lg font-semibold mb-3">Chat with Doctor</h3>
      <div className="chat-box h-64 overflow-y-auto border p-3 mb-3 bg-gray-100 rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <span
              className={`inline-block px-3 py-1 rounded-lg max-w-xs text-white text-sm ${
                msg.senderId === userId ? 'bg-blue-500' : 'bg-green-500'
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
