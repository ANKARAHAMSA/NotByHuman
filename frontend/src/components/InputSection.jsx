import React, { useRef, useState } from 'react';
import { Search, Upload, Sparkles, Clipboard, Check, User, Bot, Zap } from 'lucide-react';

export default function InputSection({
  text,
  setText,
  onAnalyze,
  loading,
  onLoadSample,
  onFileUpload
}) {
  const unifiedFileInputRef = useRef(null);
  const [copied, setCopied] = useState(false);

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
          placeholder="Paste text, upload document (.txt, .docx), or photo screenshot to check..."
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

          {/* SINGLE UNIFIED UPLOAD BUTTON FOR ALL DOCUMENTS AND IMAGES */}
          <button
            type="button"
            className="pill-icon-btn"
            onClick={() => unifiedFileInputRef.current?.click()}
            title="Upload Document (.txt, .docx) or Photo Screenshot for OCR"
          >
            <Upload size={16} color="#f97316" />
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

        {/* Universal Hidden File Input */}
        <input
          type="file"
          ref={unifiedFileInputRef}
          onChange={handleFileChange}
          accept=".txt,.docx,.png,.jpg,.jpeg,.webp"
          style={{ display: 'none' }}
        />
      </div>

      {/* HIGH-CONCEPT INTERACTIVE PRESET CYBER CHIPS */}
      <div className="preset-chip-container">
        <div className="preset-badge">
          <Zap size={14} color="#f97316" /> Quick Demo Samples:
        </div>

        <button
          type="button"
          className="preset-chip-human"
          onClick={() => onLoadSample('human')}
          title="Load authentic human-written essay sample"
        >
          <User size={18} color="#f97316" />
          <span>Human Essay Sample</span>
        </button>

        <button
          type="button"
          className="preset-chip-ai"
          onClick={() => onLoadSample('ai')}
          title="Load AI (GPT-4) generated essay sample"
        >
          <Bot size={18} color="#06b6d4" />
          <span>AI Essay (GPT-4) Sample</span>
        </button>
      </div>
    </div>
  );
}
