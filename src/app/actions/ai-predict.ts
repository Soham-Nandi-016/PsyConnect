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
    moodTrend7D: number;         // average mood last 7 days (1–10)
}

export interface PredictResult {
    success: boolean;
    stressScore?: number;   // 0–100
    label?: string;         // "Low" | "Moderate" | "High"
    error?: string;
}

// ── Very naive sentiment: proportion of positive words → -1 to +1 ──
const POSITIVE = ["happy", "great", "good", "excited", "calm", "grateful", "joy", "love", "better", "peaceful", "proud", "confident", "motivated", "hopeful"];
const NEGATIVE = ["sad", "anxious", "stressed", "worried", "tired", "overwhelmed", "scared", "depressed", "hopeless", "angry", "lonely", "frustrated", "bad", "terrible"];

function simpleSentiment(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
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

    // Build the payload for Flask
    const payload = {
        Mood_Score: input.moodScore,
        Sleep_Duration: input.sleepDuration,
        Sleep_Latency: input.sleepLatency,
        Study_Load: input.studyLoad,
        Physical_Activity: input.physicalActivity,
        Social_Interaction: input.socialInteraction,
        Screen_Time: input.screenTime,
        Journal_Sentiment: journalSentiment,
        Financial_Stress: input.financialStress,
        Mood_Trend_7D: input.moodTrend7D,
        Age_Group: input.ageGroup,
    };

    let stressScore: number;
    let label: string;

    try {
        const mlUrl = process.env.ML_API_URL || "http://localhost:5000";
        const res = await fetch(`${mlUrl}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(8000), // 8s timeout
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.error ?? `HTTP ${res.status}`);
        }

        const result = await res.json();
        let baseStress = result.stress_score;

        // Weighted Prediction: Adjust score based on Sentiment Analysis
        if (journalSentiment < 0) {
            // Negative sentiment increases stress score significantly
            baseStress += Math.abs(journalSentiment) * 20;
        } else if (journalSentiment > 0) {
            // Positive sentiment relieves stress score mildly
            baseStress -= journalSentiment * 10;
        }

        stressScore = Math.min(100, Math.max(0, Math.round(baseStress)));
        label = stressScore < 35 ? "Low" : stressScore < 65 ? "Moderate" : "High";

    } catch (err) {
        // Flask is down — fall back to heuristic so the form still saves
        const heuristic = Math.round(
            (input.studyLoad * 8) +
            (10 - input.moodScore) * 5 +
            (input.financialStress * 4) +
            ((8 - input.sleepDuration) * 3) -
            (input.physicalActivity / 10) -
            (input.socialInteraction * 2)
        );
        stressScore = Math.min(100, Math.max(0, heuristic));
        label = stressScore < 35 ? "Low" : stressScore < 65 ? "Moderate" : "High";

        const isDown = err instanceof TypeError || (err instanceof Error && err.message.includes("fetch"));
        if (isDown) {
            // Still save with heuristic score, but flag AI as unavailable
            await saveLog(session.user.id, input.moodScore, stressScore);
            return {
                success: true,
                stressScore,
                label,
                error: "AI_DOWN", // client shows friendly message
            };
        }
        return { success: false, error: String(err) };
    }

    // Save to MoodLog
    await saveLog(session.user.id, input.moodScore, stressScore);

    return { success: true, stressScore, label };
}

async function saveLog(userId: string, moodScore: number, stressScore: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db.moodLog as any).create({
        data: { userId, moodScore, stressScore },
    });
}
