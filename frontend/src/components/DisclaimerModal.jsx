import React, { useState } from 'react';
import { ShieldAlert, BookOpenCheck, X } from 'lucide-react';

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Animated "?" Button (FAB) in Orange & White */}
      <button
        type="button"
        className="fab-info-btn"
        onClick={() => setIsOpen(true)}
        title="View Honest Limitations & Portfolio Notes"
        aria-label="Honest Limitations and Portfolio Notes"
      >
        ?
      </button>

      {/* Popover Modal (Matching Screenshot #2 in Orange & White Theme) */}
      {isOpen && (
        <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={22} color="#f97316" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
                  Honest Limitations & Portfolio Notes
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: '1.7' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Detection Accuracy is Probabilistic:</strong> Stylometric feature classifiers analyze linguistic signatures like perplexity, burstiness, and vocabulary diversity. However, no AI detector (including commercial tools like GPTZero or Turnitin) is 100% accurate.
              </p>
              
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Polished Human Text:</strong> Highly structured academic writing or non-native English speakers may occasionally trigger false positives due to uniform sentence rhythm.</li>
                <li><strong>Lightly Edited AI Text:</strong> AI-generated text that has been manually edited, paraphrased, or prompted for varied sentence structure can lower perplexity and evade detection.</li>
                <li><strong>Sample Length:</strong> Stylometric indicators become reliable with inputs of at least 50–100 words. Short inputs under 30 words lack statistical sample size.</li>
              </ul>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                background: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                borderRadius: '12px',
                color: '#f97316',
                fontSize: '0.88rem'
              }}>
                <BookOpenCheck size={18} style={{ flexShrink: 0 }} />
                <span>NotByHuman emphasizes <strong>explainability</strong> by showing the exact stylometric breakdown rather than acting as a black box.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
