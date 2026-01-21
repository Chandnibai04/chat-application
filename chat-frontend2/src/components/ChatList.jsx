import React from "react";

function ChatList({ users, selectedUser, setSelectedUser, currentUserId }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#0f0c29]">
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => setSelectedUser(user)}
          className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition-colors duration-200 ${
            selectedUser?._id === user._id
              ? "bg-purple-700 text-white"
              : "bg-[#0f0c29] text-purple-200 hover:bg-purple-600/50"
          }`}
        >
          <div className="flex flex-col">
            {/* Username */}
            <span className="font-medium">
              {user.username} {user._id === currentUserId ? "(You)" : ""}
            </span>

            {/* Typing indicator */}
            {user.isTyping && (
              <span className="text-xs text-gray-300 italic">typing...</span>
            )}
          </div>

          {/* New message badge */}
          {user.unread > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {user.unread}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default ChatList;
