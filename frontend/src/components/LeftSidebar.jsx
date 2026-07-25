import React from 'react';
import { ShieldCheck, Cpu, Activity, Eye, RefreshCw } from 'lucide-react';

export default function LeftSidebar({ onReset }) {
  return (
    <aside className="sticky-left-sidebar">
      {/* Scanline overlay */}
      <div className="scanline-overlay" />

      {/* Full-height docked glitch image */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden', minHeight: '280px' }}>
        <img
          src="/hero_glitch.png"
          alt="AI Humanoid Glitch Silhouette Sidebar"
          className="glitch-image-active"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'left center',
            display: 'block',
            filter: 'brightness(0.9) contrast(1.1)'
          }}
        />

        {/* Gradient edge overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '60%',
          background: 'linear-gradient(to top, rgba(7, 10, 18, 0.98) 0%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        {/* Active Badge */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'rgba(7, 10, 18, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-glass-bright)',
          padding: '6px 14px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '700',
          color: 'var(--primary-cyan)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 3
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-cyan)', boxShadow: '0 0 10px var(--primary-cyan)' }} />
          <span>DOCKED INSPECTOR</span>
        </div>
      </div>

      {/* Sidebar Control & Status Box */}
      <div style={{ padding: '1.25rem', position: 'relative', zIndex: 3, background: 'rgba(7, 10, 18, 0.95)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <ShieldCheck size={18} color="var(--primary-cyan)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
            NotBy<span className="text-gradient">Human</span>
          </h3>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
          Inspect sentence perplexity, burstiness variation, and AI phrase density in real time.
        </p>

        <button
          type="button"
          className="btn-secondary"
          onClick={onReset}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <RefreshCw size={14} /> New Inspection
        </button>
      </div>
    </aside>
  );
}
