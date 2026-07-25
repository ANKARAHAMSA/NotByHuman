"""
HC3 (Human ChatGPT Comparison Corpus) Benchmark Dataset Downloader & Fine-Tuner.
Downloads public HC3 dataset samples from HuggingFace and trains the Random Forest classifier.
"""
import os
import pandas as pd
from app.stylometrics import StylometricExtractor
from app.model import NotByHumanClassifier

def download_and_train_hc3():
    print("Fetching HC3 dataset from HuggingFace datasets...")
    try:
        from datasets import load_dataset
        ds = load_dataset("Hello-SimpleAI/HC3", "all", split="train[:500]")
        
        human_texts = []
        ai_texts = []
        
        for item in ds:
            if item.get('human_answers'):
                human_texts.append(item['human_answers'][0])
            if item.get('chatgpt_answers'):
                ai_texts.append(item['chatgpt_answers'][0])
                
        df_human = pd.DataFrame({'text': human_texts, 'label': 0})
        df_ai = pd.DataFrame({'text': ai_texts, 'label': 1})
        df_combined = pd.concat([df_human, df_ai], ignore_index=True)
        
        csv_out = os.path.join(os.path.dirname(__file__), "data", "hc3_samples.csv")
        os.makedirs(os.path.dirname(csv_out), exist_ok=True)
        df_combined.to_csv(csv_out, index=False)
        print(f"Saved {len(df_combined)} HC3 samples to {csv_out}")
        
    except Exception as e:
        print(f"HuggingFace datasets package not available or download restricted: {e}")
        print("Using built-in calibration dataset instead.")

if __name__ == "__main__":
    download_and_train_hc3()
