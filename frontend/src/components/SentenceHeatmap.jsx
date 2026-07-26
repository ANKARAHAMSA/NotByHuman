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
          <Layers size={20} color="#ff8800" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
            Sentence-Level Predictability Heatmap
          </h3>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#cbd5e1' }}>
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
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid var(--border-glass)',
        borderRadius: '12px',
        padding: '1.25rem',
        lineHeight: '1.9',
        fontSize: '1.02rem',
        marginBottom: '1rem'
      }}>
        {sentences.map((sent, i) => {
          const rLevel = sent.risk_level || sent.category || 'low';
          return (
            <span
              key={i}
              className={`sentence-hl ${rLevel}`}
              onClick={() => setSelectedSentence(sent)}
              style={{ cursor: 'pointer' }}
              title={`Click to inspect (Sentence #${(sent.sentence_index ?? i) + 1})`}
            >
              {sent.text}{' '}
            </span>
          );
        })}
      </div>

      {/* Selected Sentence Inspector Box */}
      {selectedSentence && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.95)',
          border: '1.5px solid #ff6b00',
          borderRadius: '12px',
          padding: '1.25rem',
          fontSize: '0.92rem',
          position: 'relative',
          boxShadow: '0 12px 30px rgba(0,0,0,0.6)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={18} color="#ff6b00" />
              <strong style={{ fontFamily: 'var(--font-heading)', color: '#ffffff', fontSize: '1.0rem' }}>
                Sentence #{(selectedSentence.sentence_index ?? 0) + 1} Inspection
              </strong>
            </div>

            <button
              onClick={() => setSelectedSentence(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: '2px 6px'
              }}
            >
              ✕
            </button>
          </div>

          <p style={{ fontStyle: 'italic', color: '#f8fafc', marginBottom: '10px', fontSize: '0.96rem' }}>
            "{selectedSentence.text}"
          </p>

          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', fontSize: '0.88rem', color: '#cbd5e1' }}>
            <span>Words: <strong style={{ color: '#ffffff' }}>{selectedSentence.word_count || selectedSentence.text?.split(' ').length || 0}</strong></span>
            <span>Perplexity: <strong style={{ color: '#ffffff' }}>{selectedSentence.perplexity || 65} PPL</strong></span>
            <span>Rating: <strong style={{ color: (selectedSentence.risk_level || selectedSentence.category) === 'high' ? 'var(--accent-rose)' : (selectedSentence.risk_level || selectedSentence.category) === 'medium' ? 'var(--accent-amber)' : 'var(--accent-green)' }}>{selectedSentence.badge || 'Dynamic Flow'}</strong></span>
          </div>

          {selectedSentence.flagged_phrases && selectedSentence.flagged_phrases.length > 0 && (
            <div style={{ marginTop: '10px', color: '#fecdd3', fontSize: '0.88rem' }}>
              ⚠️ <strong>Flagged LLM phrases in sentence:</strong> {selectedSentence.flagged_phrases.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
