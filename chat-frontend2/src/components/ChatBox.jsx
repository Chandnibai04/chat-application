import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { socket } from "../socket/socket";

// Backend URL from .env
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function ChatBox({ currentUser, otherUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [notifications, setNotifications] = useState(0);

  const messagesContainerRef = useRef(null);
  const isAtBottomRef = useRef(true);

  const token = sessionStorage.getItem("token");

  // =========================
  // JOIN PERSONAL ROOM
  // =========================
  useEffect(() => {
    if (!currentUser) return;
    socket.emit("join", currentUser.id);
  }, [currentUser]);

  // =========================
  // FETCH OLD MESSAGES
  // =========================
  useEffect(() => {
    if (!currentUser || !otherUser) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/chat/messages/${otherUser._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data && Array.isArray(res.data.messages)) {
          setMessages(res.data.messages);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [currentUser, otherUser, token]);

  // =========================
  // SOCKET: RECEIVE MESSAGE
  // =========================
  useEffect(() => {
    if (!currentUser) return;

    const handleReceive = (msg) => {
      // If current chat is open
      if (otherUser && msg.sender === otherUser._id) {
        setMessages((prev) => {
          if (!prev.find((m) => m._id === msg._id)) {
            return [...prev, msg];
          }
          return prev;
        });
      }

      // Notification logic
      if (
        msg.receiver === currentUser.id &&
        (!otherUser || msg.sender !== otherUser._id)
      ) {
        setNotifications((prev) => prev + 1);
      }
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [currentUser, otherUser]);

  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (isAtBottomRef.current) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // =========================
  // TRACK SCROLL POSITION
  // =========================
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 50;

    isAtBottomRef.current = isBottom;
  };

  // =========================
  // SEND MESSAGE
  // =========================
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      receiver: otherUser._id,
      content: newMessage,
    };

    try {
      const res = await axios.post(
        `${BASE_URL}/api/messages/send`,
        messageData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const savedMessage = res.data.message;

      // Emit socket event
      socket.emit("sendMessage", savedMessage);

      // Update UI immediately
      setMessages((prev) => {
        if (!prev.find((m) => m._id === savedMessage._id)) {
          return [...prev, savedMessage];
        }
        return prev;
      });

      setNewMessage("");
      isAtBottomRef.current = true;
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // =========================
  // CLEAR NOTIFICATIONS WHEN CHAT OPENS
  // =========================
  useEffect(() => {
    setNotifications(0);
  }, [otherUser]);

  return (
    <div className="h-full flex flex-col bg-[#020617] rounded-lg p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-purple-300">
          {otherUser?.username}
        </h2>
        {notifications > 0 && (
          <div className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
            {notifications} new
          </div>
        )}
      </div>

      {/* MESSAGES */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto pr-2 space-y-2"
      >
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-[70%] p-2 rounded-lg ${
              msg.sender === currentUser.id
                ? "bg-purple-600 text-white ml-auto"
                : "bg-purple-200 text-black"
            }`}
          >
            <div>{msg.content}</div>
            <div className="text-xs text-gray-500 mt-1 text-right">
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <form onSubmit={handleSend} className="flex gap-2 mt-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-lg bg-[#020617] text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="bg-purple-600 px-6 rounded-lg text-white font-semibold"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
