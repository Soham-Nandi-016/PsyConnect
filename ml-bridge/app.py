from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'PsyConnect ML Bridge is running'})

@app.route('/predict-stress', methods=['POST'])
def predict_stress():
    """
    Placeholder for the stress prediction ML model.
    Expects JSON: { "text_input": "user's text to analyze" }
    """
    data = request.json
    text_input = data.get('text_input', '')
    
    # TODO: Replace with actual model inference
    # Mock response
    stress_level = "MODERATE"
    confidence = 0.85
    
    return jsonify({
        'stress_level': stress_level,
        'confidence': confidence,
        'suggestions': ['Take a 5-minute break', 'Listen to calming audio']
    })

@app.route('/detect-mood', methods=['POST'])
def detect_mood():
    """
    Placeholder for the NLP mood detection model.
    Expects JSON: { "journal_entry": "user's text" }
    """
    data = request.json
    entry = data.get('journal_entry', '')
    
    # TODO: Replace with actual model inference
    # Mock response
    detected_mood = "ANXIOUS"
    
    return jsonify({
        'detected_mood': detected_mood,
        'severity': 6
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
