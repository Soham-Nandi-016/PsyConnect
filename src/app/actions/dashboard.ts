"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

// ── Fetch the last 7 mood logs for the current user ──────
export async function getRecentMoodLogs() {
    const session = await auth();
    if (!session?.user?.id) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logs = await (db.moodLog as any).findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "asc" },
        take: 7,
        select: { moodScore: true, stressScore: true, createdAt: true },
    });

    return logs as { moodScore: number; stressScore: number | null; createdAt: Date }[];
}

// ── Log today's mood ──────────────────────────────────────
export async function logMood(moodScore: number, stressScore?: number) {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db.moodLog as any).create({
        data: {
            userId: session.user.id,
            moodScore,
            stressScore: stressScore ?? Math.round((11 - moodScore) * 10), // simple heuristic
        },
    });

    return { success: true };
}

// ── Get next upcoming booking for current student ─────────
export async function getUpcomingBooking() {
    const session = await auth();
    if (!session?.user?.id) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const booking = await (db.booking as any).findFirst({
        where: {
            studentId: session.user.id,
            appointmentTime: { gte: new Date() },
            status: { in: ["PENDING", "CONFIRMED"] },
        },
        orderBy: { appointmentTime: "asc" },
        include: {
            counsellor: { select: { name: true, email: true } },
        },
    });

    return booking as {
        id: string;
        appointmentTime: Date;
        status: string;
        notes: string | null;
        counsellor: { name: string | null; email: string };
    } | null;
}

// ── Get list of available counsellors (for booking & therapist suggest) ──
export async function getAvailableCounsellors() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const counsellors = await (db.user as any).findMany({
        where: { role: "COUNSELLOR" },
        select: { id: true, name: true, email: true },
        take: 5,
    });

    return counsellors as { id: string; name: string | null; email: string }[];
}

// ── Book a new session ────────────────────────────────────
export async function bookSession(counsellorId: string, appointmentTime: Date, notes?: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Not authenticated" };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db.booking as any).create({
        data: {
            studentId: session.user.id,
            counsellorId,
            appointmentTime,
            notes: notes ?? null,
        },
    });

    return { success: true };
}

// ── Get aggregated wellness stats ─────────────────────────
export async function getWellnessStats() {
    const session = await auth();
    if (!session?.user?.id) return { moodsLogged: 0, resourcesRead: 0, sessions: 0, avgStress: null };

    const [moodsLogged, sessions] = await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (db.moodLog as any).count({ where: { userId: session.user.id } }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (db.booking as any).count({
            where: { studentId: session.user.id, status: "COMPLETED" },
        }),
    ]);

    // Average stress from last 7 logs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentLogs = await (db.moodLog as any).findMany({
        where: { userId: session.user.id, stressScore: { not: null } },
        orderBy: { createdAt: "desc" },
        take: 7,
        select: { stressScore: true },
    });

    const avgStress = recentLogs.length
        ? Math.round(recentLogs.reduce((s: number, l: { stressScore: number }) => s + l.stressScore, 0) / recentLogs.length)
        : null;

    return { moodsLogged, resourcesRead: 5, sessions, avgStress };
}
