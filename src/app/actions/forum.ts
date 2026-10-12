"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ConversationStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ── Exported types consumed by forum/chat UI components ───────

export interface MessageData {
  id: string;
  content: string;
  senderId: string;          // senderStudentId or senderCounsellorId (normalised)
  receiverId: string;
  createdAt: Date;
  isRead: boolean;
}

export interface ConversationWithPeer {
  id: string;
  status: ConversationStatus;
  updatedAt: Date;
  peer: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    avatarUrl?: string | null;
    image?: string | null;
  };
  lastMessage: {
    content: string;
    senderId: string;
    createdAt: Date;
  } | null;
}


/**
 * Get all conversations for the current user.
 * Supports both students and counsellors.
 */
export async function getChatConversations() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const role = (session.user as any).role as Role;

  if (role === Role.COUNSELLOR) {
    return await db.conversation.findMany({
      where: { counsellor: { userId: session.user.id } },
      include: {
        student: { select: { id: true, name: true, image: true, email: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });
  } else {
    return await db.conversation.findMany({
      where: { studentId: session.user.id },
      include: {
        counsellor: { select: { id: true, name: true, avatarUrl: true, specialty: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });
  }
}

/**
 * Get full details of a single conversation.
 */
export async function getConversation(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return await db.conversation.findUnique({
    where: { id },
    include: {
      student: { select: { id: true, name: true, image: true } },
      counsellor: { select: { id: true, name: true, avatarUrl: true, userId: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
}

/**
 * Create or get a conversation between a student and a counsellor.
 * This is the primary entry point for starting a mentorship chat.
 */
export async function createConversation(counsellorId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  // In this system, only students can initiate chats with counsellors
  if ((session.user as any).role !== Role.STUDENT) {
    return { error: "Only students can initiate mentorship requests." };
  }

  try {
    const convo = await db.conversation.upsert({
      where: {
        studentId_counsellorId: {
          studentId: session.user.id,
          counsellorId: counsellorId,
        },
      },
      update: {}, // Don't change anything if it exists
      create: {
        studentId: session.user.id,
        counsellorId: counsellorId,
        status: ConversationStatus.PENDING,
      },
    });

    revalidatePath("/forum");
    return { convoId: convo.id };
  } catch (err) {
    console.error("Error creating conversation:", err);
    return { error: "Failed to create conversation." };
  }
}

/**
 * Initiate a chat between a student and a counsellor.
 * Sets status to PENDING.
 * @deprecated Use createConversation instead.
 */
export async function startChat(counsellorId: string) {
  return createConversation(counsellorId);
}

/**
 * Send a message within a conversation.
 */
export async function sendMessage(convoId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const convo = await db.conversation.findUnique({
    where: { id: convoId },
    include: { counsellor: true },
  });

  if (!convo) return { error: "Conversation not found" };

  const isStudent = convo.studentId === session.user.id;
  const isCounsellor = convo.counsellor.userId === session.user.id;

  if (!isStudent && !isCounsellor) return { error: "Unauthorized" };

  const data: any = {
    conversationId: convoId,
    content,
    isRead: false
  };

  if (isStudent) data.senderStudentId = session.user.id;
  else data.senderCounsellorId = convo.counsellorId;

  const msg = await db.message.create({ data });

  await db.conversation.update({
    where: { id: convoId },
    data: { updatedAt: new Date() },
  });

  revalidatePath("/forum");
  return { success: true, message: msg };
}

/**
 * Accept a pending chat request (Counsellor only).
 */
export async function acceptRequest(convoId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const convo = await db.conversation.findUnique({
    where: { id: convoId },
    include: { counsellor: true },
  });

  if (!convo || convo.counsellor.userId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  await db.conversation.update({
    where: { id: convoId },
    data: { status: ConversationStatus.ACCEPTED },
  });

  revalidatePath("/forum");
  return { success: true };
}

/**
 * Decline a pending chat request (Counsellor only).
 */
export async function denyRequest(convoId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const convo = await db.conversation.findUnique({
    where: { id: convoId },
    include: { counsellor: true },
  });

  if (!convo || convo.counsellor.userId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  await db.conversation.update({
    where: { id: convoId },
    data: { status: ConversationStatus.DECLINED },
  });

  revalidatePath("/forum");
  return { success: true };
}

// ── Alias: used by ForumClient.tsx ────────────────────────────

/**
 * Alias for getChatConversations, mapped to the ConversationWithPeer shape.
 * The UI components depend on a normalised `peer` object rather than
 * the raw counsellor/student split that getChatConversations returns.
 */
export async function getConversations(): Promise<ConversationWithPeer[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const role = (session.user as any).role as Role;

  if (role === Role.COUNSELLOR) {
    const rows = await db.conversation.findMany({
      where: { counsellor: { userId: session.user.id } },
      include: {
        student: { select: { id: true, name: true, email: true, image: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map((r) => ({
      id: r.id,
      status: r.status,
      updatedAt: r.updatedAt,
      peer: {
        id: r.student.id,
        name: r.student.name,
        email: r.student.email,
        role: "STUDENT",
        image: r.student.image,
      },
      lastMessage: r.messages[0]
        ? {
            content: r.messages[0].content,
            senderId: r.messages[0].senderStudentId ?? r.messages[0].senderCounsellorId ?? "",
            createdAt: r.messages[0].createdAt,
          }
        : null,
    }));
  } else {
    const rows = await db.conversation.findMany({
      where: { studentId: session.user.id },
      include: {
        counsellor: { select: { id: true, name: true, avatarUrl: true, specialty: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map((r) => ({
      id: r.id,
      status: r.status,
      updatedAt: r.updatedAt,
      peer: {
        id: r.counsellor.id,
        name: r.counsellor.name,
        email: "",
        role: "COUNSELLOR",
        avatarUrl: r.counsellor.avatarUrl,
      },
      lastMessage: r.messages[0]
        ? {
            content: r.messages[0].content,
            senderId: r.messages[0].senderStudentId ?? r.messages[0].senderCounsellorId ?? "",
            createdAt: r.messages[0].createdAt,
          }
        : null,
    }));
  }
}

/**
 * Create or fetch a conversation and return {success, conversationId}.
 * Used by ForumClient's "new chat" flow.
 */
export async function getOrCreateConversation(
  counsellorId: string
): Promise<{ success: boolean; conversationId?: string; error?: string }> {
  const result = await createConversation(counsellorId);
  if ("error" in result) return { success: false, error: result.error };
  return { success: true, conversationId: result.convoId };
}

/**
 * Fetch all messages for a conversation, normalised into MessageData shape.
 */
export async function getMessages(conversationId: string): Promise<MessageData[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const convo = await db.conversation.findUnique({
    where: { id: conversationId },
    include: {
      counsellor: { select: { userId: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!convo) return [];

  return convo.messages.map((m) => {
    const senderId = m.senderStudentId ?? m.senderCounsellorId ?? "";
    const receiverId =
      m.senderStudentId
        ? (convo.counsellor.userId ?? convo.counsellorId)
        : convo.studentId;
    return {
      id: m.id,
      content: m.content,
      senderId,
      receiverId,
      createdAt: m.createdAt,
      isRead: m.isRead,
    };
  });
}
