import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";

const socket = io("http://localhost:5000");

const DoctorChat = () => {
    const { data: doctor } = useFetchData(`${BASE_URL}/doctors/profile/me`);
    const [activeUserId, setActiveUserId] = useState(null);
    const [messages, setMessages] = useState({});
    const [message, setMessage] = useState("");
    const [unreadUsers, setUnreadUsers] = useState({});
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!doctor?._id) return;

        // Join as doctor
        socket.emit("doctor_join", doctor._id);

        // Listen for incoming messages
        socket.on("receive_message", (msg) => {
            setMessages((prev) => ({
                ...prev,
                [msg.senderId]: [...(prev[msg.senderId] || []), msg],
            }));

            if (activeUserId !== msg.senderId) {
                setUnreadUsers((prev) => ({
                    ...prev,
                    [msg.senderId]: (prev[msg.senderId] || 0) + 1,
                }));
            }
        });

        return () => {
            socket.off("receive_message");
        };
    }, [doctor, activeUserId]);

    const sendMessage = () => {
        if (!message.trim() || !activeUserId) return;

        const msgData = {
            senderId: doctor._id,
            receiverId: activeUserId,
            text: message,
        };

        // Optimistic update
        setMessages((prev) => ({
            ...prev,
            [activeUserId]: [...(prev[activeUserId] || []), msgData],
        }));
        setMessage("");

        socket.emit("send_message", msgData);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">Chats</h2>
            <div className="flex">
                {/* Sidebar - Users List */}
                <div className="w-1/3 border-r p-4">
                    <h3 className="font-semibold mb-3">Users</h3>
                    {Object.keys(messages).length > 0 ? (
                        Object.keys(messages).map((userId) => (
                            <div
                                key={userId}
                                className={`cursor-pointer p-2 mb-2 rounded flex justify-between ${
                                    activeUserId === userId ? "bg-blue-500 text-white" : "bg-gray-200"
                                }`}
                                onClick={() => {
                                    setActiveUserId(userId);
                                    setUnreadUsers((prev) => ({ ...prev, [userId]: 0 }));
                                }}
                            >
                                <span>User {userId}</span>
                                {unreadUsers[userId] > 0 && (
                                    <span className="bg-red-500 text-white px-2 rounded-full text-xs">
                                        {unreadUsers[userId]}
                                    </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No messages yet</p>
                    )}
                </div>

                {/* Chat Box */}
                <div className="w-2/3 p-4">
                    {activeUserId ? (
                        <>
                            <h3 className="font-semibold mb-2">Chat with User {activeUserId}</h3>
                            <div className="border p-4 mb-4 h-60 overflow-auto bg-gray-100">
                                {messages[activeUserId]?.map((msg, index) => (
                                    <p
                                        key={index}
                                        className={`mb-1 ${
                                            msg.senderId === doctor._id ? "text-right" : "text-left"
                                        }`}
                                    >
                                        <strong>
                                            {msg.senderId === doctor._id ? "You" : "User"}
                                        </strong>: {msg.text}
                                    </p>
                                ))}
                                <div ref={messagesEndRef}></div>
                            </div>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="border p-2 flex-1"
                                    placeholder="Type your message..."
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>Select a user to start chatting</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorChat;
