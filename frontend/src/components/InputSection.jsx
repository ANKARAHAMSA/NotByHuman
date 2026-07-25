import React, { useRef } from 'react';
import { Upload, FileText, Play, RotateCcw, AlertCircle } from 'lucide-react';

export default function InputSection({
  text,
  setText,
  onAnalyze,
  loading,
  onLoadSample,
  onFileUpload
}) {
  const fileInputRef = useRef(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

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
          <FileText size={20} color="var(--primary-cyan)" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
            Input Text
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onLoadSample('human')}
            disabled={loading}
          >
            👤 Human Essay
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onLoadSample('ai')}
            disabled={loading}
          >
            🤖 AI Essay (GPT-4)
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <Upload size={14} /> Upload (.txt, .docx)
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt,.docx"
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text to analyze (minimum ~30 words recommended)..."
          rows={9}
          style={{
            width: '100%',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '1rem',
            color: 'var(--text-main)',
            fontSize: '0.98rem',
            fontFamily: 'var(--font-body)',
            lineHeight: '1.6',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary-cyan)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
        />
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span><strong>{wordCount}</strong> words</span>
          <span><strong>{charCount}</strong> characters</span>
          {wordCount > 0 && wordCount < 50 && (
            <span style={{ color: 'var(--accent-amber)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={14} /> 50+ words recommended
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {text.length > 0 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setText('')}
              disabled={loading}
            >
              <RotateCcw size={14} /> Clear
            </button>
          )}

          <button
            type="button"
            className="btn-primary"
            onClick={onAnalyze}
            disabled={loading || wordCount < 10}
          >
            {loading ? (
              <>Extracting Stylometrics...</>
            ) : (
              <>
                <Play size={16} fill="currentColor" /> Analyze Text
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
