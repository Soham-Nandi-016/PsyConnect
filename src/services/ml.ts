// ML service wrapper — communicates with the Flask ML microservice
// The Flask app runs on port 5000 locally (or ML_SERVICE_URL in production)

const ML_BASE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

export interface WellnessPayload {
    Mood_Score: number;
    Sleep_Duration: number;
    Sleep_Latency: number;
    Study_Load: number;
    Physical_Activity: number;
    Social_Interaction: number;
    Screen_Time: number;
    Journal_Sentiment: number;
    Financial_Stress: number;
    Mood_Trend_7D: number;
    Age_Group: "18-20" | "21-23" | "24-26" | "27+";
}

export interface PredictResponse {
    stress_score: number;   // 0–100
    label: "Low" | "Moderate" | "High";
}

/**
 * Primary inference call — sends the 11-feature wellness payload to Flask
 * and returns the predicted stress score and label.
 */
export async function predictWellness(payload: WellnessPayload): Promise<PredictResponse> {
    const response = await fetch(`${ML_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`ML Service Error ${response.status}: ${(err as any).error ?? response.statusText}`);
    }

    return await response.json() as PredictResponse;
}

/**
 * @deprecated  Use predictWellness() instead.
 * Kept for backwards compatibility — returns a legacy-shaped response.
 */
export async function predictStressLevel(_textInput: string) {
    console.warn('[ml.ts] predictStressLevel is deprecated. Use predictWellness() instead.');
    return { stress_level: 'UNKNOWN', confidence: 0 };
}

/**
 * @deprecated  Use predictWellness() instead.
 */
export async function detectMood(_journalEntry: string) {
    console.warn('[ml.ts] detectMood is deprecated. Use predictWellness() instead.');
    return { detected_mood: 'UNKNOWN', severity: 0 };
}
