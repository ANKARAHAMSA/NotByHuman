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
      color: 'var(--primary-cyan)',
      desc: perplexity < 35 ? 'Low (Highly Predictable)' : 'High (Unpredictable / Creative)',
      explanation: 'Measures how predictable text is to a language model. Lower perplexity indicates uniform AI continuation.'
    },
    {
      title: 'Burstiness (CV)',
      value: burstiness_cv,
      unit: 'CV',
      icon: Zap,
      color: 'var(--primary-purple)',
      desc: burstiness_cv < 0.3 ? 'Low (Uniform Sentences)' : 'High (Dynamic Rhythm)',
      explanation: 'Sentence length variance. Humans write with mixed short/long sentences; AI writes with uniform rhythm.'
    },
    {
      title: 'Vocab Diversity',
      value: ttr,
      unit: 'TTR',
      icon: BookOpen,
      color: 'var(--accent-green)',
      desc: ttr < 0.5 ? 'Low Diversity' : 'High Diversity',
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
        marginBottom: '1rem'
      }}>
        Stylometric Feature Breakdown
      </h3>

      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
                marginBottom: '4px'
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
          marginBottom: '1rem'
        }}>
          Classifier Explainability Log
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {explanations?.map((exp, i) => {
            const isAiFlag = exp.status === 'AI Flag';
            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '10px 14px',
                background: isAiFlag ? 'rgba(244, 63, 94, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                border: `1px solid ${isAiFlag ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                borderRadius: '10px',
                fontSize: '0.9rem'
              }}>
                {isAiFlag ? (
                  <AlertCircle size={18} color="var(--accent-rose)" style={{ marginTop: '2px', flexShrink: 0 }} />
                ) : (
                  <CheckCircle2 size={18} color="var(--accent-green)" style={{ marginTop: '2px', flexShrink: 0 }} />
                )}
                <div>
                  <strong style={{ color: isAiFlag ? '#fecdd3' : '#d1fae5' }}>{exp.feature}: </strong>
                  <span style={{ color: 'var(--text-muted)' }}>{exp.detail}</span>
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
              {flaggedPhrases.map((item, idx) => (
                <span key={idx} className="badge badge-rose">
                  "{item.phrase}" ({item.count})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
