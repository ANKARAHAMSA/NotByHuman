import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models", "notbyhuman_classifier.joblib")

FEATURE_NAMES = [
    "avg_sent_len", "std_sent_len", "var_sent_len", "cv_sent_len",
    "perplexity", "entropy", "ttr", "root_ttr", "hapax_ratio",
    "yules_k", "avg_word_len", "commas_per_100", "punct_density",
    "ai_phrase_density"
]

class NotByHumanClassifier:
    def __init__(self, model_file: str = MODEL_PATH):
        self.model_file = os.path.abspath(model_file)
        self.model = None
        self._load_or_train_baseline()

    def _load_or_train_baseline(self):
        """Load trained joblib model or train a synthetic baseline calibrator."""
        if os.path.exists(self.model_file):
            try:
                self.model = joblib.load(self.model_file)
                print(f"Loaded NotByHuman classifier model from {self.model_file}")
                return
            except Exception as e:
                print(f"Error loading model from {self.model_file}: {e}. Building synthetic calibration model.")
        
        # Build calibration dataset based on empirical AI vs Human stylometric bounds
        print("Training initial calibration model...")
        np.random.seed(42)
        n_samples = 800
        
        # Human stylometric distributions (high burstiness/CV, higher perplexity, high TTR, low AI buzzwords)
        human_features = {
            "avg_sent_len": np.random.normal(16.5, 6.0, n_samples // 2),
            "std_sent_len": np.random.normal(9.0, 3.5, n_samples // 2),
            "var_sent_len": np.random.normal(81.0, 30.0, n_samples // 2),
            "cv_sent_len": np.random.normal(0.65, 0.2, n_samples // 2),
            "perplexity": np.random.normal(75.0, 25.0, n_samples // 2),
            "entropy": np.random.normal(5.2, 0.6, n_samples // 2),
            "ttr": np.random.normal(0.72, 0.1, n_samples // 2),
            "root_ttr": np.random.normal(8.5, 1.5, n_samples // 2),
            "hapax_ratio": np.random.normal(0.55, 0.1, n_samples // 2),
            "yules_k": np.random.normal(110.0, 30.0, n_samples // 2),
            "avg_word_len": np.random.normal(4.8, 0.5, n_samples // 2),
            "commas_per_100": np.random.normal(3.8, 1.8, n_samples // 2),
            "punct_density": np.random.normal(0.08, 0.03, n_samples // 2),
            "ai_phrase_density": np.random.exponential(0.1, n_samples // 2),
        }
        
        # AI stylometric distributions (low burstiness/CV, low/uniform perplexity, lower TTR, high AI buzzwords)
        ai_features = {
            "avg_sent_len": np.random.normal(18.2, 2.5, n_samples // 2),
            "std_sent_len": np.random.normal(3.2, 1.2, n_samples // 2),
            "var_sent_len": np.random.normal(10.2, 4.0, n_samples // 2),
            "cv_sent_len": np.random.normal(0.18, 0.08, n_samples // 2),
            "perplexity": np.random.normal(28.0, 10.0, n_samples // 2),
            "entropy": np.random.normal(4.3, 0.4, n_samples // 2),
            "ttr": np.random.normal(0.52, 0.08, n_samples // 2),
            "root_ttr": np.random.normal(6.2, 1.0, n_samples // 2),
            "hapax_ratio": np.random.normal(0.38, 0.08, n_samples // 2),
            "yules_k": np.random.normal(170.0, 40.0, n_samples // 2),
            "avg_word_len": np.random.normal(5.1, 0.4, n_samples // 2),
            "commas_per_100": np.random.normal(5.5, 1.2, n_samples // 2),
            "punct_density": np.random.normal(0.11, 0.02, n_samples // 2),
            "ai_phrase_density": np.random.normal(1.8, 0.8, n_samples // 2),
        }
        
        df_human = pd.DataFrame(human_features)
        df_human['label'] = 0  # Human
        
        df_ai = pd.DataFrame(ai_features)
        df_ai['label'] = 1  # AI
        
        df_combined = pd.concat([df_human, df_ai], ignore_index=True)
        # Ensure positive non-zero values
        for col in FEATURE_NAMES:
            df_combined[col] = df_combined[col].clip(lower=0.0)
            
        X = df_combined[FEATURE_NAMES]
        y = df_combined['label']
        
        pipeline = Pipeline([
            ('scaler', StandardScaler()),
            ('rf', RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42))
        ])
        pipeline.fit(X, y)
        
        os.makedirs(os.path.dirname(self.model_file), exist_ok=True)
        joblib.dump(pipeline, self.model_file)
        self.model = pipeline
        print(f"Calibration model trained & saved to {self.model_file}")

    def predict(self, feature_dict: Dict[str, float]) -> Dict[str, Any]:
        """Classify text and generate feature-level explainability signals."""
        X_input = pd.DataFrame([feature_dict])[FEATURE_NAMES]
        
        # Calculate base ML probability
        probs = self.model.predict_proba(X_input)[0]
        raw_ai_prob = float(probs[1])  # Class 1 = AI
        
        # Stylometric heuristic rule adjustments for edge cases
        cv = feature_dict.get("cv_sent_len", 0.5)
        ppl = feature_dict.get("perplexity", 50.0)
        ai_density = feature_dict.get("ai_phrase_density", 0.0)
        ttr = feature_dict.get("ttr", 0.6)
        
        # Adjust score using weighted stylometric indicators
        score_adjustment = 0.0
        if cv < 0.25:  # High sentence uniformity
            score_adjustment += 0.12
        elif cv > 0.6:  # Dynamic burstiness (human)
            score_adjustment -= 0.12
            
        if ppl < 30.0:  # Highly predictable
            score_adjustment += 0.10
        elif ppl > 80.0: # Highly erratic / un-predictable
            score_adjustment -= 0.10
            
        if ai_density > 1.0: # Heavy use of AI clichés
            score_adjustment += min(0.20, ai_density * 0.10)
            
        ai_probability = float(np.clip(raw_ai_prob + score_adjustment, 0.02, 0.98))
        ai_percentage = int(round(ai_probability * 100))
        
        # Determine classification label & risk tier
        if ai_percentage >= 70:
            classification = "AI-Generated"
            risk_level = "High Risk"
            verdict_summary = "High probability of AI generation based on uniform sentence structures, low perplexity, and predictable phrasing."
        elif ai_percentage >= 45:
            classification = "Mixed / Hybrid Writing"
            risk_level = "Medium Risk"
            verdict_summary = "Text exhibits mixed characteristics (e.g. human writing heavily polished by AI or containing structured AI segments)."
        else:
            classification = "Human-Written"
            risk_level = "Low Risk"
            verdict_summary = "Text demonstrates natural human rhythm, high burstiness, and dynamic vocabulary variation."

        # Generate human-readable feature explanations
        explanations = []
        if cv < 0.3:
            explanations.append({
                "feature": "Sentence Rhythm (Burstiness)",
                "status": "AI Flag",
                "detail": f"Low sentence length variance (CV = {cv:.2f}). Sentences have repetitive uniform length typical of LLMs."
            })
        else:
            explanations.append({
                "feature": "Sentence Rhythm (Burstiness)",
                "status": "Human Indicator",
                "detail": f"High sentence length variance (CV = {cv:.2f}). Text alternates between short punchy and longer complex sentences."
            })

        if ppl < 35.0:
            explanations.append({
                "feature": "Predictability (Perplexity)",
                "status": "AI Flag",
                "detail": f"Low perplexity score ({ppl:.1f}). Word sequences are highly predictable to language models."
            })
        else:
            explanations.append({
                "feature": "Predictability (Perplexity)",
                "status": "Human Indicator",
                "detail": f"High perplexity score ({ppl:.1f}). Text contains surprising, creative, or non-standard word combinations."
            })

        if ai_density > 0.0:
            explanations.append({
                "feature": "AI Cliché Density",
                "status": "AI Flag",
                "detail": f"Detected transition words and AI clichés (density = {ai_density:.2f}%)."
            })
        else:
            explanations.append({
                "feature": "AI Cliché Density",
                "status": "Human Indicator",
                "detail": "No overused AI transition words or filler clichés detected."
            })

        if ttr < 0.5:
            explanations.append({
                "feature": "Vocabulary Diversity (TTR)",
                "status": "AI Flag",
                "detail": f"Low Type-Token Ratio ({ttr:.2f}). Vocabulary repeats core words frequently."
            })
        else:
            explanations.append({
                "feature": "Vocabulary Diversity (TTR)",
                "status": "Human Indicator",
                "detail": f"Rich vocabulary diversity ({ttr:.2f}) with low word repetition."
            })

        return {
            "ai_probability": ai_probability,
            "ai_percentage": ai_percentage,
            "classification": classification,
            "risk_level": risk_level,
            "verdict_summary": verdict_summary,
            "explanations": explanations
        }
