"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

// ── Types ────────────────────────────────────────────────────
export interface WellnessInput {
    // Step 1 — Mood & Journal
    moodScore: number;           // 1–10
    journalEntry: string;        // free text → sentiment

    // Step 2 — Sleep
    sleepDuration: number;       // hours (0–12)
    sleepLatency: number;        // minutes to fall asleep (0–90)

    // Step 3 — Academic & Life
    studyLoad: number;           // 1–10
    socialInteraction: number;   // 1–10
    financialStress: number;     // 1–10

    // Step 4 — Habits
    physicalActivity: number;    // minutes/day (0–180)
    screenTime: number;          // hours/day (0–16)

    // Meta
    ageGroup: "18-20" | "21-23" | "24-26" | "27+";
    moodTrend7D: number;         // average mood last 7 days (1–10) or trend delta
}

export interface PredictResult {
    success: boolean;
    stressScore?: number;   // 0–100
    label?: string;         // "Low" | "Moderate" | "High"
    error?: string;
}

// ── Naive sentiment: proportion of positive words → -1.0 to +1.0 ──
const POSITIVE = ["happy", "great", "good", "excited", "calm", "grateful", "joy", "love", "better", "peaceful", "proud", "confident", "motivated", "hopeful"];
const NEGATIVE = ["sad", "anxious", "stressed", "worried", "tired", "overwhelmed", "scared", "depressed", "hopeless", "angry", "lonely", "frustrated", "bad", "terrible"];

function simpleSentiment(text: string): number {
    if (!text || !text.trim()) return 0;
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return 0;
    const pos = words.filter(w => POSITIVE.some(p => w.includes(p))).length;
    const neg = words.filter(w => NEGATIVE.some(n => w.includes(n))).length;
    const total = pos + neg;
    if (!total) return 0;
    return parseFloat(((pos - neg) / total).toFixed(2));
}

// ── Main Server Action ───────────────────────────────────────
export async function predictAndSave(input: WellnessInput): Promise<PredictResult> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "Not authenticated" };
    }

    const journalSentiment = simpleSentiment(input.journalEntry);

    // The ML model feature Mood_Trend_7D is the delta (current mood - 7D average) centered near 0.0
    // If input.moodTrend7D is passed as a 1-10 average, compute current - average; otherwise keep as delta.
    const trendDelta =
        input.moodTrend7D > 1.0 || input.moodTrend7D < -1.0
            ? parseFloat((input.moodScore - input.moodTrend7D).toFixed(2))
            : (input.moodTrend7D ?? 0);

    // Build the payload for Flask microservice (keys match FEATURE_ORDER in app.py)
    const payload = {
        Age_Group: input.ageGroup,
        Mood_Score: input.moodScore,
        Sleep_Duration: input.sleepDuration,
        Sleep_Latency: input.sleepLatency,
        Study_Load: input.studyLoad,
        Physical_Activity: input.physicalActivity,
        Social_Interaction: input.socialInteraction,
        Screen_Time: input.screenTime,
        Journal_Sentiment: journalSentiment,
        Financial_Stress: input.financialStress,
        Mood_Trend_7D: trendDelta,
    };

    let stressScore: number;
    let label: string;

    try {
        const mlUrl = process.env.ML_API_URL || process.env.ML_SERVICE_URL || "http://127.0.0.1:5000";
        let res: Response;

        try {
            res = await fetch(`${mlUrl}/predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(8000), // 8s timeout
            });
        } catch (fetchErr) {
            // Windows Node 18+ resolves 'localhost' to IPv6 [::1] first. If Flask binds to IPv4, retry on 127.0.0.1
            if (mlUrl.includes("localhost")) {
                const fallbackUrl = mlUrl.replace("localhost", "127.0.0.1");
                res = await fetch(`${fallbackUrl}/predict`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                    signal: AbortSignal.timeout(8000),
                });
            } else {
                throw fetchErr;
            }
        }

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.error ?? `HTTP ${res.status}`);
        }

        const result = await res.json();
        stressScore = result.stress_score;
        label = result.label ?? (stressScore < 35 ? "Low" : stressScore < 65 ? "Moderate" : "High");

    } catch (err) {
        console.warn("[ai-predict] ML service unavailable, using calibrated heuristic fallback:", err);
        // Flask is down — fall back to heuristic so the student check-in still saves
        const heuristic = Math.round(
            (input.studyLoad * 5) +
            (10 - input.moodScore) * 4 +
            (input.financialStress * 3) +
            ((8 - input.sleepDuration) * 2) -
            (input.physicalActivity / 15) -
            (input.socialInteraction * 1.5)
        );
        stressScore = Math.min(100, Math.max(0, heuristic));
        label = stressScore < 35 ? "Low" : stressScore < 65 ? "Moderate" : "High";

        const isDown =
            err instanceof TypeError ||
            (err instanceof Error && (
                err.message.includes("fetch") ||
                err.name === "TimeoutError" ||
                err.name === "AbortError" ||
                err.message.includes("ECONNREFUSED") ||
                err.message.includes("abort")
            ));

        if (isDown) {
            // Still save with heuristic score, but flag AI as unavailable
            await saveLog(session.user.id, input.moodScore, stressScore);
            return {
                success: true,
                stressScore,
                label,
                error: "AI_DOWN", // client shows friendly fallback indicator
            };
        }
        return { success: false, error: String(err) };
    }

    // Save to MoodLog
    await saveLog(session.user.id, input.moodScore, stressScore);

    return { success: true, stressScore, label };
}

async function saveLog(userId: string, moodScore: number, stressScore: number) {
    try {
        await db.moodLog.create({
            data: { userId, moodScore, stressScore },
        });
    } catch (err) {
        console.error("[ai-predict] Failed to save mood log to database:", err);
    }
}
