# 🛡️ NotByHuman — Transparent AI Text & Stylometric Detector

> An open-source, explainable AI text detection tool using stylometric features (perplexity, burstiness, vocabulary diversity, and structural patterns) + a calibrated ML classifier.

![NotByHuman Demo](https://raw.githubusercontent.com/placeholder/notbyhuman-banner.png)

## 📌 Motivation & Overview

Unlike generic AI detectors that act as black boxes returning arbitrary confidence numbers, **NotByHuman** reveals **why** a piece of text is flagged. It engineers explicit linguistic and stylometric features to distinguish AI-generated writing (e.g., ChatGPT, Claude, LLaMA) from human-written text.

### How it Works: The Stylometric Fingerprint
Even fluent AI-generated text leaves measurable statistical traces:
- **Perplexity (Predictability)**: AI models generate text by selecting high-probability next words. Human writing exhibits higher surprise and lower predictability.
- **Burstiness (Sentence Rhythm)**: Humans naturally vary sentence length—alternating short punchy sentences with long winding ones. AI text tends to maintain uniform sentence lengths.
- **Vocabulary Diversity (Type-Token Ratio & Yule's K)**: Measures word variation versus repetition.
- **AI Cliché Phrase Density**: Detects overused LLM transitions and filler words (*"furthermore", "delve", "tapestry", "crucial", "in conclusion"*).

---

## 🛠️ System Architecture

```
NotByHuman/
├── backend/                  # FastAPI REST API + ML Pipeline
│   ├── app/
│   │   ├── main.py           # REST Endpoints (/api/analyze, /api/upload)
│   │   ├── stylometrics.py   # Feature Extraction (PPL, Burstiness, TTR, Buzzwords)
│   │   ├── model.py          # Random Forest Classifier & Explainability Engine
│   │   └── utils.py          # Cleaners & Document Parsers (.txt, .docx)
│   ├── train.py              # Model Calibration & Training Script
│   └── requirements.txt      # Python Dependencies
└── frontend/                 # Vite + React Modern Web Application
    ├── src/
    │   ├── components/       # Gauge Meter, Feature Cards, Sentence Heatmap
    │   └── App.jsx
    └── vite.config.js
```

---

## 🚀 Quick Start (Local Setup)

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run backend API server
python run.py
# API running at: http://localhost:8000
```

### 2. Frontend Setup (React + Vite)

```bash
cd frontend

# Install node dependencies
npm install

# Run development server
npm run dev
# Web App running at: http://localhost:5173
```

---

## 🔬 Feature Engineering Breakdown

| Feature Metric | Description | Human Signature | AI Signature |
| :--- | :--- | :--- | :--- |
| **Burstiness (CV)** | Sentence length variance ($CV = \frac{\sigma}{\mu}$) | High variation (CV > 0.5) | Low/Uniform (CV < 0.25) |
| **Perplexity (PPL)** | Model sequence predictability | High PPL (> 70) | Low PPL (< 35) |
| **Type-Token Ratio (TTR)** | Ratio of unique words to total words | High TTR (> 0.65) | Low TTR (< 0.50) |
| **AI Phrase Density** | Occurrences of overused LLM clichés | 0.0% density | High density (> 1.5%) |

---

## ⚠️ Honest Limitations & Transparency

Detection accuracy in NLP is inherently probabilistic:
1. **Polished Human Writing**: Academic writing or formal essays can trigger low burstiness scores.
2. **Lightly Edited AI Text**: AI text manually edited to randomize sentence lengths can bypass stylometric filters.
3. **Sample Size**: Inputs require at least **30–50 words** for statistical stability.

---

## 📜 License

MIT License. Developed for portfolio demonstration and NLP stylometrics research.
