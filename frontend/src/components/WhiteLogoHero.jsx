import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function WhiteLogoHero({ onScrollToWorkspace }) {
  return (
    <section className="hero-page-section">
      {/* Scroll Down Trigger Button at the bottom of Page 1 */}
      <button
        type="button"
        className="pill-action-btn"
        onClick={onScrollToWorkspace}
        style={{
          fontSize: '1.05rem',
          padding: '14px 36px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          color: '#ffffff'
        }}
      >
        <span>Scroll to Analyze ↓</span>
        <ArrowDown size={18} />
      </button>
    </section>
  );
}
