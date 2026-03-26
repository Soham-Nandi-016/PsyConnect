"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { getChatConversations, getConversation } from "@/app/actions/forum";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleHeart } from "lucide-react";

interface ChatClientProps {
  initialConversations: any[];
  currentUserId: string;
  currentUserRole: string;
}

export default function ChatClient({ initialConversations, currentUserId, currentUserRole }: ChatClientProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(initialConversations[0]?.id || null);
  const [activeConvo, setActiveConvo] = useState<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize Socket
  useEffect(() => {
    let s: Socket;
    const socketInitializer = async () => {
      await fetch("/api/socket_io");
      s = io(undefined as any, {
        path: "/api/socket_io",
        addTrailingSlash: false,
      });

      s.on("connect", () => {
        console.log("[Socket] Connected to server");
        s.emit("user-online", currentUserId);
      });

      s.on("new-message", (msg) => {
        // Update the active conversation if it matches
        setActiveConvo((prev: any) => {
          if (prev?.id === msg.conversationId) {
            // Check if message already exists to avoid dupes from re-renders/actions
            if (prev.messages.some((m: any) => m.id === msg.id)) return prev;
            return { ...prev, messages: [...prev.messages, msg] };
          }
          return prev;
        });

        // Update the sidebar list (move to top and update last message)
        setConversations((prev) => {
          const index = prev.findIndex(c => c.id === msg.conversationId);
          if (index === -1) return prev;
          const updated = [...prev];
          updated[index] = { ...updated[index], messages: [msg], updatedAt: new Date() };
          return updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        });
      });

      setSocket(s);
    };

    socketInitializer();

    return () => {
      if (s) s.disconnect();
    };
  }, [currentUserId]);

  // Fetch full conversation details when selection changes
  useEffect(() => {
    const loadConvo = async () => {
      if (!selectedId) return;
      const data = await getConversation(selectedId);
      setActiveConvo(data);
      if (socket) socket.emit("join-conversation", selectedId);
    };
    loadConvo();
  }, [selectedId, socket]);

  const refreshAction = async () => {
    const updatedList = await getChatConversations();
    setConversations(updatedList);
    if (selectedId) {
        const data = await getConversation(selectedId);
        setActiveConvo(data);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#fcfbf9]">
      {/* Sidebar */}
      <div className="w-80 h-full hidden md:block">
        <ChatSidebar 
            conversations={conversations} 
            selectedId={selectedId} 
            onSelect={setSelectedId} 
            currentUserRole={currentUserRole}
        />
      </div>

      {/* Main Window */}
      <div className="flex-1 h-full flex flex-col bg-white/20">
        <AnimatePresence mode="wait">
          {activeConvo ? (
            <motion.div
              key={activeConvo.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 h-full"
            >
              <ChatWindow 
                conversation={activeConvo} 
                currentUserId={currentUserId} 
                currentUserRole={currentUserRole}
                onRefresh={refreshAction}
                socket={socket}
              />
            </motion.div>
          ) : (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex-1 flex flex-col items-center justify-center p-8 text-center"
            >
                <div className="w-20 h-20 rounded-[2.5rem] bg-[#eef2ed] border border-[#d6e0d4] flex items-center justify-center mb-6 shadow-sm">
                    <MessageCircleHeart className="w-10 h-10 text-[#6b8f66]/60" />
                </div>
                <h3 className="heading-serif text-2xl text-foreground mb-2">Select a Peer Forum Chat</h3>
                <p className="text-sm text-foreground/40 max-w-xs leading-relaxed">
                    Pick a conversation from the sidebar to connect with your student or peer counselor.
                </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
