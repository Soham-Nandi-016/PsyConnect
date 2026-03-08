"""
PsyConnect ML Bridge — Flask API
POST /predict  →  accepts 11-feature JSON, returns stress_score (0–100)
"""

import os
import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ── Load model and scaler at startup ──────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    with open(os.path.join(BASE_DIR, "psyconnect_model.pkl"), "rb") as f:
        model = pickle.load(f)
    with open(os.path.join(BASE_DIR, "scaler.pkl"), "rb") as f:
        scaler = pickle.load(f)
    MODEL_LOADED = True
    print("✅  Model and scaler loaded successfully.")
except Exception as e:
    MODEL_LOADED = False
    print(f"⚠️  Could not load model: {e}")

# Age-group string → integer encoding
AGE_GROUP_MAP = {
    "18-20": 0,
    "21-23": 1,
    "24-26": 2,
    "27+":   3,
}

# Feature order must match training data exactly
FEATURE_ORDER = [
    "Mood_Score",
    "Sleep_Duration",
    "Sleep_Latency",
    "Study_Load",
    "Physical_Activity",
    "Social_Interaction",
    "Screen_Time",
    "Journal_Sentiment",
    "Financial_Stress",
    "Mood_Trend_7D",
    "Age_Group",
]


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": MODEL_LOADED})


@app.route("/predict", methods=["POST"])
def predict():
    """
    POST /predict
    Body (JSON):
    {
        "Mood_Score":        float  1–10
        "Sleep_Duration":    float  hours (0–12)
        "Sleep_Latency":     float  minutes to fall asleep (0–90)
        "Study_Load":        int    1–10
        "Physical_Activity": int    minutes/day (0–180)
        "Social_Interaction":int    1–10
        "Screen_Time":       float  hours/day (0–16)
        "Journal_Sentiment": float  -1.0 to +1.0
        "Financial_Stress":  int    1–10
        "Mood_Trend_7D":     float  average mood last 7 days (1–10)
        "Age_Group":         str    "18-20" | "21-23" | "24-26" | "27+"
    }
    Returns:
    {
        "stress_score": int  0–100
        "label":        str  "Low" | "Moderate" | "High"
    }
    """
    if not MODEL_LOADED:
        return jsonify({"error": "Model not loaded"}), 503

    data = request.get_json(force=True)
    if not data:
        return jsonify({"error": "No JSON body received"}), 400

    # Validate & extract features
    try:
        age_raw = data.get("Age_Group", "21-23")
        age_int = AGE_GROUP_MAP.get(str(age_raw), 1)  # default 21-23

        feature_values = []
        for feat in FEATURE_ORDER:
            if feat == "Age_Group":
                feature_values.append(age_int)
            else:
                val = data.get(feat)
                if val is None:
                    return jsonify({"error": f"Missing feature: {feat}"}), 400
                feature_values.append(float(val))

        X = np.array(feature_values).reshape(1, -1)
    except (TypeError, ValueError) as e:
        return jsonify({"error": f"Invalid feature data: {e}"}), 400

    # Scale → predict
    try:
        X_scaled = scaler.transform(X)
        raw = model.predict(X_scaled)[0]

        # Normalise to 0–100.  Model may output 0–10 or 0–1.
        if raw <= 1.0:
            stress_score = int(round(raw * 100))
        elif raw <= 10:
            stress_score = int(round(raw * 10))
        else:
            stress_score = int(round(min(max(raw, 0), 100)))

        label = "Low" if stress_score < 35 else ("Moderate" if stress_score < 65 else "High")

        return jsonify({"stress_score": stress_score, "label": label})

    except Exception as e:
        return jsonify({"error": f"Prediction failed: {e}"}), 500


# ── Legacy endpoints kept for compatibility ──────────────────
@app.route("/predict-stress", methods=["POST"])
def predict_stress_legacy():
    return jsonify({"stress_level": "MODERATE", "confidence": 0.85})


@app.route("/detect-mood", methods=["POST"])
def detect_mood_legacy():
    return jsonify({"detected_mood": "ANXIOUS", "severity": 6})


if __name__ == "__main__":
    app.run(port=5000, debug=True)
