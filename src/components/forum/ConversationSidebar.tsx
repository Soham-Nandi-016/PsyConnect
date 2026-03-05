"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MessageSquare, Circle } from "lucide-react";
import { useState, useMemo } from "react";
import type { ConversationWithPeer } from "@/app/actions/forum";

interface ConversationSidebarProps {
    conversations: ConversationWithPeer[];
    currentUserId: string;
    activeConversationId: string | null;
    onSelectConversation: (conv: ConversationWithPeer) => void;
    onNewChat: () => void;
}

function timeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getInitials(name: string | null, email: string): string {
    if (name) return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    return email[0].toUpperCase();
}

function getAvatarColor(id: string): string {
    const colors = [
        "from-violet-400 to-purple-600",
        "from-blue-400 to-cyan-500",
        "from-emerald-400 to-teal-500",
        "from-rose-400 to-pink-500",
        "from-amber-400 to-orange-500",
        "from-indigo-400 to-blue-600",
    ];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
}

export function ConversationSidebar({
    conversations,
    currentUserId,
    activeConversationId,
    onSelectConversation,
    onNewChat,
}: ConversationSidebarProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = useMemo(() => {
        if (!searchQuery.trim()) return conversations;
        const q = searchQuery.toLowerCase();
        return conversations.filter(
            (c) =>
                c.peer.name?.toLowerCase().includes(q) ||
                c.peer.email.toLowerCase().includes(q)
        );
    }, [conversations, searchQuery]);

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100">
            {/* Header */}
            <div className="px-4 pt-5 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={onNewChat}
                        className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        title="Start new conversation"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>
                </div>
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto py-2">
                <AnimatePresence>
                    {filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-16 px-6 text-center"
                        >
                            <MessageSquare className="w-10 h-10 text-gray-300 mb-3" />
                            <p className="text-sm font-semibold text-gray-500">No conversations yet</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Click <strong>+</strong> to start chatting with a peer
                            </p>
                        </motion.div>
                    ) : (
                        filtered.map((conv, i) => {
                            const isActive = conv.id === activeConversationId;
                            const peerDisplay = conv.peer.name || conv.peer.email;
                            const lastMsg = conv.lastMessage;
                            const isLastMine = lastMsg?.senderId === currentUserId;

                            return (
                                <motion.button
                                    key={conv.id}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    onClick={() => onSelectConversation(conv)}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left cursor-pointer relative ${isActive ? "bg-primary/5 border-r-2 border-primary" : ""
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(conv.peer.id)} flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-sm relative`}>
                                        {getInitials(conv.peer.name, conv.peer.email)}
                                        {/* Online indicator */}
                                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
                                    </div>

                                    {/* Text content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className={`font-semibold text-sm truncate ${isActive ? "text-primary" : "text-gray-900"}`}>
                                                {peerDisplay}
                                            </span>
                                            {lastMsg && (
                                                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                                    {timeAgo(lastMsg.createdAt)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {isLastMine && lastMsg && (
                                                <span className="text-xs text-primary font-medium flex-shrink-0">You:</span>
                                            )}
                                            <p className="text-xs text-gray-500 truncate">
                                                {lastMsg ? lastMsg.content : (
                                                    <span className="italic text-gray-400">Start the conversation</span>
                                                )}
                                            </p>
                                        </div>
                                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded mt-0.5 inline-block ${conv.peer.role === "COUNSELLOR"
                                                ? "bg-violet-100 text-violet-600"
                                                : "bg-blue-100 text-blue-600"
                                            }`}>
                                            {conv.peer.role === "COUNSELLOR" ? "Counsellor" : "Peer"}
                                        </span>
                                    </div>
                                </motion.button>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── New Chat Modal ─────────────────────────────────────────

interface NewChatModalProps {
    peers: { id: string; name: string | null; email: string; role: string }[];
    onSelect: (peerId: string) => void;
    onClose: () => void;
}

export function NewChatModal({ peers, onSelect, onClose }: NewChatModalProps) {
    const [search, setSearch] = useState("");
    const filtered = peers.filter(
        (p) =>
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-5 pt-5 pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-lg mb-3">Start a Conversation</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search peers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </div>
                </div>
                <div className="max-h-72 overflow-y-auto py-2">
                    {filtered.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 py-8">No peers found</p>
                    ) : (
                        filtered.map((peer) => (
                            <button
                                key={peer.id}
                                onClick={() => onSelect(peer.id)}
                                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(peer.id)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                    {getInitials(peer.name, peer.email)}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">{peer.name || "Anonymous"}</p>
                                    <p className="text-xs text-gray-400">{peer.email}</p>
                                </div>
                                <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${peer.role === "COUNSELLOR" ? "bg-violet-100 text-violet-600" : "bg-blue-100 text-blue-600"
                                    }`}>
                                    {peer.role === "COUNSELLOR" ? "Counsellor" : "Peer"}
                                </span>
                            </button>
                        ))
                    )}
                </div>
                <div className="px-5 py-3 border-t border-gray-100">
                    <button onClick={onClose} className="w-full text-sm font-medium text-gray-500 hover:text-gray-700 py-1">
                        Cancel
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Small helpers ──────────────────────────────────────────
export { getAvatarColor, getInitials, timeAgo };
export type { Circle };
