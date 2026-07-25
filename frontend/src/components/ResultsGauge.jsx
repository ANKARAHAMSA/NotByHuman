import React from 'react';
import { AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export default function ResultsGauge({ results }) {
  if (!results) return null;

  const {
    ai_percentage,
    classification,
    risk_level,
    verdict_summary,
    confidence_warning,
    word_count
  } = results;

  // Gauge calculation
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (ai_percentage / 100) * circumference;

  let gaugeColor = 'var(--accent-green)';
  let badgeClass = 'badge-green';
  let IconComponent = ShieldCheck;

  if (ai_percentage >= 70) {
    gaugeColor = 'var(--accent-rose)';
    badgeClass = 'badge-rose';
    IconComponent = AlertTriangle;
  } else if (ai_percentage >= 45) {
    gaugeColor = 'var(--accent-amber)';
    badgeClass = 'badge-amber';
    IconComponent = HelpCircle;
  }

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        alignItems: 'center'
      }}>
        {/* Circular Gauge */}
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <svg height={radius * 2} width={radius * 2} style={{ transform: 'rotate(-90deg)' }}>
              <circle
                stroke="rgba(255, 255, 255, 0.08)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke={gaugeColor}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.2rem',
                fontWeight: '800',
                lineHeight: '1',
                color: gaugeColor
              }}>
                {ai_percentage}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI Probability
              </div>
            </div>
          </div>
        </div>

        {/* Verdict Details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <span className={`badge ${badgeClass}`}>
              <IconComponent size={14} /> {risk_level}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              ({word_count} words analyzed)
            </span>
          </div>

          <h3 style={{
            fontSize: '1.5rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: '700',
            marginBottom: '0.5rem'
          }}>
            {classification}
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: '1.6' }}>
            {verdict_summary}
          </p>

          {confidence_warning && (
            <div style={{
              marginTop: '1rem',
              padding: '10px 14px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={16} color="var(--accent-amber)" />
              <span>{confidence_warning}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
