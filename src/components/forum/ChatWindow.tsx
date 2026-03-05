"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Circle, Loader2, Smile } from "lucide-react";
import { useEffect, useRef, useState, useCallback, useTransition } from "react";
import { getMessages, sendMessage } from "@/app/actions/forum";
import type { MessageData, ConversationWithPeer } from "@/app/actions/forum";
import { getAvatarColor, getInitials } from "./ConversationSidebar";

interface ChatWindowProps {
    conversation: ConversationWithPeer;
    currentUserId: string;
    onBack: () => void; // For mobile: go back to sidebar
}

function formatMessageTime(date: Date): string {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

function formatDateDivider(date: Date): string {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export function ChatWindow({ conversation, currentUserId, onBack }: ChatWindowProps) {
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [, startTransition] = useTransition();
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Fetch messages
    const fetchMessages = useCallback(async () => {
        const result = await getMessages(conversation.id);
        setMessages(
            result.map((m) => ({
                ...m,
                createdAt: new Date(m.createdAt),
            }))
        );
        setIsLoading(false);
    }, [conversation.id]);

    useEffect(() => {
        setIsLoading(true);
        setMessages([]);
        fetchMessages();

        // Poll every 3 seconds for new messages (real-time feel)
        pollingRef.current = setInterval(fetchMessages, 3000);
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [fetchMessages]);

    // Scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Send message
    const handleSend = async () => {
        const content = inputValue.trim();
        if (!content || isSending) return;

        // Optimistic UI update
        const optimisticMsg: MessageData = {
            id: `optimistic-${Date.now()}`,
            content,
            senderId: currentUserId,
            receiverId: conversation.peer.id,
            createdAt: new Date(),
            isRead: false,
        };
        setMessages((prev) => [...prev, optimisticMsg]);
        setInputValue("");
        setIsSending(true);
        inputRef.current?.focus();

        startTransition(async () => {
            const result = await sendMessage(conversation.id, conversation.peer.id, content);
            if (result.success && result.message) {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === optimisticMsg.id
                            ? { ...result.message!, createdAt: new Date(result.message!.createdAt) }
                            : m
                    )
                );
            } else {
                // Revert on failure
                setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
                setInputValue(content);
            }
            setIsSending(false);
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Auto-resize textarea
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    };

    // Group messages by date for date dividers
    const messageGroups: { date: string; messages: MessageData[] }[] = [];
    messages.forEach((msg) => {
        const date = formatDateDivider(msg.createdAt);
        const last = messageGroups[messageGroups.length - 1];
        if (last?.date === date) last.messages.push(msg);
        else messageGroups.push({ date, messages: [msg] });
    });

    const peerName = conversation.peer.name || conversation.peer.email;

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* ── Chat Header ── */}
            <div className="flex items-center gap-3 px-4 py-3.5 bg-white border-b border-gray-100 shadow-sm">
                {/* Mobile back button */}
                <button
                    onClick={onBack}
                    className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                {/* Peer Avatar */}
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(conversation.peer.id)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
                    {getInitials(conversation.peer.name, conversation.peer.email)}
                </div>

                {/* Peer Name & Status */}
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{peerName}</p>
                    <div className="flex items-center gap-1.5">
                        <Circle className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" />
                        <span className="text-xs text-emerald-600 font-semibold">Online</span>
                        <span className="text-gray-300 text-xs">·</span>
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${conversation.peer.role === "COUNSELLOR"
                                ? "bg-violet-100 text-violet-600"
                                : "bg-blue-100 text-blue-600"
                            }`}>
                            {conversation.peer.role === "COUNSELLOR" ? "Counsellor" : "Peer"}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Messages Area ── */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center h-full text-center pb-10"
                    >
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getAvatarColor(conversation.peer.id)} flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg`}>
                            {getInitials(conversation.peer.name, conversation.peer.email)}
                        </div>
                        <p className="font-bold text-gray-700 text-lg">{peerName}</p>
                        <p className="text-sm text-gray-400 mt-2 max-w-xs">
                            This is the beginning of your conversation. Say something kind 👋
                        </p>
                    </motion.div>
                ) : (
                    <>
                        {messageGroups.map((group) => (
                            <div key={group.date}>
                                {/* Date Divider */}
                                <div className="flex items-center gap-3 my-4">
                                    <div className="flex-1 h-px bg-gray-200" />
                                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2">{group.date}</span>
                                    <div className="flex-1 h-px bg-gray-200" />
                                </div>

                                {/* Message Bubbles */}
                                <div className="space-y-1.5">
                                    <AnimatePresence>
                                        {group.messages.map((msg, i) => {
                                            const isMine = msg.senderId === currentUserId;
                                            const showTime =
                                                i === group.messages.length - 1 ||
                                                new Date(group.messages[i + 1]?.createdAt).getTime() -
                                                new Date(msg.createdAt).getTime() >
                                                120000;

                                            return (
                                                <motion.div
                                                    key={msg.id}
                                                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div className={`max-w-[75%] sm:max-w-[60%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                                                        <div
                                                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isMine
                                                                    ? "bg-primary text-white rounded-br-md"
                                                                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
                                                                } ${msg.id.startsWith("optimistic") ? "opacity-75" : ""}`}
                                                        >
                                                            {msg.content}
                                                        </div>
                                                        {showTime && (
                                                            <span className={`text-[10px] mt-1 ${isMine ? "text-gray-400" : "text-gray-400"}`}>
                                                                {formatMessageTime(msg.createdAt)}
                                                                {isMine && (
                                                                    <span className="ml-1">
                                                                        {msg.id.startsWith("optimistic") ? "·" : msg.isRead ? "✓✓" : "✓"}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))}
                    </>
                )}
                <div ref={bottomRef} />
            </div>

            {/* ── Message Input Bar ── */}
            <div className="px-4 py-3 bg-white border-t border-gray-100">
                <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/40 transition-all">
                    <button className="p-1 text-gray-400 hover:text-primary transition-colors flex-shrink-0 mb-0.5">
                        <Smile className="w-5 h-5" />
                    </button>
                    <textarea
                        ref={inputRef}
                        rows={1}
                        value={inputValue}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Share your feelings..."
                        className="flex-1 bg-transparent resize-none text-sm text-gray-800 placeholder-gray-400 focus:outline-none max-h-28 py-1 leading-relaxed"
                    />
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isSending}
                        className="p-2 rounded-xl bg-primary text-white disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-sm hover:bg-primary/90 transition-all mb-0.5"
                    >
                        {isSending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </motion.button>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-2">
                    Press <kbd className="font-mono bg-gray-100 px-1 rounded">Enter</kbd> to send · <kbd className="font-mono bg-gray-100 px-1 rounded">Shift+Enter</kbd> for new line
                </p>
            </div>
        </div>
    );
}
