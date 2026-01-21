// sockets/chatSocket.js
const { Server } = require("socket.io");
const Message = require("../models/Message");

let io;
const onlineUsers = new Map(); // userId => [socketId1, socketId2, ...]

const initSockets = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }, // allow all origins for dev, change in production
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join event when user logs in
    socket.on("join", (userId) => {
      if (!onlineUsers.has(userId)) onlineUsers.set(userId, []);
      onlineUsers.get(userId).push(socket.id);

      // Broadcast online users (optional)
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      console.log("Online Users:", onlineUsers);
    });

    // Send message
    socket.on("sendMessage", async ({ sender, receiver, content }) => {
      try {
        // Save to DB
        const message = await Message.create({ sender, receiver, content });

        // Send to all receiver sockets
        const receiverSockets = onlineUsers.get(receiver) || [];
        receiverSockets.forEach((sId) => io.to(sId).emit("receiveMessage", message));

        // Send confirmation to all sender sockets
        const senderSockets = onlineUsers.get(sender) || [];
        senderSockets.forEach((sId) => io.to(sId).emit("messageSent", message));
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // Remove socket from all users
      for (let [userId, sockets] of onlineUsers.entries()) {
        const filtered = sockets.filter((id) => id !== socket.id);
        if (filtered.length > 0) onlineUsers.set(userId, filtered);
        else onlineUsers.delete(userId);
      }

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      console.log("Online Users after disconnect:", onlineUsers);
    });
  });
};

module.exports = { initSockets };
