import React from 'react';
import { Search, Eye, Sparkles } from 'lucide-react';

export default function DetectiveColumn() {
  return (
    <div className="detective-container glass-panel" style={{
      padding: '1.75rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glowing Aura */}
      <div style={{
        position: 'absolute',
        width: '220px',
        height: '220px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(139, 92, 246, 0.08) 60%, transparent 80%)',
        borderRadius: '50%',
        zIndex: 0,
        filter: 'blur(20px)'
      }} />

      {/* Floating Animated Detective Character */}
      <div className="float-detective-wrapper" style={{ position: 'relative', zIndex: 1, marginBottom: '1.25rem' }}>
        <img
          src="/detective.jpg"
          alt="Detective examining text with magnifying glass"
          style={{
            width: '100%',
            maxWidth: '260px',
            height: 'auto',
            borderRadius: '20px',
            border: '2px solid rgba(6, 182, 212, 0.3)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(6, 182, 212, 0.2)',
            objectFit: 'cover'
          }}
        />
        
        {/* Animated Badge */}
        <div style={{
          position: 'absolute',
          bottom: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(9, 13, 22, 0.9)',
          border: '1px solid var(--primary-cyan)',
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '700',
          color: 'var(--primary-cyan)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
          whiteSpace: 'nowrap'
        }}>
          <Search size={12} />
          <span>Stylometric Sleuth Active</span>
        </div>
      </div>

      {/* Detective Quote / Status Bubble */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(30, 41, 59, 0.7)',
        border: '1px solid var(--border-glass-bright)',
        borderRadius: '12px',
        padding: '12px 14px',
        marginTop: '0.75rem',
        textAlign: 'left'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--primary-purple)', fontWeight: '700', marginBottom: '4px' }}>
          <Sparkles size={14} /> Inspector's Eye
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0, fontStyle: 'italic' }}>
          "Paste any text or drop a photo screenshot. I'll inspect sentence lengths, perplexity, and AI transition phrases under my lens."
        </p>
      </div>
    </div>
  );
}
