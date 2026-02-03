import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/message.js";

dotenv.config();

const app = express();

// 🔹 Connect DB only once
connectDB();

// 🔹 Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

// 🔹 Routes
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);

// 🔹 Export app (VERY IMPORTANT)
export default app;
