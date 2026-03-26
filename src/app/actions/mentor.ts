"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { BookingStatus, ConversationStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getMentorDashboardData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // 1. Get Counsellor Profile
  const counsellor = await db.counsellor.findUnique({
    where: { userId: session.user.id },
  });

  if (!counsellor) return null;

  // 2. Fetch Pending Therapy Bookings (Appointments)
  const pendingRequests = await db.therapyBooking.findMany({
    where: {
      counsellorId: counsellor.id,
      status: BookingStatus.PENDING,
    },
    include: {
      student: { select: { id: true, name: true, image: true, createdAt: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // 3. Fetch Active Mentees (Conversations)
  const activeMentees = await db.conversation.findMany({
    where: {
      counsellorId: counsellor.id,
      status: ConversationStatus.ACCEPTED,
    },
    include: {
      student: { select: { id: true, name: true, image: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
    take: 3,
  });

  // 4. Calculate Stats
  const activeCount = await db.conversation.count({
    where: { counsellorId: counsellor.id, status: ConversationStatus.ACCEPTED },
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sessionsThisMonth = await db.message.count({
    where: {
      senderCounsellorId: counsellor.id,
      createdAt: { gte: thirtyDaysAgo },
    },
  });

  return {
    counsellorId: counsellor.id,
    pendingRequests,
    activeMentees,
    stats: {
      activeMentees: activeCount,
      sessionsThisMonth: sessionsThisMonth,
      rating: counsellor.rating,
    },
  };
}

export async function acceptBooking(bookingId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const booking = await db.therapyBooking.findUnique({
      where: { id: bookingId },
      include: { counsellor: true },
    });

    if (!booking) return { error: "Booking not found" };

    // Update booking status
    await db.therapyBooking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CONFIRMED },
    });

    // Create or Open Conversation
    const conversation = await db.conversation.upsert({
      where: {
        studentId_counsellorId: {
          studentId: booking.studentId,
          counsellorId: booking.counsellorId,
        },
      },
      update: {
        status: ConversationStatus.ACCEPTED,
      },
      create: {
        studentId: booking.studentId,
        counsellorId: booking.counsellorId,
        status: ConversationStatus.ACCEPTED,
      },
    });

    revalidatePath("/mentor/dashboard");
    revalidatePath("/forum");
    return { success: true, conversationId: conversation.id };
  } catch (err) {
    console.error("Error accepting booking:", err);
    return { error: "Failed to accept booking." };
  }
}
