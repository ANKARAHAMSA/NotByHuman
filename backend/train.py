import os
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, roc_auc_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from app.stylometrics import StylometricExtractor

MODEL_SAVE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "notbyhuman_classifier.joblib")

def train_custom_model(csv_path: str = None):
    """
    Train a stylometric classifier model.
    If csv_path is provided, expects columns ['text', 'label'] where label=0 (Human) and label=1 (AI).
    Otherwise generates a synthetic dataset for demonstration and calibration.
    """
    extractor = StylometricExtractor(use_gpt2=False)
    
    if csv_path and os.path.exists(csv_path):
        print(f"Loading custom dataset from {csv_path}...")
        df_raw = pd.read_csv(csv_path)
        feature_rows = []
        labels = []
        for idx, row in df_raw.iterrows():
            feats = extractor.extract_features(row['text'])
            feature_rows.append(feats)
            labels.append(row['label'])
        X_df = pd.DataFrame(feature_rows)
        y = np.array(labels)
    else:
        print("No dataset CSV found. Generating calibration stylometric dataset...")
        np.random.seed(42)
        n = 1000
        # Generate synthetic feature vectors matching human vs AI distributions
        human_data = {
            "avg_sent_len": np.random.normal(16.0, 5.5, n//2),
            "std_sent_len": np.random.normal(8.5, 3.0, n//2),
            "var_sent_len": np.random.normal(72.0, 25.0, n//2),
            "cv_sent_len": np.random.normal(0.60, 0.18, n//2),
            "perplexity": np.random.normal(70.0, 20.0, n//2),
            "entropy": np.random.normal(5.1, 0.5, n//2),
            "ttr": np.random.normal(0.70, 0.08, n//2),
            "root_ttr": np.random.normal(8.2, 1.2, n//2),
            "hapax_ratio": np.random.normal(0.52, 0.08, n//2),
            "yules_k": np.random.normal(115.0, 25.0, n//2),
            "avg_word_len": np.random.normal(4.8, 0.4, n//2),
            "commas_per_100": np.random.normal(3.5, 1.5, n//2),
            "punct_density": np.random.normal(0.08, 0.02, n//2),
            "ai_phrase_density": np.random.exponential(0.08, n//2),
        }
        ai_data = {
            "avg_sent_len": np.random.normal(18.0, 2.0, n//2),
            "std_sent_len": np.random.normal(3.0, 1.0, n//2),
            "var_sent_len": np.random.normal(9.0, 3.0, n//2),
            "cv_sent_len": np.random.normal(0.17, 0.06, n//2),
            "perplexity": np.random.normal(26.0, 8.0, n//2),
            "entropy": np.random.normal(4.2, 0.3, n//2),
            "ttr": np.random.normal(0.50, 0.06, n//2),
            "root_ttr": np.random.normal(6.0, 0.8, n//2),
            "hapax_ratio": np.random.normal(0.36, 0.06, n//2),
            "yules_k": np.random.normal(175.0, 35.0, n//2),
            "avg_word_len": np.random.normal(5.1, 0.3, n//2),
            "commas_per_100": np.random.normal(5.2, 1.0, n//2),
            "punct_density": np.random.normal(0.11, 0.02, n//2),
            "ai_phrase_density": np.random.normal(1.6, 0.7, n//2),
        }
        df_h = pd.DataFrame(human_data)
        df_h['label'] = 0
        df_a = pd.DataFrame(ai_data)
        df_a['label'] = 1
        df_all = pd.concat([df_h, df_a], ignore_index=True)
        feature_cols = [c for c in df_all.columns if c != 'label']
        for col in feature_cols:
            df_all[col] = df_all[col].clip(lower=0.0)
        X_df = df_all[feature_cols]
        y = df_all['label'].values

    X_train, X_test, y_train, y_test = train_test_split(X_df, y, test_size=0.2, random_state=42, stratify=y)

    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('rf', RandomForestClassifier(n_estimators=150, max_depth=10, random_state=42))
    ])

    print("Fitting Random Forest classifier pipeline...")
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    y_proba = pipeline.predict_proba(X_test)[:, 1]

    print("\n--- Model Evaluation Results ---")
    print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
    print(f"ROC AUC:   {roc_auc_score(y_test, y_proba):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Human (0)', 'AI (1)']))

    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    joblib.dump(pipeline, MODEL_SAVE_PATH)
    print(f"\nModel saved successfully to: {MODEL_SAVE_PATH}")

if __name__ == "__main__":
    train_custom_model()
