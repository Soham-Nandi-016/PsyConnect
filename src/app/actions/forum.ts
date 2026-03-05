"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ─── Types ─────────────────────────────────────────────────

export type ConversationWithPeer = {
    id: string;
    peer: {
        id: string;
        name: string | null;
        email: string;
        role: string;
    };
    lastMessage: {
        content: string;
        createdAt: Date;
        senderId: string;
    } | null;
    unreadCount: number;
    updatedAt: Date;
};

export type MessageData = {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: Date;
    isRead: boolean;
};

// ─── Get all conversations for the logged-in user ──────────

export async function getConversations(): Promise<ConversationWithPeer[]> {
    const session = await auth();
    if (!session?.user?.id) return [];
    const userId = session.user.id;

    const conversations = await db.conversation.findMany({
        where: {
            OR: [{ participantAId: userId }, { participantBId: userId }],
        },
        include: {
            participantA: { select: { id: true, name: true, email: true, role: true } },
            participantB: { select: { id: true, name: true, email: true, role: true } },
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1,
            },
        },
        orderBy: { updatedAt: "desc" },
    });

    return conversations.map((conv) => {
        const peer = conv.participantAId === userId ? conv.participantB : conv.participantA;
        const lastMessage = conv.messages[0] ?? null;

        return {
            id: conv.id,
            peer: {
                id: peer.id,
                name: peer.name,
                email: peer.email,
                role: peer.role,
            },
            lastMessage: lastMessage
                ? {
                    content: lastMessage.content,
                    createdAt: lastMessage.createdAt,
                    senderId: lastMessage.senderId,
                }
                : null,
            unreadCount: 0, // Simplified — can be computed if needed
            updatedAt: conv.updatedAt,
        };
    });
}

// ─── Get messages for a specific conversation ──────────────

export async function getMessages(conversationId: string): Promise<MessageData[]> {
    const session = await auth();
    if (!session?.user?.id) return [];

    // Confirm the user is a participant
    const conv = await db.conversation.findFirst({
        where: {
            id: conversationId,
            OR: [
                { participantAId: session.user.id },
                { participantBId: session.user.id },
            ],
        },
    });
    if (!conv) return [];

    const messages = await db.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        select: {
            id: true,
            content: true,
            senderId: true,
            receiverId: true,
            createdAt: true,
            isRead: true,
        },
    });

    // Mark unread messages as read
    await db.message.updateMany({
        where: {
            conversationId,
            receiverId: session.user.id,
            isRead: false,
        },
        data: { isRead: true },
    });

    return messages;
}

// ─── Send a message ────────────────────────────────────────

export async function sendMessage(
    conversationId: string,
    receiverId: string,
    content: string
): Promise<{ success: boolean; message?: MessageData; error?: string }> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Not authenticated." };
    }

    const trimmed = content.trim();
    if (!trimmed) return { success: false, error: "Message cannot be empty." };
    if (trimmed.length > 2000) return { success: false, error: "Message too long." };

    try {
        const message = await db.message.create({
            data: {
                conversationId,
                senderId: session.user.id,
                receiverId,
                content: trimmed,
            },
            select: {
                id: true,
                content: true,
                senderId: true,
                receiverId: true,
                createdAt: true,
                isRead: true,
            },
        });

        // Update conversation timestamp so it floats to top
        await db.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });

        revalidatePath("/forum");
        return { success: true, message };
    } catch (error) {
        console.error("sendMessage error:", error);
        return { success: false, error: "Failed to send message." };
    }
}

// ─── Get or create a conversation with a peer ─────────────

export async function getOrCreateConversation(
    peerId: string
): Promise<{ success: boolean; conversationId?: string; error?: string }> {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Not authenticated." };
    const userId = session.user.id;

    if (userId === peerId) return { success: false, error: "Cannot message yourself." };

    try {
        // Ensure consistent ordering — smaller ID is always participantA
        const [aId, bId] = userId < peerId ? [userId, peerId] : [peerId, userId];

        const conversation = await db.conversation.upsert({
            where: { participantAId_participantBId: { participantAId: aId, participantBId: bId } },
            create: { participantAId: aId, participantBId: bId },
            update: {},
        });

        return { success: true, conversationId: conversation.id };
    } catch (error) {
        console.error("getOrCreateConversation error:", error);
        return { success: false, error: "Failed to start conversation." };
    }
}

// ─── Get all users the current user can chat with ─────────

export async function getPeers(): Promise<
    { id: string; name: string | null; email: string; role: string }[]
> {
    const session = await auth();
    if (!session?.user?.id) return [];

    const users = await db.user.findMany({
        where: { NOT: { id: session.user.id } },
        select: { id: true, name: true, email: true, role: true },
        orderBy: { name: "asc" },
        take: 50,
    });

    return users;
}
