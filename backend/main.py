# main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
import re

app = FastAPI()

# CORS setup for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the expected input model
class ComplaintRequest(BaseModel):
    text: str

# Load the zero-shot classifier
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Define categories
CATEGORIES = [
    "Internet/Wi-Fi Issue",
    "Portal Login Problem",
    "System Downtime",
    "Hardware Malfunction",
    "Software/Application Bug",
    "Email/Account Access Issue",
    "Access/Permission Issues"
]

# Define keyword-based urgency rules
HIGH_URGENCY_KEYWORDS = ["urgent", "asap", "immediately", "now", "critical", "emergency", "can't work"]
MEDIUM_URGENCY_KEYWORDS = ["soon", "important", "delay", "problem persists", "not working"]

# Utility functions

def detect_urgency(text):
    text = text.lower()
    if any(kw in text for kw in HIGH_URGENCY_KEYWORDS):
        return "High"
    elif any(kw in text for kw in MEDIUM_URGENCY_KEYWORDS):
        return "Medium"
    return "Low"

# Main route
@app.post("/analyze")
def analyze(request: ComplaintRequest):
    try:
        result = classifier(request.text, CATEGORIES)
        category = result["labels"][0]  # Best match
        urgency = detect_urgency(request.text)

        return {
            "category": category,
            "urgency": urgency
        }         

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
