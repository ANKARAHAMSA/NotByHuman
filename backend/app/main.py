import os
import random
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

HUMAN_SAMPLES = [
    {
        "title": "Personal Reflections on Urban Architecture",
        "text": "Walking through the old quarter of Montreal on a chilly November dusk always makes me think about how buildings hold memory. The cobblestones underfoot are slick with early evening mist, and the flickering streetlamps cast long, distorted shadows across granite facades. I remember stopping outside a small bakery near Saint-Denis—the smell of fresh cardamom and espresso drifting out through a heavy wooden door. It wasn't planned; I just stumbled in to escape the wind. That's what I love about older cities: they force you into unscripted moments."
    },
    {
        "title": "The Tactile Charm of Vinyl Records",
        "text": "There is something irreplaceable about pulling a vinyl record from its sleeve, dropping the stylus into the groove, and listening to the faint, warm crackle before the music starts. In a stream-everything world where millions of tracks sit behind glass touchscreens, playing vinyl forces patience. You listen to an entire album side uninterrupted—embracing imperfections, subtle surface pops, and sleeve art like a slow ritual."
    },
    {
        "title": "Grandmother's Unwritten Recipes",
        "text": "My grandmother never cooked with measuring spoons. She measured flour by the handful, judged salt by a quick pinch, and knew a chicken stew was finished simply by the sound of the simmer. Trying to write down her recipes for a family cookbook turned out to be nearly impossible. Whenever I asked for exact quantities, she would laugh and say, 'You don't measure with cups, child—you listen with your nose.'"
    },
    {
        "title": "Debugging at 2 AM",
        "text": "Debugging code at 2 AM feels like conversing with a stubborn ghost in the machine. A single missing semicolon or off-by-one array index can derail an entire data pipeline, yet hunting it down through stack traces brings a weird sense of quiet triumph. When the terminal finally prints green checkmarks after hours of frustration, the sheer relief makes you forget how exhausted you actually are."
    },
    {
        "title": "Sunrise on the Mountain Ridge",
        "text": "Reaching the mountain ridge just as dawn breaks, the fog still clings to the pines below like a sea of white cotton. Your lungs burn from the freezing high-altitude air and your calves ache from three hours of climbing in darkness, but the silence up here is absolute. Watching the morning sun hit the granite peak reminds you how small our daily anxieties really are."
    },
    {
        "title": "Rainy Café People Watching",
        "text": "Sitting by the corner window of a quiet downtown café with a flat white, watching commuters dodge puddles under neon umbrellas, you realize everyone carries an unwritten story. A woman across the street tries to shelter a box of pastries under her jacket while an old man walking a golden retriever stops to inspect a brass doorway. These quiet glimpses of stranger's lives make city afternoons feel human."
    }
]

AI_SAMPLES = [
    {
        "title": "Urban Architecture & Sustainability (GPT-4)",
        "text": "Furthermore, urban architecture serves as a testament to the ever-evolving interplay between human innovation and societal needs. In conclusion, it is important to note that modern city planning plays a pivotal role in fostering sustainable community growth. Notably, historical facades seamlessly bridge the gap between tradition and modernity. Moreover, by harnessing multifaceted design principles, contemporary architects can create spaces that not only accommodate rising populations but also enrich the cultural tapestry of urban environments. Crucially, these developments underscore the paramount importance of holistic infrastructure."
    },
    {
        "title": "Enterprise Synergy & Digital Transformation (GPT-4)",
        "text": "In today's fast-paced digital landscape, leveraging synergistic paradigms is crucial for driving sustainable enterprise growth. Moreover, by seamlessly integrating cutting-edge cloud architectures with data-driven operational frameworks, organizations can optimize cross-functional efficiency. Ultimately, fostering an agile corporate ecosystem empowers stakeholders to navigate market complexities while maximizing long-term value creation. In conclusion, continuous innovation remains paramount."
    },
    {
        "title": "Technology in Modern Society (GPT-4)",
        "text": "Technology has undoubtedly revolutionized the way humans communicate, work, and interact with their surrounding environments. In the modern era, artificial intelligence plays an increasingly pivotal role across diverse sectors including healthcare, finance, and education. Furthermore, it is essential to emphasize that ethical considerations must guide the implementation of autonomous systems. Consequently, establishing robust regulatory frameworks is paramount to ensuring societal alignment and security."
    },
    {
        "title": "Climate Policy & Global Economics (GPT-4)",
        "text": "To comprehensively analyze the global implications of climate change, one must evaluate multifaceted environmental and economic metrics. Crucially, empirical evidence underscores that transitioning toward renewable energy grids requires strategic policy intervention. Moreover, by aligning international regulatory standards with fiscal incentives, governments can catalyze private sector investment. In conclusion, holistic cooperation is indispensable for long-term ecological stability."
    },
    {
        "title": "AI Self-Reflection Formal Statement (GPT-4)",
        "text": "As an artificial intelligence language model, I do not possess personal subjective experiences, emotions, or independent agency. However, based on extensive analytical datasets, it is evident that technological progress offers significant potential for human advancement. It is important to note that responsible stewardship, algorithmic transparency, and continuous oversight are crucial components for mitigating potential operational risks."
    },
    {
        "title": "Remote Work Productivity Paradox (GPT-4)",
        "text": "While proponents argue that remote work models enhance individual autonomy and work-life balance, critics contend that distributed environments may hinder spontaneous collaborative synergy. On one hand, flexibility reduces commuting overhead and increases focus time. On the other hand, maintaining organizational cohesion requires deliberate communication structures. Ultimately, a balanced hybrid approach offers a sustainable middle ground."
    }
]

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
    return {
        "human_samples": HUMAN_SAMPLES,
        "ai_samples": AI_SAMPLES,
        # Fallbacks for backwards compatibility
        "human": random.choice(HUMAN_SAMPLES),
        "ai": random.choice(AI_SAMPLES)
    }

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
