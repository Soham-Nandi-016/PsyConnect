"use client";

import { Search, MoreVertical, MessageSquare, Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface ChatSidebarProps {
  conversations: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  currentUserRole: string;
}

export function ChatSidebar({ conversations, selectedId, onSelect, currentUserRole }: ChatSidebarProps) {
  return (
    <div className="w-full h-full flex flex-col bg-white/40 backdrop-blur-md border-r border-black/5 overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-black/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input 
            type="text" 
            placeholder="Search mentors..." 
            className="w-full bg-black/5 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Conv List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 && (
            <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6 text-primary/40" />
                </div>
                <p className="text-xs font-semibold text-foreground/40 uppercase tracking-widest leading-loose">No active chats</p>
                <p className="text-xs text-foreground/30 px-4">Start a request from a mentor's profile to begin.</p>
            </div>
        )}

        {conversations.map((convo) => {
          const isSelected = selectedId === convo.id;
          const otherUser = currentUserRole === "COUNSELLOR" ? convo.student : convo.counsellor;
          const lastMsg = convo.messages[0];

          return (
            <motion.button
              key={convo.id}
              onClick={() => onSelect(convo.id)}
              whileHover={{ x: 4 }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all relative ${
                isSelected ? "bg-white shadow-sm" : "hover:bg-white/40"
              }`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary overflow-hidden border border-white`}>
                   {otherUser.avatarUrl || otherUser.image ? (
                        <img src={otherUser.avatarUrl || otherUser.image} alt="" className="w-full h-full object-cover" />
                   ) : (
                        otherUser.name?.[0] || "?"
                   )}
                </div>
                {/* Online Indicator (Simulated for Demo) */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-foreground text-[14px] truncate">{otherUser.name}</span>
                  {convo.status === "PENDING" && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tight">Pending</span>
                  )}
                </div>
                <p className="text-xs text-foreground/50 truncate leading-snug">
                  {lastMsg ? lastMsg.content : (convo.status === "PENDING" ? "Connection request sent..." : "Say hello!")}
                </p>
              </div>

              {isSelected && (
                <motion.div layoutId="active-sidebar" className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
