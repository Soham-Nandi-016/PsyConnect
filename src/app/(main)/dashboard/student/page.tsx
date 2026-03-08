export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
    getRecentMoodLogs,
    getUpcomingBooking,
    getAvailableCounsellors,
} from "@/app/actions/dashboard";
import { StudentDashboardClient } from "./StudentDashboardClient";

const REFLECTION_PROMPTS = [
    "What is one thing you are grateful for today?",
    "Name one small win you had this week, no matter how tiny.",
    "What is something kind you did — or could do — for yourself right now?",
    "What emotion are you carrying most right now? Can you name it?",
    "What would you tell a friend who felt the way you feel today?",
    "What is one thing you can put down — worry, task, or expectation — right now?",
    "What does \u2018enough\u2019 look like for you today?",
];

export default async function StudentDashboardPage() {
    // ── Hard auth guard — no session = no access ──────────────
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth/signin?callbackUrl=/dashboard/student");
    }

    // ── Fetch the REAL name directly from the DB ──────────────
    // This prevents stale JWT from showing a wrong/old name
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbUser = await (db.user as any).findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, role: true },
    });

    if (!dbUser) {
        redirect("/auth/signin");
    }

    const userName: string =
        dbUser.name?.trim() ||
        dbUser.email?.split("@")[0] ||
        "Friend";

    const userRole: string = dbUser.role ?? "STUDENT";
    const todayPrompt = REFLECTION_PROMPTS[new Date().getDay()];

    // ── Pre-fetch dashboard data in parallel ──────────────────
    const [moodLogs, upcomingBooking, counsellors] = await Promise.all([
        getRecentMoodLogs(),
        getUpcomingBooking(),
        getAvailableCounsellors(),
    ]);

    return (
        <StudentDashboardClient
            userName={userName}
            userRole={userRole}
            moodLogs={moodLogs}
            upcomingBooking={upcomingBooking}
            counsellors={counsellors}
            todayPrompt={todayPrompt}
        />
    );
}
