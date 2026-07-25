import React, { useRef, useState } from 'react';
import { Upload, FileText, Play, RotateCcw, AlertCircle, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function InputSection({
  text,
  setText,
  onAnalyze,
  loading,
  onLoadSample,
  onFileUpload
}) {
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.75rem',
        border: dragOver ? '2px dashed var(--primary-cyan)' : '1px solid var(--border-glass)',
        transition: 'all 0.2s ease'
      }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Centered Workspace Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} color="var(--primary-cyan)" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
            Input Workspace (Text or Photo)
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
            onClick={() => imageInputRef.current?.click()}
            disabled={loading}
            title="Upload photo or screenshot of text"
          >
            <ImageIcon size={14} color="var(--primary-cyan)" /> Upload Photo / Screenshot
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
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleFileChange}
            accept=".png,.jpg,.jpeg,.webp"
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Main Centered Input Area */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Copy and paste text here, or drag & drop a text document / photo screenshot of text..."
          rows={10}
          style={{
            width: '100%',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '1.1rem',
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

      {/* Input Action Controls & Counter */}
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
              <>
                <Sparkles size={16} className="animate-spin" /> Inspecting...
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" /> Analyze Text / Photo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
