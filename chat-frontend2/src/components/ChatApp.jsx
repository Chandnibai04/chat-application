import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatBox from "./ChatBox";
import ChatList from "./ChatList";
import { socket } from "../socket/socket";

function ChatApp() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const [currentUser, setCurrentUser] = useState(() => {
    const username = sessionStorage.getItem("username");
    const userId = sessionStorage.getItem("userId");
    if (username && userId) return { username, id: userId };
    return null;
  });

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!token || !currentUser) navigate("/login");
  }, [token, currentUser, navigate]);

  // Connect socket
  useEffect(() => {
    if (!currentUser) return;

    socket.connect();
    socket.emit("join", currentUser.id);

    // Listen for incoming messages
    socket.on("receiveMessage", (msg) => {
      setUsers((prev) =>
        prev.map((u) => {
          if (u._id === msg.sender) {
            return {
              ...u,
              unread: selectedUser?._id === msg.sender ? 0 : (u.unread || 0) + 1,
            };
          }
          return u;
        })
      );
    });

    // Listen for typing
    socket.on("typing", (userId) => {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isTyping: true } : u
        )
      );

      // Remove typing after 2 sec
      setTimeout(() => {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isTyping: false } : u
          )
        );
      }, 2000);
    });

    return () => socket.disconnect();
  }, [currentUser, selectedUser]);

  // Fetch all users
  useEffect(() => {
    if (!currentUser) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const others = res.data
          .filter((u) => u._id !== currentUser.id)
          .map((u) => ({ ...u, unread: 0, isTyping: false }));
        setUsers([{ _id: currentUser.id, username: currentUser.username }, ...others]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, [currentUser, token]);

  const handleLogout = () => {
    socket.disconnect();
    sessionStorage.clear();
    navigate("/login");
  };

  // Reset unread when a user is selected
  useEffect(() => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u._id === selectedUser._id ? { ...u, unread: 0 } : u
      )
    );
  }, [selectedUser]);

  return (
    <div className="flex h-screen bg-[#0a0f2c]">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-gray-700 flex flex-col">
        <div className="flex justify-between items-center p-4 bg-[#0f0c29] border-b border-gray-700">
          <span className="text-purple-300 font-semibold text-lg">Chats</span>
          <button
            onClick={handleLogout}
            className="bg-purple-600 text-white px-3 py-1 rounded hover:opacity-80"
          >
            Logout
          </button>
        </div>

        <ChatList
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          currentUserId={currentUser?.id}
        />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentUser && selectedUser ? (
          <ChatBox
            currentUser={currentUser}
            otherUser={selectedUser}
            socket={socket}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatApp;
