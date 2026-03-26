"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, XCircle, Info, Shrub } from "lucide-react";
import { acceptRequest, denyRequest, sendMessage } from "@/app/actions/forum";
import { revalidatePath } from "next/cache";

interface ChatWindowProps {
  conversation: any;
  currentUserId: string;
  currentUserRole: string;
  onRefresh: () => void;
  socket: any;
}

export function ChatWindow({ conversation, currentUserId, currentUserRole, onRefresh, socket }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevMsgCount = useRef(conversation?.messages?.length || 0);

  const otherUser = currentUserRole === "COUNSELLOR" ? conversation.student : conversation.counsellor;
  const isPending = conversation.status === "PENDING";
  const isDeclined = conversation.status === "DECLINED";

  // Auto-scroll logic: only when msg count increases
  useEffect(() => {
    if (conversation?.messages?.length > prevMsgCount.current) {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
    prevMsgCount.current = conversation?.messages?.length || 0;
  }, [conversation?.messages?.length]);

  // Initial scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [conversation?.id]);

  const handleSend = async () => {
    if (!input.trim() || isPending || isDeclined) return;
    const res = await sendMessage(conversation.id, input.trim());
    if (res.success) {
      if (socket) {
        socket.emit("send-message", res.message);
      }
      setInput("");
      onRefresh();
    }
  };

  const handleAccept = async () => {
    const res = await acceptRequest(conversation.id);
    if (res.success) onRefresh();
  };

  const handleDecline = async () => {
    const res = await denyRequest(conversation.id);
    if (res.success) onRefresh();
  };

  return (
    <div className="flex-1 flex flex-col bg-white/60 h-full overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-black/5 flex items-center justify-between bg-white/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary text-sm border border-white">
             {otherUser.avatarUrl || otherUser.image ? (
                  <img src={otherUser.avatarUrl || otherUser.image} alt="" className="w-full h-full object-cover" />
             ) : (
                  otherUser.name?.[0] || "?"
             )}
          </div>
          <div>
            <h3 className="font-bold text-foreground text-[15px]">{otherUser.name}</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Online
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 [&::-webkit-scrollbar]:hidden">
        <AnimatePresence initial={false}>
          {conversation.messages.map((msg: any) => {
            const isMe = msg.senderStudentId === currentUserId || (currentUserRole === "COUNSELLOR" && msg.senderCounsellorId === conversation.counsellorId);
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm border ${
                    isMe 
                      ? "bg-[#6b8f66] text-white border-[#5a7a56] rounded-tr-none" 
                      : "bg-[#eef2ed] text-foreground border-black/5 rounded-tl-none"
                  }`}
                  style={{ borderRadius: isMe ? "1.25rem 0.25rem 1.25rem 1.25rem" : "0.25rem 1.25rem 1.25rem 1.25rem" }}
                >
                  {msg.content}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Dynamic Overlays / Bottom Bars */}
      
      {/* Student View: Pending Handshake */}
      {isPending && currentUserRole === "STUDENT" && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-md p-8 text-center border-t border-black/5 z-10"
        >
            <div className="max-w-xs mx-auto flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4 text-[#6b8f66]">
                    <Shrub className="w-7 h-7 animate-bounce" />
                </div>
                <h4 className="font-bold text-foreground text-lg mb-2 tracking-tight">Connecting you with {otherUser.name}...</h4>
                <p className="text-xs text-foreground/50 leading-relaxed">
                    Mentors usually respond within a few hours to ensure a safe space. Take a deep breath — help is on the way. ✨
                </p>
            </div>
        </motion.div>
      )}

      {/* Mentor View: Accept/Decline */}
      {isPending && currentUserRole === "COUNSELLOR" && (
        <div className="p-4 bg-amber-50 border-t border-amber-100 flex items-center justify-between gap-4 sticky bottom-0 z-10">
          <div className="flex items-center gap-3 text-amber-800">
            <Info className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-semibold">Incoming Request from {otherUser.name}</span>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={handleAccept}
                className="flex items-center gap-2 bg-[#6b8f66] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-[#5a7a56] transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> Accept
            </button>
            <button 
                onClick={handleDecline}
                className="flex items-center gap-2 bg-white text-rose-600 px-4 py-2 rounded-xl text-sm font-bold border border-rose-100 shadow-sm hover:bg-rose-50 transition-all"
            >
              <XCircle className="w-4 h-4" /> Decline
            </button>
          </div>
        </div>
      )}

      {/* Input Field: Only for Accepted / Active connections */}
      {(!isPending && !isDeclined) && (
        <div className="p-4 bg-white/40 backdrop-blur-md border-t border-black/5 sticky bottom-0">
          <div className="max-w-4xl mx-auto relative flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-white border border-black/5 rounded-2xl py-3.5 pl-5 pr-12 text-[14px] focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-2 p-2 bg-[#6b8f66] text-white rounded-xl hover:bg-[#5a7a56] transition-all disabled:opacity-50 disabled:grayscale"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {isDeclined && (
          <div className="p-8 text-center bg-rose-50/50 flex-1 flex flex-col justify-center">
              <XCircle className="w-12 h-12 text-rose-300 mx-auto mb-4" />
              <p className="text-sm font-bold text-rose-800">This conversation request has been declined.</p>
              <p className="text-xs text-rose-600/70 mt-1">Please reach out to another mentor or visit our resource hub.</p>
          </div>
      )}
    </div>
  );
}
