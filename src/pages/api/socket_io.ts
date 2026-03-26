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

    io.on("connection", (socket) => {
      console.log("[Socket] Client connected:", socket.id);

      socket.on("join-conversation", (conversationId) => {
        socket.join(`conversation_${conversationId}`);
        console.log(`[Socket] Joined conversation_${conversationId}`);
      });

      socket.on("send-message", (msg) => {
        io.to(`conversation_${msg.conversationId}`).emit("new-message", msg);
      });
      
      socket.on("user-online", (userId) => {
         socket.broadcast.emit("status-update", { userId, status: "online" });
      });

      socket.on("disconnect", () => {
        console.log("[Socket] Client disconnected:", socket.id);
      });
    });
  }
  
  res.end();
}
