// Wrapper service for communicating with the Flask ML microservices
// The Flask app runs on port 5000 locally

const ML_BASE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

export async function predictStressLevel(textInput: string) {
    try {
        const response = await fetch(`${ML_BASE_URL}/predict-stress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text_input: textInput }),
        });

        if (!response.ok) {
            throw new Error(`ML Service Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to predict stress:', error);
        throw error;
    }
}

export async function detectMood(journalEntry: string) {
    try {
        const response = await fetch(`${ML_BASE_URL}/detect-mood`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ journal_entry: journalEntry }),
        });

        if (!response.ok) {
            throw new Error(`ML Service Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to detect mood:', error);
        throw error;
    }
}
