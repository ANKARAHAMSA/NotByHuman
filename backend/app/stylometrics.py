import re
import math
import numpy as np
from typing import Dict, List, Any, Tuple

# AI cliché words and transition phrases frequently overused by LLMs
AI_BUZZWORDS = [
    "furthermore", "moreover", "delve", "tapestry", "testament", "crucial",
    "in conclusion", "it is important to note", "underscores", "paramount",
    "pivotal", "beacon", "fostering", "seamlessly", "harnessing", "multifaceted",
    "interplay", "ever-evolving", "embark", "realm", "garner", "indispensable",
    "vital role", "game-changer", "transformative", "nuanced", "holistic",
    "shed light", "in summary", "overall", "notably", "significantly", "rich tapestry"
]

def split_into_sentences(text: str) -> List[str]:
    """Split text into sentences handling common abbreviations."""
    raw_sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    sentences = [s.strip() for s in raw_sentences if s.strip() and len(s.strip()) > 3]
    return sentences if sentences else [text.strip()]

def tokenize_words(text: str) -> List[str]:
    """Extract clean lower-cased alphabetic tokens."""
    return re.findall(r'\b[a-zA-Z]+\b', text.lower())

class StylometricExtractor:
    def __init__(self, use_gpt2: bool = True):
        self.use_gpt2 = use_gpt2
        self._gpt2_model = None
        self._gpt2_tokenizer = None

    def _init_gpt2(self):
        """Lazy loader for GPT-2 perplexity model."""
        if self._gpt2_model is None and self.use_gpt2:
            try:
                import torch
                from transformers import GPT2LMHeadModel, GPT2TokenizerFast
                model_id = "gpt2"
                self._gpt2_tokenizer = GPT2TokenizerFast.from_pretrained(model_id)
                self._gpt2_model = GPT2LMHeadModel.from_pretrained(model_id)
                self._gpt2_model.eval()
            except Exception as e:
                print(f"GPT-2 initialization deferred/failed, using fallback n-gram perplexity: {e}")
                self.use_gpt2 = False

    def compute_gpt2_perplexity(self, text: str) -> float:
        """Compute perplexity using GPT-2 model or return fallback n-gram entropy."""
        self._init_gpt2()
        if self._gpt2_model and self._gpt2_tokenizer:
            try:
                import torch
                encodings = self._gpt2_tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
                input_ids = encodings.input_ids
                if input_ids.shape[1] < 5:
                    return 50.0
                with torch.no_grad():
                    outputs = self._gpt2_model(input_ids, labels=input_ids)
                    neg_log_likelihood = outputs.loss
                    ppl = torch.exp(neg_log_likelihood).item()
                    return float(np.clip(ppl, 5.0, 500.0))
            except Exception:
                pass
        return self._compute_ngram_perplexity(text)

    def _compute_ngram_perplexity(self, text: str) -> float:
        """Fallback n-gram Shannon entropy based pseudo-perplexity."""
        words = tokenize_words(text)
        if len(words) < 5:
            return 45.0
        
        # Calculate trigram entropy
        trigrams = [tuple(words[i:i+3]) for i in range(len(words)-2)]
        if not trigrams:
            return 45.0
        
        counts = {}
        for tg in trigrams:
            counts[tg] = counts.get(tg, 0) + 1
            
        entropy = 0.0
        total = len(trigrams)
        for tg, count in counts.items():
            p = count / total
            entropy -= p * math.log2(p)
            
        # Scale entropy to pseudo-perplexity range (approx 15.0 to 120.0)
        pseudo_ppl = math.exp(entropy * 0.75) * 8.0
        return float(np.clip(pseudo_ppl, 10.0, 300.0))

    def extract_features(self, text: str) -> Dict[str, float]:
        """Extract complete numerical stylometric feature vector for model input."""
        words = tokenize_words(text)
        sentences = split_into_sentences(text)
        
        total_words = max(len(words), 1)
        total_sentences = max(len(sentences), 1)
        
        # 1. Burstiness (Sentence length variation)
        sentence_word_lengths = [len(tokenize_words(s)) for s in sentences]
        avg_sent_len = float(np.mean(sentence_word_lengths))
        std_sent_len = float(np.std(sentence_word_lengths))
        var_sent_len = float(np.var(sentence_word_lengths))
        cv_sent_len = (std_sent_len / avg_sent_len) if avg_sent_len > 0 else 0.0
        
        # 2. Perplexity & Entropy
        perplexity = self.compute_gpt2_perplexity(text)
        
        # Word-level Shannon Entropy
        word_freqs = {}
        for w in words:
            word_freqs[w] = word_freqs.get(w, 0) + 1
        entropy = -sum((cnt / total_words) * math.log2(cnt / total_words) for cnt in word_freqs.values())
        
        # 3. Vocabulary Diversity
        unique_words = len(word_freqs)
        ttr = unique_words / total_words  # Type-Token Ratio
        root_ttr = unique_words / math.sqrt(total_words)
        
        # Hapax Legomena Ratio (words occurring once)
        hapax_count = sum(1 for cnt in word_freqs.values() if cnt == 1)
        hapax_ratio = hapax_count / total_words
        
        # Yule's K Metric
        m1 = total_words
        m2 = sum(cnt ** 2 for cnt in word_freqs.values())
        yules_k = 10000 * (m2 - m1) / (m1 ** 2) if m1 > 1 else 0.0
        
        # 4. Word and Structural Statistics
        avg_word_len = float(np.mean([len(w) for w in words])) if words else 0.0
        
        # Punctuation counts
        comma_count = text.count(',')
        semicolon_count = text.count(';')
        dash_count = text.count('-') + text.count('—')
        colon_count = text.count(':')
        
        commas_per_100 = (comma_count / total_words) * 100
        punct_density = (comma_count + semicolon_count + dash_count + colon_count) / total_words
        
        # 5. AI Cliché & Transition Word Density
        text_lower = text.lower()
        ai_words_found = 0
        for phrase in AI_BUZZWORDS:
            ai_words_found += text_lower.count(phrase)
        ai_phrase_density = (ai_words_found / total_words) * 100
        
        return {
            "avg_sent_len": avg_sent_len,
            "std_sent_len": std_sent_len,
            "var_sent_len": var_sent_len,
            "cv_sent_len": cv_sent_len,
            "perplexity": perplexity,
            "entropy": entropy,
            "ttr": ttr,
            "root_ttr": root_ttr,
            "hapax_ratio": hapax_ratio,
            "yules_k": yules_k,
            "avg_word_len": avg_word_len,
            "commas_per_100": commas_per_100,
            "punct_density": punct_density,
            "ai_phrase_density": ai_phrase_density
        }

    def analyze_sentences(self, text: str) -> List[Dict[str, Any]]:
        """Sentence-by-sentence predictability and burstiness breakdown for UI heatmap."""
        sentences = split_into_sentences(text)
        if not sentences:
            return []
            
        sentence_word_lengths = [len(tokenize_words(s)) for s in sentences]
        avg_len = np.mean(sentence_word_lengths) if sentence_word_lengths else 10.0
        
        results = []
        for i, s in enumerate(sentences):
            words = tokenize_words(s)
            s_len = len(words)
            text_lower = s.lower()
            
            # Check for AI phrases in this sentence
            found_phrases = [p for p in AI_BUZZWORDS if p in text_lower]
            
            # Per-sentence perplexity estimate
            s_ppl = self._compute_ngram_perplexity(s)
            
            # Calculate predictability score (0 = highly variable/human, 1 = highly predictable/uniform)
            len_dev = abs(s_len - avg_len) / (avg_len + 1e-5)
            uniformity_score = 1.0 - min(len_dev, 1.0)
            ppl_predictability = max(0.0, min(1.0, 1.0 - (s_ppl / 100.0)))
            buzz_bonus = 0.3 if found_phrases else 0.0
            
            ai_score = min(1.0, 0.4 * uniformity_score + 0.4 * ppl_predictability + buzz_bonus)
            
            if ai_score >= 0.7:
                level = "high"
                badge = "High AI Uniformity"
            elif ai_score >= 0.4:
                level = "medium"
                badge = "Moderate Predictability"
            else:
                level = "low"
                badge = "Dynamic Human Flow"
                
            results.append({
                "sentence_index": i,
                "text": s,
                "word_count": s_len,
                "perplexity": round(s_ppl, 1),
                "ai_uniformity_score": round(ai_score, 2),
                "risk_level": level,
                "badge": badge,
                "flagged_phrases": found_phrases
            })
            
        return results

    def get_detected_phrases(self, text: str) -> List[Dict[str, Any]]:
        """Extract flagged AI cliché phrases with counts."""
        text_lower = text.lower()
        flagged = []
        for phrase in AI_BUZZWORDS:
            count = text_lower.count(phrase)
            if count > 0:
                flagged.append({
                    "phrase": phrase,
                    "count": count
                })
        return sorted(flagged, key=lambda x: x["count"], reverse=True)
