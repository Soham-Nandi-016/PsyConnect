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

      setSocket(s);
    };

    socketInitializer();

    return () => {
      if (s) s.disconnect();
    };
  }, [currentUserId]);

  // Handle new-message listener with conversationId context
  useEffect(() => {
    if (!socket || !selectedId) return;

    const handleNewMessage = (msg: any) => {
        console.log("Message Received via Socket", msg);
        
        // Update the active conversation if it matches the current view
        if (msg.conversationId === selectedId) {
            setActiveConvo((prev: any) => {
                if (!prev || prev.id !== msg.conversationId) return prev;
                // Avoid duplicates
                if (prev.messages.some((m: any) => m.id === msg.id)) return prev;
                return { ...prev, messages: [...prev.messages, msg] };
            });
        }

        // Update the sidebar list
        setConversations((prev) => {
          const index = prev.findIndex(c => c.id === msg.conversationId);
          if (index === -1) return prev;
          const updated = [...prev];
          updated[index] = { ...updated[index], messages: [msg], updatedAt: new Date() };
          return updated.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        });
    };

    socket.on("new-message", handleNewMessage);
    
    // Ensure we are in the room for this conversation
    socket.emit("join-conversation", selectedId);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, selectedId]);

  // Fetch full conversation details when selection changes
  useEffect(() => {
    const loadConvo = async () => {
      if (!selectedId) return;
      const data = await getConversation(selectedId);
      setActiveConvo(data);
    };
    loadConvo();
  }, [selectedId]);

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
