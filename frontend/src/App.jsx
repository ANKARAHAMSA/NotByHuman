import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsGauge from './components/ResultsGauge';
import FeatureCards from './components/FeatureCards';
import SentenceHeatmap from './components/SentenceHeatmap';
import Disclaimer from './components/Disclaimer';

const API_BASE = '/api';

export default function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [samples, setSamples] = useState(null);
  const [error, setError] = useState(null);

  // Fetch preset samples on mount
  useEffect(() => {
    fetch(`${API_BASE}/samples`)
      .then(res => res.json())
      .then(data => setSamples(data))
      .catch(() => {
        setSamples({
          human: {
            title: "Human Sample",
            text: "Walking through the old quarter of Montreal on a chilly November dusk always makes me think about how buildings hold memory. The cobblestones underfoot are slick with early evening mist, and the flickering streetlamps cast long, distorted shadows across granite facades. I remember stopping outside a small bakery near Saint-Denis—the smell of fresh cardamom and espresso drifting out through a heavy wooden door. It wasn't planned; I just stumbled in to escape the wind. That's what I love about older cities: they force you into unscripted moments."
          },
          ai: {
            title: "AI Sample",
            text: "Furthermore, urban architecture serves as a testament to the ever-evolving interplay between human innovation and societal needs. In conclusion, it is important to note that modern city planning plays a pivotal role in fostering sustainable community growth. Notably, historical facades seamlessly bridge the gap between tradition and modernity. Moreover, by harnessing multifaceted design principles, contemporary architects can create spaces that not only accommodate rising populations but also enrich the cultural tapestry of urban environments."
          }
        });
      });
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to analyze text');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (type) => {
    if (samples && samples[type]) {
      setText(samples[type].text);
      setResults(null);
      setError(null);
    }
  };

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'File analysis failed');
      }

      const data = await response.json();
      setResults(data);
      if (data.extracted_text) {
        setText(data.extracted_text);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-viewport glitch-bg-active">
      <div className="scanline-overlay" />

      <div className="centered-container">
        <Header />

        <InputSection
          text={text}
          setText={setText}
          onAnalyze={handleAnalyze}
          loading={loading}
          onLoadSample={handleLoadSample}
          onFileUpload={handleFileUpload}
        />

        {error && (
          <div className="glass-panel" style={{
            padding: '1rem 1.25rem',
            background: 'rgba(244, 63, 94, 0.2)',
            borderColor: 'rgba(244, 63, 94, 0.4)',
            color: '#ffffff',
            marginBottom: '2rem',
            fontSize: '0.95rem'
          }}>
            ⚠️ <strong>Error:</strong> {error}
          </div>
        )}

        {results && (
          <>
            <ResultsGauge results={results} />
            
            <FeatureCards
              metrics={results.metrics}
              explanations={results.explanations}
              flaggedPhrases={results.flagged_phrases}
            />

            <SentenceHeatmap sentences={results.sentence_highlights} />
          </>
        )}

        <Disclaimer />

        <footer style={{
          textAlign: 'center',
          paddingTop: '3rem',
          marginTop: '3rem',
          borderTop: '1px solid var(--border-glass)',
          color: 'var(--text-dim)',
          fontSize: '0.85rem'
        }}>
          NotByHuman — Open Stylometric AI Detection Intelligence Platform
        </footer>
      </div>
    </div>
  );
}
