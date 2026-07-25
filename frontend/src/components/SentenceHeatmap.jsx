import React, { useState } from 'react';
import { Layers, Info } from 'lucide-react';

export default function SentenceHeatmap({ sentences }) {
  const [selectedSentence, setSelectedSentence] = useState(null);

  if (!sentences || sentences.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={20} color="var(--primary-purple)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
            Sentence-Level Predictability Heatmap
          </h3>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-rose)' }} /> High AI Uniformity
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-amber)' }} /> Moderate
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-green)' }} /> Dynamic Human Flow
          </span>
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
        Click on any sentence below to inspect its individual perplexity, length variation, and flagged phrases.
      </p>

      {/* Sentence Highlighting Container */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.5)',
        border: '1px solid var(--border-glass)',
        borderRadius: '12px',
        padding: '1.25rem',
        lineHeight: '1.9',
        fontSize: '1rem',
        marginBottom: '1rem'
      }}>
        {sentences.map((sent, i) => (
          <span
            key={i}
            className={`sentence-hl ${sent.risk_level}`}
            onClick={() => setSelectedSentence(sent)}
            title={`Click to inspect (Sentence #${i + 1})`}
          >
            {sent.text}{' '}
          </span>
        ))}
      </div>

      {/* Selected Sentence Inspector Box */}
      {selectedSentence && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid var(--border-glass-bright)',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          fontSize: '0.9rem',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={16} color="var(--primary-cyan)" />
              <strong style={{ fontFamily: 'var(--font-heading)' }}>
                Sentence #{selectedSentence.sentence_index + 1} Inspection
              </strong>
            </div>

            <button
              onClick={() => setSelectedSentence(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              ✕
            </button>
          </div>

          <p style={{ fontStyle: 'italic', color: 'var(--text-main)', marginBottom: '8px' }}>
            "{selectedSentence.text}"
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Words: <strong>{selectedSentence.word_count}</strong></span>
            <span>Perplexity: <strong>{selectedSentence.perplexity} PPL</strong></span>
            <span>Rating: <strong style={{ color: selectedSentence.risk_level === 'high' ? 'var(--accent-rose)' : selectedSentence.risk_level === 'medium' ? 'var(--accent-amber)' : 'var(--accent-green)' }}>{selectedSentence.badge}</strong></span>
          </div>

          {selectedSentence.flagged_phrases?.length > 0 && (
            <div style={{ marginTop: '6px', color: 'var(--accent-rose)', fontSize: '0.85rem' }}>
              Flagged phrases in sentence: {selectedSentence.flagged_phrases.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
