import { io } from "socket.io-client";
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "https://localhost:5000";
export const socket = io(BASE_URL, {
  transports: ["websocket"], // force WSS
  withCredentials: true,
});

