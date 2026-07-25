import React from 'react';
import { ArrowDown, Sparkles, Shield, Cpu } from 'lucide-react';

export default function GlitchHero({ onScrollToWorkspace }) {
  return (
    <section className="hero-full-container">
      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(168, 85, 247, 0.12) 50%, transparent 80%)',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Hero Badge */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(6, 182, 212, 0.1)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        padding: '8px 20px',
        borderRadius: '9999px',
        fontSize: '0.9rem',
        color: 'var(--primary-cyan)',
        fontWeight: '700',
        marginBottom: '1.5rem',
        boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)'
      }}>
        <Sparkles size={16} />
        <span>Linguistic Stylometric Intelligence Engine</span>
      </div>

      {/* Main Headline */}
      <h1 style={{
        position: 'relative',
        zIndex: 1,
        fontFamily: 'var(--font-heading)',
        fontSize: 'calc(2.5rem + 2vw)',
        fontWeight: '800',
        letterSpacing: '-0.04em',
        maxWidth: '900px',
        lineHeight: '1.1',
        marginBottom: '1.25rem'
      }}>
        HUMAN OR <span className="text-gradient">SYNTHETIC?</span>
      </h1>

      <p style={{
        position: 'relative',
        zIndex: 1,
        color: 'var(--text-muted)',
        maxWidth: '720px',
        fontSize: '1.15rem',
        lineHeight: '1.7',
        marginBottom: '2.5rem'
      }}>
        Deconstruct text and image screenshots using sentence perplexity, burstiness variation, vocabulary diversity, and LLM transition fingerprints.
      </p>

      {/* Central Glitching Image Feature Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '680px',
        width: '100%',
        margin: '0 auto 2.5rem auto',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(6, 182, 212, 0.2)',
        background: '#090d16'
      }}>
        {/* Scanline overlay */}
        <div className="scanline-overlay" />

        {/* Glitch Animated Image */}
        <img
          src="/hero_glitch.png"
          alt="AI Humanoid Glitch Silhouette"
          className="glitch-image-active"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'cover'
          }}
        />

        {/* Live Status Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(7, 10, 18, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-glass-bright)',
          padding: '6px 18px',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: '700',
          color: 'var(--primary-cyan)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 3
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)' }} />
          <span>LIVE STYLOMETRIC ANALYSIS ENGINE</span>
        </div>
      </div>

      {/* Scroll Down Trigger Button */}
      <button
        type="button"
        className="btn-primary"
        onClick={onScrollToWorkspace}
        style={{ position: 'relative', zIndex: 1, cursor: 'pointer' }}
      >
        <span>Inspect Text & Photos</span>
        <ArrowDown size={18} />
      </button>
    </section>
  );
}
