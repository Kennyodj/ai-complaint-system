from transformers import pipeline
import re
import joblib

# Load Hugging Face sentiment model
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# Define urgency-boosting keywords
keyword_urgency_boost = {
    "urgent": 1,
    "immediately": 1,
    "right now": 1,
    "asap": 1,
    "deadline": 1,
    "important": 0.5,
    "stuck": 0.5,
    "crash": 0.5,
    "error": 0.5,
    "frustrated": 0.5,
}

# Urgency Estimator Function
def estimate_urgency(text):
    sentiment_result = sentiment_analyzer(text)[0]
    sentiment = sentiment_result["label"]
    score = sentiment_result["score"]

    # Start from base urgency score
    if sentiment == "NEGATIVE":
        urgency = 3 + score  # ~3 to 5
    else:
        urgency = 1 + (1 - score)  # ~1 to 2

    # Boost score with keywords
    text_lower = text.lower()
    for keyword, boost in keyword_urgency_boost.items():
        if re.search(rf"\b{keyword}\b", text_lower):
            urgency += boost

    # Clamp the value between 1 and 5
    return round(min(max(urgency, 1), 5))

# Example usage
example = "I need this fixed immediately. It's urgent and I'm stuck."
print("Estimated urgency:", estimate_urgency(example))

# Save for backend use (e.g., FastAPI)
joblib.dump(estimate_urgency, "urgency_estimator_function.pkl")
