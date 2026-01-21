// server.js
import fs from "fs";
import https from "https";
import { Server } from "socket.io";
import app from "./app.js";

// 🔹 Create HTTPS server
const server = https.createServer(
  {
    key: fs.readFileSync("cert/localhost-key.pem"),
    cert: fs.readFileSync("cert/localhost.pem"),
  },
  app
);

// 🔹 Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "https://localhost:5173", // your frontend
    methods: ["GET", "POST"],
  },
});

// 🔹 Track online users: { userId: socketId }
const onlineUsers = {};

// 🔹 Handle socket connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins (store their socket id)
  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    socket.join(userId);
    console.log(`User ${userId} joined`);
  });

  // Handle sending messages
  socket.on("sendMessage", (msg) => {
    const receiverSocket = onlineUsers[msg.receiver];
    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", msg);
    }
  });

  // 🔹 Handle new signup user
  socket.on("newUser", (user) => {
    console.log("New user signed up:", user);
    socket.broadcast.emit("userJoined", user); // notify all other clients
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

// 🔹 Start HTTPS + WSS server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`HTTPS + WSS server running on https://localhost:${PORT}`)
);
