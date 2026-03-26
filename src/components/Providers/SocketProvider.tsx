"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: Set<string>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: new Set(),
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    const socketInitializer = async () => {
      await fetch("/api/socket_io");
      const s = io(undefined as any, {
        path: "/api/socket_io",
        addTrailingSlash: false,
      });

      s.on("connect", () => {
        const userId = session?.user?.id;
        if (userId) {
          console.log("[Socket] Connected to server");
          s.emit("user-online", userId);
        }
      });

      s.on("status-update", ({ userId, status }: { userId: string, status: string }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          if (status === "online") next.add(userId);
          else next.delete(userId);
          return next;
        });
      });

      setSocket(s);
    };

    socketInitializer();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [session?.user?.id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}
