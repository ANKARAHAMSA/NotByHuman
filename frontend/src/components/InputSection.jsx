import React, { useRef, useState } from 'react';
import { Search, Upload, Image as ImageIcon, Sparkles, Clipboard, Check } from 'lucide-react';

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
  const [copied, setCopied] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setText(clipText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      alert("Unable to access clipboard. Please paste text directly into the pill box.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim() && !loading) {
        onAnalyze();
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
      {/* Sleek Pill Search Bar */}
      <div className="pill-search-container">
        {/* Laser Scanner animation during inference */}
        {loading && <div className="pill-laser-beam" />}

        {/* Magnifying Glass Icon */}
        <Search size={22} color="#ffffff" style={{ flexShrink: 0 }} />

        {/* Text Input Field */}
        <input
          type="text"
          className="pill-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste text, drop document, or upload photo screenshot to check if AI or Human..."
        />

        {/* Action Controls inside Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            type="button"
            className="pill-icon-btn"
            onClick={handlePasteClipboard}
            title="Paste from Clipboard"
          >
            {copied ? <Check size={16} color="var(--accent-green)" /> : <Clipboard size={16} />}
          </button>

          <button
            type="button"
            className="pill-icon-btn"
            onClick={() => imageInputRef.current?.click()}
            title="Upload photo / screenshot of text for OCR"
          >
            <ImageIcon size={16} color="#f97316" />
          </button>

          <button
            type="button"
            className="pill-icon-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload .txt or .docx file"
          >
            <Upload size={16} />
          </button>

          <button
            type="button"
            className="pill-action-btn"
            onClick={onAnalyze}
            disabled={loading || !text.trim()}
          >
            {loading ? (
              <>
                <Sparkles size={16} className="animate-spin" /> Scanning...
              </>
            ) : (
              <>Inspect</>
            )}
          </button>
        </div>

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

      {/* Preset Quick Loader Links */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--text-dim)' }}>Quick Preset Samples:</span>
        <button
          type="button"
          onClick={() => onLoadSample('human')}
          style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}
        >
          👤 Human Essay
        </button>
        <span style={{ color: 'var(--text-dim)' }}>|</span>
        <button
          type="button"
          onClick={() => onLoadSample('ai')}
          style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}
        >
          🤖 AI Essay (GPT-4)
        </button>
      </div>
    </div>
  );
}
