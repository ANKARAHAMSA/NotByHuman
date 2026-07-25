import React from 'react';
import { ShieldAlert, BookOpenCheck } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
        <ShieldAlert size={20} color="var(--accent-amber)" />
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
          Honest Limitations & Portfolio Notes
        </h3>
      </div>

      <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65' }}>
        <p style={{ marginBottom: '0.75rem' }}>
          <strong>Detection Accuracy is Probabilistic:</strong> Stylometric feature classifiers analyze linguistic signatures like perplexity, burstiness, and vocabulary diversity. However, no AI detector (including commercial tools like GPTZero or Turnitin) is 100% accurate.
        </p>
        
        <ul style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>
          <li><strong>Polished Human Text:</strong> Highly structured academic writing or non-native English speakers may occasionally trigger false positives due to uniform sentence rhythm.</li>
          <li><strong>Lightly Edited AI Text:</strong> AI-generated text that has been manually edited, paraphrased, or prompted for varied sentence structure can lower perplexity and evade detection.</li>
          <li><strong>Sample Length:</strong> Stylometric indicators become reliable with inputs of at least 50–100 words. Short inputs under 30 words lack statistical sample size.</li>
        </ul>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: '8px',
          color: 'var(--primary-cyan)',
          fontSize: '0.85rem'
        }}>
          <BookOpenCheck size={16} style={{ flexShrink: 0 }} />
          <span>NotByHuman emphasizes <strong>explainability</strong> by showing the exact stylometric breakdown rather than acting as a black box.</span>
        </div>
      </div>
    </div>
  );
}
