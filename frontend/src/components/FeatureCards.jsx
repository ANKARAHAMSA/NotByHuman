import React from 'react';
import { Activity, Zap, BookOpen, Tag, CheckCircle2, AlertCircle } from 'lucide-react';

export default function FeatureCards({ metrics, explanations, flaggedPhrases }) {
  if (!metrics) return null;

  const { perplexity, burstiness_cv, ttr, ai_phrase_density } = metrics;

  const cards = [
    {
      title: 'Perplexity Score',
      value: perplexity,
      unit: 'PPL',
      icon: Activity,
      color: '#ff6b00',
      desc: perplexity < 35 ? 'Low (Highly Predictable)' : 'High (Unpredictable / Creative)',
      explanation: 'Measures how predictable text is to a language model. Lower perplexity indicates uniform AI continuation.'
    },
    {
      title: 'Burstiness (CV)',
      value: burstiness_cv,
      unit: 'CV',
      icon: Zap,
      color: '#ff8800',
      desc: burstiness_cv < 0.3 ? 'Low (Uniform Sentences)' : 'High (Dynamic Rhythm)',
      explanation: 'Sentence length variance. Humans write with mixed short/long sentences; AI writes with uniform rhythm.'
    },
    {
      title: 'Vocab Diversity',
      value: ttr,
      unit: 'TTR',
      icon: BookOpen,
      color: 'var(--accent-green)',
      desc: ttr < 0.55 ? 'Low Diversity' : 'High Diversity',
      explanation: 'Type-Token Ratio of unique vs total words. Higher diversity reflects rich natural phrasing.'
    },
    {
      title: 'AI Phrase Density',
      value: `${ai_phrase_density}%`,
      unit: '',
      icon: Tag,
      color: 'var(--accent-rose)',
      desc: ai_phrase_density > 0 ? `${flaggedPhrases?.length || 0} phrases flagged` : 'Clean',
      explanation: 'Frequency of overused AI filler phrases like "furthermore", "delve", "tapestry", and "crucial".'
    }
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '1rem',
        color: '#ffffff'
      }}>
        Stylometric Feature Breakdown
      </h3>

      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {card.title}
                </span>
                <Icon size={18} color={card.color} />
              </div>

              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: '700',
                marginBottom: '4px',
                color: '#ffffff'
              }}>
                {card.value} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{card.unit}</span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {card.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanations List */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h4 style={{
          fontSize: '1.05rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: '700',
          marginBottom: '1rem',
          color: '#ffffff'
        }}>
          Classifier Explainability Log
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {explanations?.map((exp, i) => {
            let featureText = '';
            let detailText = '';
            let isAiFlag = false;

            if (typeof exp === 'object' && exp !== null) {
              featureText = exp.feature || 'Linguistic Feature';
              detailText = exp.detail || exp.text || '';
              isAiFlag = exp.status === 'AI Flag';
            } else if (typeof exp === 'string') {
              const parts = exp.split(':');
              if (parts.length > 1) {
                featureText = parts[0].trim();
                detailText = parts.slice(1).join(':').trim();
              } else {
                featureText = 'Feature';
                detailText = exp;
              }
              isAiFlag = exp.toLowerCase().includes('ai') || exp.toLowerCase().includes('predictable');
            }

            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 16px',
                background: isAiFlag ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                border: `1.5px solid ${isAiFlag ? 'rgba(244, 63, 94, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
                borderRadius: '12px',
                fontSize: '0.92rem'
              }}>
                {isAiFlag ? (
                  <AlertCircle size={18} color="#f43f5e" style={{ marginTop: '2px', flexShrink: 0 }} />
                ) : (
                  <CheckCircle2 size={18} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                )}
                <div>
                  <strong style={{ color: isAiFlag ? '#fecdd3' : '#d1fae5', fontFamily: 'var(--font-heading)' }}>
                    {featureText}:{' '}
                  </strong>
                  <span style={{ color: '#e2e8f0' }}>{detailText}</span>
                </div>
              </div>
            );
          })}
        </div>

        {flaggedPhrases && flaggedPhrases.length > 0 && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600' }}>
              Flagged AI Transition Words:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {flaggedPhrases.map((item, idx) => {
                const phraseStr = typeof item === 'object' && item !== null ? item.phrase : String(item);
                const countStr = typeof item === 'object' && item !== null && item.count ? ` (${item.count})` : '';
                return (
                  <span key={idx} className="badge badge-rose">
                    "{phraseStr}"{countStr}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
