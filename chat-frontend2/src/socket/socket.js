import { io } from "socket.io-client";

export const socket = io("https://localhost:5000", {
  transports: ["websocket"], // force WSS
  withCredentials: true,
});

