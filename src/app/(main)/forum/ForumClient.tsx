"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";
import { ConversationSidebar, NewChatModal } from "@/components/forum/ConversationSidebar";
import { ChatWindow } from "@/components/forum/ChatWindow";
import { getConversations, getOrCreateConversation } from "@/app/actions/forum";
import type { ConversationWithPeer } from "@/app/actions/forum";

interface ForumClientProps {
    initialConversations: ConversationWithPeer[];
    peers: { id: string; name: string | null; email: string; role: string }[];
    currentUserId: string;
    currentUserName: string;
}

export function ForumClient({
    initialConversations,
    peers,
    currentUserId,
    currentUserName,
}: ForumClientProps) {
    const [conversations, setConversations] = useState<ConversationWithPeer[]>(initialConversations);
    const [activeConversation, setActiveConversation] = useState<ConversationWithPeer | null>(null);
    const [showNewChat, setShowNewChat] = useState(false);
    const [mobileView, setMobileView] = useState<"sidebar" | "chat">("sidebar");

    // Re-fetch conversations periodically to reflect new messages in sidebar
    const refreshConversations = useCallback(async () => {
        const updated = await getConversations();
        setConversations(updated);
    }, []);

    useEffect(() => {
        const interval = setInterval(refreshConversations, 5000);
        return () => clearInterval(interval);
    }, [refreshConversations]);

    const handleSelectConversation = (conv: ConversationWithPeer) => {
        setActiveConversation(conv);
        setMobileView("chat");
    };

    const handleBack = () => {
        setMobileView("sidebar");
        setActiveConversation(null);
    };

    const handleNewChatSelect = async (peerId: string) => {
        setShowNewChat(false);
        const result = await getOrCreateConversation(peerId);
        if (result.success && result.conversationId) {
            await refreshConversations();
            // Find and select the newly created conversation
            const updated = await getConversations();
            setConversations(updated);
            const conv = updated.find((c) => c.id === result.conversationId);
            if (conv) handleSelectConversation(conv);
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
            {/* ── Left Sidebar ── */}
            <motion.div
                initial={false}
                className={`
          ${mobileView === "sidebar" ? "flex" : "hidden"}
          md:flex flex-col
          w-full md:w-80 lg:w-96 flex-shrink-0
          border-r border-gray-200 bg-white
          overflow-hidden
        `}
            >
                <ConversationSidebar
                    conversations={conversations}
                    currentUserId={currentUserId}
                    activeConversationId={activeConversation?.id ?? null}
                    onSelectConversation={handleSelectConversation}
                    onNewChat={() => setShowNewChat(true)}
                />
            </motion.div>

            {/* ── Right Chat Pane ── */}
            <div className={`
        ${mobileView === "chat" ? "flex" : "hidden"}
        md:flex flex-col flex-1 overflow-hidden
      `}>
                {activeConversation ? (
                    <ChatWindow
                        key={activeConversation.id}
                        conversation={activeConversation}
                        currentUserId={currentUserId}
                        onBack={handleBack}
                    />
                ) : (
                    // Empty State — shown on desktop when no conversation is selected
                    <EmptyState
                        userName={currentUserName}
                        onNewChat={() => setShowNewChat(true)}
                    />
                )}
            </div>

            {/* ── New Chat Modal ── */}
            <AnimatePresence>
                {showNewChat && (
                    <NewChatModal
                        peers={peers}
                        onSelect={handleNewChatSelect}
                        onClose={() => setShowNewChat(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Empty State ────────────────────────────────────────────
function EmptyState({
    userName,
    onNewChat,
}: {
    userName: string;
    onNewChat: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-center px-8 bg-gray-50"
        >
            {/* Illustration */}
            <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-inner">
                    <MessageSquare className="w-16 h-16 text-primary/60" />
                </div>
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                    className="absolute -top-2 -right-2 w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center"
                >
                    <Sparkles className="w-5 h-5 text-secondary" />
                </motion.div>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
                Welcome, {userName.split(" ")[0]} 👋
            </h2>
            <p className="text-gray-500 max-w-sm text-sm leading-relaxed mb-8">
                This is your safe space to connect with peers and mentors.
                Select a conversation on the left, or start a new one — you&apos;re not alone.
            </p>

            <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                whileTap={{ scale: 0.97 }}
                onClick={onNewChat}
                className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-bold text-base shadow-lg hover:bg-primary/90 transition-all"
            >
                <MessageSquare className="w-5 h-5" />
                Start a Conversation
            </motion.button>
        </motion.div>
    );
}
