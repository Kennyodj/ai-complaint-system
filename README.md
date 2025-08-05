# 🧠 AI-Driven IT Complaint Management System

This is a full-stack web application that uses **AI (Zero-Shot Classification with BERT)** to intelligently classify IT complaints, assess their urgency, and help admins resolve them efficiently.

---

## 🚀 Features

### 👨‍💼 For Users:
- Submit IT-related complaints with a simple form
- Auto-categorization by AI (e.g., "Wi-Fi Issue", "Login Problem")
- Auto-urgency detection (Low / Medium / High)
- View personal complaint history

### 🛠️ For Admins:
- View all complaints in real time
- Filter by urgency (High/Medium/Low)
- Update complaint status
- Add admin remarks
- Export complaints as CSV
- Color-coded urgency and status badges

---

## 🧠 AI Classifier

Uses a **zero-shot classification model**:  
Model: `facebook/bart-large-mnli`

- **Category Detection:** Uses label-matching to classify complaints into:
  - Internet/Wi-Fi Issue
  - Portal Login Problem
  - System Downtime
  - Hardware Malfunction
  - Software/Application Bug
  - Email/Account Access Issue
  - Access/Permission Issues

- **Urgency Detection:** Rule-based using urgency keywords like `urgent`, `now`, `delay`, etc.

---

## 🖼 Screenshots

| User Submit Page | Complaint Dashboard |
|------------------|---------------------|
| ![Submit Complaint](/screenshots/user-submit.png) | ![User Dashboard](/screenshots/user-dashboard.png) |

| Admin Dashboard | Complaint Card |
|------------------|----------------|
| ![Admin Dashboard](/screenshots/admin-dashboard.png) | ![Admin Urgency View](/screenshots/admin-urgency.png) |

> ℹ️ Place all screenshots inside `frontend/public/screenshots/`

---

## 🛠 Tech Stack

| Area        | Tech Used                 |
|-------------|---------------------------|
| Frontend    | React (Vite), Tailwind CSS |
| Backend     | FastAPI, Transformers      |
| AI Model    | facebook/bart-large-mnli   |
| Database    | Firebase Firestore         |
| Auth        | Firebase Authentication    |
| Export      | CSV Generator (JS)         |

---

## 🧪 How to Rugn Locally

### 🔹 Backend (FastAPI)
```bash
cd backend
uvicorn main:app --reload
