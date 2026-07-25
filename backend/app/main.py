import os
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from app.stylometrics import StylometricExtractor
from app.model import NotByHumanClassifier
from app.utils import clean_text, count_words, parse_txt_file, parse_docx_file, parse_image_file

app = FastAPI(
    title="NotByHuman API",
    description="Stylometric AI Text & Plagiarism Detector REST API",
    version="1.0.0"
)

# Enable CORS for local frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

extractor = StylometricExtractor(use_gpt2=True)
classifier = NotByHumanClassifier()

SAMPLE_TEXTS = {
    "human": {
        "title": "Personal Reflections on Urban Architecture (Human)",
        "text": """Walking through the old quarter of Montreal on a chilly November dusk always makes me think about how buildings hold memory. The cobblestones underfoot are slick with early evening mist, and the flickering streetlamps cast long, distorted shadows across granite facades. I remember stopping outside a small bakery near Saint-Denis—the smell of fresh cardamom and espresso drifting out through a heavy wooden door. It wasn't planned; I just stumbled in to escape the wind. That's what I love about older cities: they force you into unscripted moments. Modern suburban grids lack that accidental poetry. Everything is zoned, separated, and sanitized until all spontaneous life gets filtered out."""
    },
    "ai": {
        "title": "The Evolution of Urban Architecture (AI - GPT-4)",
        "text": """Furthermore, urban architecture serves as a testament to the ever-evolving interplay between human innovation and societal needs. In conclusion, it is important to note that modern city planning plays a pivotal role in fostering sustainable community growth. Notably, historical facades seamlessly bridge the gap between tradition and modernity. Moreover, by harnessing multifaceted design principles, contemporary architects can create spaces that not only accommodate rising populations but also enrich the cultural tapestry of urban environments. Crucially, these developments underscore the paramount importance of holistic infrastructure."""
    }
}

class AnalysisRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Input text to analyze for AI vs Human authorship")

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "NotByHuman AI Detector API",
        "version": "1.0.0"
    }

@app.get("/api/samples")
def get_sample_texts():
    return SAMPLE_TEXTS

@app.post("/api/analyze")
def analyze_text(payload: AnalysisRequest):
    raw_text = payload.text
    cleaned = clean_text(raw_text)
    word_count = count_words(cleaned)
    
    if word_count < 15:
        raise HTTPException(
            status_code=400,
            detail=f"Input text is too short ({word_count} words). Minimum 15-20 words required for reliable stylometric analysis."
        )
        
    features = extractor.extract_features(cleaned)
    prediction = classifier.predict(features)
    sentence_highlights = extractor.analyze_sentences(cleaned)
    flagged_phrases = extractor.get_detected_phrases(cleaned)
    
    confidence_warning = None
    if word_count < 50:
        confidence_warning = "Text sample is under 50 words. Stylometric variance is most accurate on longer samples (50+ words)."

    return {
        "word_count": word_count,
        "confidence_warning": confidence_warning,
        "ai_probability": prediction["ai_probability"],
        "ai_percentage": prediction["ai_percentage"],
        "classification": prediction["classification"],
        "risk_level": prediction["risk_level"],
        "verdict_summary": prediction["verdict_summary"],
        "explanations": prediction["explanations"],
        "metrics": {
            "perplexity": round(features["perplexity"], 1),
            "burstiness_cv": round(features["cv_sent_len"], 2),
            "ttr": round(features["ttr"], 2),
            "avg_sent_len": round(features["avg_sent_len"], 1),
            "ai_phrase_density": round(features["ai_phrase_density"], 2)
        },
        "sentence_highlights": sentence_highlights,
        "flagged_phrases": flagged_phrases
    }

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename.lower()
    content = await file.read()
    
    if filename.endswith(".txt"):
        text = parse_txt_file(content)
    elif filename.endswith(".docx"):
        text = parse_docx_file(content)
    elif filename.endswith((".png", ".jpg", ".jpeg", ".webp")):
        text = parse_image_file(content)
        if not text:
            raise HTTPException(
                status_code=400,
                detail="Image text extraction completed. Please ensure image text is clear or paste text directly."
            )
    else:
        raise HTTPException(status_code=400, detail="Unsupported format. Please upload a .txt, .docx, .png, or .jpg file.")
        
    return analyze_text(AnalysisRequest(text=text))
