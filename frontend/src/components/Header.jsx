import React from 'react';
import { ShieldCheck, Cpu, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(6, 182, 212, 0.1)',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        padding: '6px 16px',
        borderRadius: '9999px',
        fontSize: '0.85rem',
        color: 'var(--primary-cyan)',
        fontWeight: '600',
        marginBottom: '1rem'
      }}>
        <Sparkles size={16} />
        <span>Stylometric Feature Engineering & ML Classifier</span>
      </div>
      
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'calc(2rem + 1.5vw)',
        fontWeight: '800',
        letterSpacing: '-0.03em',
        marginBottom: '0.75rem'
      }}>
        NotBy<span className="text-gradient">Human</span>
      </h1>
      
      <p style={{
        color: 'var(--text-muted)',
        maxWidth: '680px',
        margin: '0 auto',
        fontSize: '1.05rem',
        lineHeight: '1.6'
      }}>
        An open, explainable AI-text detector. Evaluates sentence perplexity, burstiness, vocabulary diversity, and structural patterns to estimate AI probability.
      </p>
    </header>
  );
}
