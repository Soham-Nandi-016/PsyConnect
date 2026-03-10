"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { BookingStatus, Specialty } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ── Types re-exported for the UI ─────────────────────────────
export type { Specialty };

export interface CounsellorSummary {
    id: string;
    name: string;
    bio: string;
    specialty: Specialty;
    rating: number;
    yearsExp: number;
    avatarUrl: string | null;
    topFeedback: string | null;   // first testimonial text
}

export interface CounsellorFull extends CounsellorSummary {
    qualifications: string[];     // parsed from JSON
    philosophy: string;
    videoUrl: string | null;
    availability: { dayOfWeek: number; startHour: number; endHour: number }[];
    testimonials: { studentName: string; text: string; rating: number }[];
}

export interface BookingResult {
    success: boolean;
    error?: string;
    bookingId?: string;
}

// ── Helpers ───────────────────────────────────────────────────
function toSummary(c: {
    id: string; name: string; bio: string; specialty: Specialty;
    rating: number; yearsExp: number; avatarUrl: string | null;
    testimonials: { text: string }[];
}): CounsellorSummary {
    return {
        id: c.id, name: c.name, bio: c.bio, specialty: c.specialty,
        rating: c.rating, yearsExp: c.yearsExp, avatarUrl: c.avatarUrl,
        topFeedback: c.testimonials[0]?.text ?? null,
    };
}

// ── Server Actions ─────────────────────────────────────────────

/** Fetch all counsellors, optionally filtered by specialty or search query */
export async function getCounsellors(
    specialty?: Specialty | "ALL",
    query?: string,
): Promise<CounsellorSummary[]> {
    const rows = await db.counsellor.findMany({
        where: {
            ...(specialty && specialty !== "ALL" ? { specialty } : {}),
            ...(query
                ? {
                    OR: [
                        { name: { contains: query } },
                        { bio: { contains: query } },
                    ],
                }
                : {}),
        },
        orderBy: { rating: "desc" },
        include: { testimonials: { take: 1, orderBy: { rating: "desc" } } },
    });
    return rows.map(toSummary);
}

/** Fetch a single counsellor's full profile */
export async function getCounsellorById(id: string): Promise<CounsellorFull | null> {
    const c = await db.counsellor.findUnique({
        where: { id },
        include: {
            availability: true,
            testimonials: { orderBy: { rating: "desc" } },
        },
    });
    if (!c) return null;

    let qualifications: string[] = [];
    try { qualifications = JSON.parse(c.qualifications) as string[]; } catch { qualifications = []; }

    return {
        ...toSummary({ ...c, testimonials: c.testimonials }),
        qualifications,
        philosophy: c.philosophy,
        videoUrl: c.videoUrl,
        availability: c.availability.map(a => ({
            dayOfWeek: a.dayOfWeek,
            startHour: a.startHour,
            endHour: a.endHour,
        })),
        testimonials: c.testimonials.map(t => ({
            studentName: t.studentName,
            text: t.text,
            rating: t.rating,
        })),
    };
}

/** Get already-booked slots for a counsellor on a specific date */
export async function getBookedSlots(
    counsellorId: string,
    date: Date,
): Promise<Date[]> {
    const start = new Date(date); start.setHours(0, 0, 0, 0);
    const end = new Date(date); end.setHours(23, 59, 59, 999);

    const bookings = await db.therapyBooking.findMany({
        where: {
            counsellorId,
            appointmentTime: { gte: start, lte: end },
            status: { not: BookingStatus.CANCELLED },
        },
        select: { appointmentTime: true },
    });
    return bookings.map(b => b.appointmentTime);
}

/** Create a therapy booking */
export async function bookTherapist(
    counsellorId: string,
    appointmentTime: Date,
    studentNotes: string,
): Promise<BookingResult> {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Please sign in to book a session." };

    // Check slot is not already taken
    const conflict = await db.therapyBooking.findFirst({
        where: {
            counsellorId,
            appointmentTime,
            status: { not: BookingStatus.CANCELLED },
        },
    });
    if (conflict) return { success: false, error: "This slot was just taken. Please choose another time." };

    // Ensure appointment is in the future
    if (appointmentTime <= new Date()) return { success: false, error: "Please select a future time slot." };

    const booking = await db.therapyBooking.create({
        data: {
            studentId: session.user.id,
            counsellorId,
            appointmentTime,
            studentNotes: studentNotes.trim() || null,
            status: BookingStatus.PENDING,
        },
    });

    revalidatePath(`/therapy/${counsellorId}`);
    return { success: true, bookingId: booking.id };
}
