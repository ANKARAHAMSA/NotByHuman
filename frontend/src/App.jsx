import React, { useState, useEffect, useRef } from 'react';
import WhiteLogoHero from './components/WhiteLogoHero';
import InputSection from './components/InputSection';
import ResultsGauge from './components/ResultsGauge';
import FeatureCards from './components/FeatureCards';
import SentenceHeatmap from './components/SentenceHeatmap';
import DisclaimerModal from './components/DisclaimerModal';

const API_BASE = '/api';

export default function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [samples, setSamples] = useState(null);
  const [error, setError] = useState(null);

  const workspaceRef = useRef(null);

  // Mouse cursor tracking for interactive pointer light leaks
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = `${e.clientX}px`;
      const y = `${e.clientY}px`;
      document.documentElement.style.setProperty('--mouse-x', x);
      document.documentElement.style.setProperty('--mouse-y', y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 60FPS / 120FPS Inertial Physics Lerp Scroll Engine
  useEffect(() => {
    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let animationFrameId = null;

    const onScroll = () => {
      targetY = window.scrollY;
    };

    const updatePhysics = () => {
      // Smooth linear interpolation (lerp factor = 0.12)
      currentY += (targetY - currentY) * 0.12;

      // Calculate smooth interpolation factors
      const vh = window.innerHeight || 800;

      // Page 1 Hero fades out cleanly between 0 and 0.45 * vh
      const heroProgress = Math.min(1, Math.max(0, currentY / (vh * 0.45)));
      const heroOpacity = 1 - heroProgress;
      const heroScale = 1 - (heroProgress * 0.12);

      // Page 2 Glitch background fades in cleanly between 0.25 * vh and 0.8 * vh
      const glitchProgress = Math.min(1, Math.max(0, (currentY - (vh * 0.25)) / (vh * 0.55)));
      const glitchOpacity = glitchProgress;
      const glitchScale = 1.06 - (glitchProgress * 0.06);
      const translateY = (1 - glitchProgress) * 45;

      document.documentElement.style.setProperty('--hero-opacity', heroOpacity.toFixed(4));
      document.documentElement.style.setProperty('--hero-scale', heroScale.toFixed(4));
      document.documentElement.style.setProperty('--glitch-opacity', glitchOpacity.toFixed(4));
      document.documentElement.style.setProperty('--glitch-scale', glitchScale.toFixed(4));
      document.documentElement.style.setProperty('--workspace-translateY', `${translateY.toFixed(2)}px`);

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

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

  const scrollToWorkspace = () => {
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      scrollToWorkspace();
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
      scrollToWorkspace();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-viewport">
      {/* Dynamic Animated Cyber Noise Atmosphere Overlay */}
      <div className="cyber-noise-overlay" />

      {/* Dual Dynamic Background Cross-Fade Layers */}
      <div className="bg-layer-logo" />
      <div className="bg-layer-glitch" />

      {/* Interactive Mouse Pointer Light Leak Flare on Page 2 */}
      <div className="pointer-light-leak" />

      {/* PAGE 1: Full-Bleed Logo Background Landing Section */}
      <WhiteLogoHero onScrollToWorkspace={scrollToWorkspace} />

      {/* PAGE 2: Centered Search Workspace Section */}
      <div ref={workspaceRef} className="workspace-page-section">
        <div className="centered-container">
          {/* Compact Capsule Pill Search Bar */}
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

          <footer style={{
            textAlign: 'center',
            paddingTop: '3rem',
            marginTop: '3rem',
            borderTop: '1px solid var(--border-glass)',
            color: 'var(--text-dim)',
            fontSize: '0.85rem'
          }}>
            NotByHuman — DETECT. VERIFY. EXPOSE.
          </footer>
        </div>
      </div>

      {/* Floating Animated "?" Disclaimer Modal */}
      <DisclaimerModal />
    </div>
  );
}
