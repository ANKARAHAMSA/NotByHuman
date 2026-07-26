import React, { useState } from 'react';
import { ShieldAlert, BookOpenCheck, Puzzle, X } from 'lucide-react';

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Animated "?" Button (FAB) in Orange & White */}
      <button
        type="button"
        className="fab-info-btn"
        onClick={() => setIsOpen(true)}
        title="View Extension Plugin Info & Honest Limitations"
        aria-label="Browser Extension Info and Honest Limitations"
      >
        ?
      </button>

      {/* Popover Modal (Pristine White & Orange Theme) */}
      {isOpen && (
        <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={22} color="#ff6b00" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
                  Browser Plugin & Honest Limitations
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  padding: '4px',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ff6b00'}
                onMouseLeave={(e) => e.target.style.color = '#64748b'}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ color: '#334155', fontSize: '0.94rem', lineHeight: '1.7' }}>
              {/* BROWSER EXTENSION / PLUGIN INFORMATION CARD */}
              <div style={{
                marginBottom: '1.25rem',
                padding: '14px 18px',
                background: 'rgba(255, 107, 0, 0.08)',
                border: '1.5px solid rgba(255, 107, 0, 0.35)',
                borderRadius: '14px',
                color: '#0f172a'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Puzzle size={20} color="#ff6b00" />
                  <strong style={{ fontSize: '1.0rem', fontFamily: 'var(--font-heading)', color: '#ff6b00' }}>
                    🧩 Chrome Browser Extension Included!
                  </strong>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.6' }}>
                  Want to analyze text directly on any website? You can install the <strong>NotByHuman Chrome Extension</strong>! Simply highlight/select any text on a web page, right-click, and select <strong>"Analyze with NotByHuman"</strong> to get an instant AI vs. Human detection analysis popup right on the page without leaving your tab!
                </p>
              </div>

              <p style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#0f172a' }}>Detection Accuracy is Probabilistic:</strong> Stylometric feature classifiers analyze linguistic signatures like perplexity, burstiness, and vocabulary diversity. However, no AI detector (including commercial tools like GPTZero or Turnitin) is 100% accurate.
              </p>
              
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong style={{ color: '#0f172a' }}>Polished Human Text:</strong> Highly structured academic writing or non-native English speakers may occasionally trigger false positives due to uniform sentence rhythm.</li>
                <li><strong style={{ color: '#0f172a' }}>Lightly Edited AI Text:</strong> AI-generated text that has been manually edited, paraphrased, or prompted for varied sentence structure can lower perplexity and evade detection.</li>
                <li><strong style={{ color: '#0f172a' }}>Sample Length:</strong> Stylometric indicators become reliable with inputs of at least 50–100 words. Short inputs under 30 words lack statistical sample size.</li>
              </ul>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                color: '#059669',
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
