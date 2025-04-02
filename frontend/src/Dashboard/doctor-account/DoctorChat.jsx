import React, { useEffect, useState, useRef, useCallback } from "react";
import io from "socket.io-client";
import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";

const socket = io("http://localhost:5000");

const DoctorChat = () => {
    const { data: doctor } = useFetchData(`${BASE_URL}/doctors/profile/me`);
    const [activeUser, setActiveUser] = useState(null);
    const [messages, setMessages] = useState({});
    const [message, setMessage] = useState("");
    const [unreadUsers, setUnreadUsers] = useState({});
    const [conversations, setConversations] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!doctor?._id) return;

        const fetchConversations = async () => {
            try {
                const response = await fetch(`${BASE_URL}/conversations/doctor/${doctor._id}`);

                if (!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }

                const data = await response.json();
                if (data.conversations) {
                    const initialMessages = {};
                    const initialUnread = {};

                    data.conversations.forEach(conv => {
                        const user = conv.participants.find(p => p.model === "User");
                        if (user) {
                            initialMessages[user.participant._id] = conv.messages
                                .map(msg => ({
                                    ...msg,
                                    createdAt: new Date(msg.createdAt)
                                }))
                                .sort((a, b) => a.createdAt - b.createdAt);

                            initialUnread[user.participant._id] = 0;
                        }
                    });

                    setMessages(initialMessages);
                    setUnreadUsers(initialUnread);
                    setConversations(data.conversations);
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();
    }, [doctor]);

    useEffect(() => {
        if (!doctor?._id) return;

        socket.emit("doctor_join", doctor._id);

        const handleReceiveMessage = (msg) => {
            setMessages(prev => ({
                ...prev,
                [msg.senderId]: [...(prev[msg.senderId] || []), { 
                    ...msg, 
                    createdAt: new Date(msg.createdAt),
                    senderType: msg.senderType || (msg.senderId === doctor._id ? "Doctor" : "User")
                }]
            }));

            setUnreadUsers(prev => ({
                ...prev,
                [msg.senderId]: activeUser?._id === msg.senderId ? 0 : (prev[msg.senderId] || 0) + 1
            }));
        };

        socket.on("receive_message", handleReceiveMessage);

        return () => {
            socket.off("receive_message", handleReceiveMessage);
        };
    }, [doctor, activeUser]);

    const sendMessage = useCallback(() => {
        if (!message.trim() || !activeUser) return;

        const tempId = Date.now();
        const tempMessage = {
            _id: tempId,
            senderId: doctor._id,
            receiverId: activeUser._id,
            senderType: "Doctor",
            text: message,
            createdAt: new Date(),
            isTemp: true
        };

        setMessages(prev => ({
            ...prev,
            [activeUser._id]: [...(prev[activeUser._id] || []), tempMessage]
        }));
        setMessage("");

        socket.emit("send_message", {
            senderId: doctor._id,
            receiverId: activeUser._id,
            senderType: "Doctor",
            text: message
        });
    }, [message, activeUser, doctor]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, activeUser]);

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">Chats</h2>
            <div className="flex">
                <div className="w-1/3 border-r p-4">
                    <h3 className="font-semibold mb-3">Patients</h3>
                    {conversations.length > 0 ? (
                        conversations.map(conv => {
                            const user = conv.participants.find(p => p.model === "User");
                            if (!user) return null;

                            return (
                                <div
                                    key={user.participant._id}
                                    className={`cursor-pointer p-2 mb-2 rounded flex justify-between items-center ${
                                        activeUser?._id === user.participant._id ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-100"
                                    }`}
                                    onClick={() => {
                                        setActiveUser(user.participant);
                                        setUnreadUsers(prev => ({ ...prev, [user.participant._id]: 0 }));
                                    }}
                                >
                                    <div>
                                        <span className="font-medium">{user.participant.name}</span>
                                        <p className="text-xs text-gray-600">
                                            {messages[user.participant._id]?.slice(-1)[0]?.text || "No messages yet"}
                                        </p>
                                    </div>
                                    {unreadUsers[user.participant._id] > 0 && (
                                        <span className="bg-red-500 text-white px-2 rounded-full text-xs">
                                            {unreadUsers[user.participant._id]}
                                        </span>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p>No conversations yet</p>
                    )}
                </div>
                <div className="w-2/3 p-4">
                    {activeUser ? (
                        <>
                            <h3 className="font-semibold mb-4">Chat with {activeUser.name}</h3>
                            <div className="border rounded-lg h-96 overflow-y-auto p-4 bg-gray-50">
                                {messages[activeUser._id]?.map((msg, index) => (
                                    <div
                                        key={msg._id || index}
                                        className={`flex mb-4 ${
                                            msg.senderType === "Doctor" ? "justify-end" : "justify-start"
                                        }`}
                                    >
                                        <div className={`max-w-xs p-3 rounded-lg ${
                                            msg.senderType === "Doctor" 
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 text-gray-800"
                                        }`}>
                                            <p>{msg.text}</p>
                                            <p className="text-xs mt-1 opacity-75">
                                                {new Date(msg.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="mt-4 flex gap-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Type a message..."
                                />
                                <button
                                    onClick={sendMessage}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                    disabled={!message.trim()}
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            Select a patient to view conversation
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorChat;