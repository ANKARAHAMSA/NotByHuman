import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function WhiteLogoHero({ onScrollToWorkspace }) {
  return (
    <section style={{
      minHeight: '92vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      background: '#ffffff',
      color: '#0f172a',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      {/* Centered Split AI/Human Head Logo Image */}
      <div className="logo-hero-anim" style={{ marginBottom: '1.75rem', position: 'relative' }}>
        <img
          src="/notbyhuman_logo.jpg"
          alt="NotByHuman Split Wireframe Head Logo"
          style={{
            width: '100%',
            maxWidth: '360px',
            height: 'auto',
            display: 'block',
            margin: '0 auto',
            borderRadius: '16px'
          }}
        />
      </div>

      {/* Hero Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(249, 115, 22, 0.08)',
        border: '1px solid rgba(249, 115, 22, 0.3)',
        padding: '6px 18px',
        borderRadius: '9999px',
        fontSize: '0.85rem',
        color: '#ea580c',
        fontWeight: '700',
        marginBottom: '1.25rem'
      }}>
        <Sparkles size={16} />
        <span>Stylometric AI & Plagiarism Intelligence Platform</span>
      </div>

      {/* Main Headline */}
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'calc(2.5rem + 1.8vw)',
        fontWeight: '800',
        letterSpacing: '-0.04em',
        maxWidth: '850px',
        lineHeight: '1.15',
        marginBottom: '0.75rem',
        color: '#0f172a'
      }}>
        NotBy<span style={{ color: '#ea580c' }}>Human</span>
      </h1>

      {/* Sub-Tagline */}
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.2rem',
        fontWeight: '700',
        letterSpacing: '0.2em',
        color: '#334155',
        textTransform: 'uppercase',
        marginBottom: '1.75rem'
      }}>
        DETECT. <span style={{ color: '#ea580c' }}>VERIFY.</span> EXPOSE.
      </div>

      <p style={{
        color: '#64748b',
        maxWidth: '640px',
        fontSize: '1.05rem',
        lineHeight: '1.65',
        marginBottom: '2.5rem'
      }}>
        Deconstruct sentence perplexity, burstiness rhythm variation, and AI cliché phrases in text, documents, or photo screenshots.
      </p>

      {/* Scroll Down Button */}
      <button
        type="button"
        className="pill-action-btn"
        onClick={onScrollToWorkspace}
        style={{ fontSize: '1.05rem', padding: '14px 32px' }}
      >
        <span>Scroll to Inspect Text & Photos</span>
        <ArrowDown size={18} />
      </button>
    </section>
  );
}
