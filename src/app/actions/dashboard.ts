"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

// ── Fetch the last 7 mood logs for the current user ──────
export async function getRecentMoodLogs() {
    try {
        const session = await auth();
        if (!session?.user?.id) return [];

        const logs = await db.moodLog.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "asc" },
            take: 7,
            select: { moodScore: true, stressScore: true, createdAt: true },
        });

        return logs as { moodScore: number; stressScore: number | null; createdAt: Date }[];
    } catch (err) {
        console.error("[dashboard] Error fetching recent mood logs:", err);
        return [];
    }
}

// ── Log today's mood ──────────────────────────────────────
export async function logMood(moodScore: number, stressScore?: number) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Not authenticated" };

        await db.moodLog.create({
            data: {
                userId: session.user.id,
                moodScore,
                stressScore: stressScore ?? Math.round((11 - moodScore) * 10), // simple heuristic
            },
        });

        return { success: true };
    } catch (err) {
        console.error("[dashboard] Error logging mood:", err);
        return { success: false, error: "Failed to log mood." };
    }
}

// ── Get next upcoming booking for current student ─────────
export async function getUpcomingBooking() {
    try {
        const session = await auth();
        if (!session?.user?.id) return null;

        const booking = await db.booking.findFirst({
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
    } catch (err) {
        console.error("[dashboard] Error fetching upcoming booking:", err);
        return null;
    }
}

// ── Get list of available counsellors (for booking & therapist suggest) ──
export async function getAvailableCounsellors() {
    try {
        const counsellors = await db.user.findMany({
            where: { role: "COUNSELLOR" },
            select: { id: true, name: true, email: true },
            take: 5,
        });

        return counsellors as { id: string; name: string | null; email: string }[];
    } catch (err) {
        console.error("[dashboard] Error fetching available counsellors:", err);
        return [];
    }
}

// ── Book a new session ────────────────────────────────────
export async function bookSession(counsellorId: string, appointmentTime: Date, notes?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Not authenticated" };

        await db.booking.create({
            data: {
                studentId: session.user.id,
                counsellorId,
                appointmentTime,
                notes: notes ?? null,
            },
        });

        return { success: true };
    } catch (err) {
        console.error("[dashboard] Error booking session:", err);
        return { success: false, error: "Failed to book session." };
    }
}

// ── Get aggregated wellness stats ─────────────────────────
export async function getWellnessStats() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { moodsLogged: 0, resourcesRead: 0, sessions: 0, avgStress: null };

        const [moodsLogged, sessions] = await Promise.all([
            db.moodLog.count({ where: { userId: session.user.id } }),
            db.booking.count({
                where: { studentId: session.user.id, status: "COMPLETED" },
            }),
        ]);

        // Average stress from last 7 logs
        const recentLogs = await db.moodLog.findMany({
            where: { userId: session.user.id, stressScore: { not: null } },
            orderBy: { createdAt: "desc" },
            take: 7,
            select: { stressScore: true },
        });

        const avgStress = recentLogs.length
            ? Math.round(recentLogs.reduce((s: number, l: { stressScore: number | null }) => s + (l.stressScore ?? 0), 0) / recentLogs.length)
            : null;

        return { moodsLogged, resourcesRead: 5, sessions, avgStress };
    } catch (err) {
        console.error("[dashboard] Error getting wellness stats:", err);
        return { moodsLogged: 0, resourcesRead: 0, sessions: 0, avgStress: null };
    }
}
