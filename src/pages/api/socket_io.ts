import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";

export default function SocketHandler(req: NextApiRequest, res: any) {
  if (res.socket.server.io) {
    console.log("[Socket] Engine is already running");
  } else {
    console.log("[Socket] Initializing real-time engine...");
    const io = new Server(res.socket.server, {
        path: "/api/socket_io",
        addTrailingSlash: false,
    });
    
    res.socket.server.io = io;

    const userSocketMap = new Map(); // socket.id -> userId

    io.on("connection", (socket) => {
      console.log("[Socket] Client connected:", socket.id);

      socket.on("join-conversation", (conversationId) => {
        socket.join(`conversation_${conversationId}`);
        console.log(`[Socket] Joined conversation_${conversationId}`);
      });

      socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`[Socket] Joined room: ${room}`);
      });

      socket.on("send-message", (msg) => {
        io.to(`conversation_${msg.conversationId}`).emit("new-message", msg);
      });

      socket.on("new-booking", (data) => {
        io.to(`mentor_${data.counsellorId}`).emit("new-booking", data);
      });
      
      socket.on("user-online", (userId) => {
        userSocketMap.set(socket.id, userId);
        socket.broadcast.emit("status-update", { userId, status: "online" });
      });

      socket.on("disconnect", () => {
        const userId = userSocketMap.get(socket.id);
        if (userId) {
          socket.broadcast.emit("status-update", { userId, status: "offline" });
          userSocketMap.delete(socket.id);
        }
        console.log("[Socket] Client disconnected:", socket.id);
      });
    });
  }
  
  res.end();
}
