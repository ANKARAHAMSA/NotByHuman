import React, { useState, useEffect, useRef } from 'react';
import WhiteLogoHero from './components/WhiteLogoHero';
import InputSection from './components/InputSection';
import ResultsGauge from './components/ResultsGauge';
import FeatureCards from './components/FeatureCards';
import SentenceHeatmap from './components/SentenceHeatmap';
import DisclaimerModal from './components/DisclaimerModal';

const API_BASE = '/api';

const DEFAULT_HUMAN_SAMPLES = [
  "Walking through the old quarter of Montreal on a chilly November dusk always makes me think about how buildings hold memory. The cobblestones underfoot are slick with early evening mist, and the flickering streetlamps cast long, distorted shadows across granite facades. I remember stopping outside a small bakery near Saint-Denis—the smell of fresh cardamom and espresso drifting out through a heavy wooden door. It wasn't planned; I just stumbled in to escape the wind. That's what I love about older cities: they force you into unscripted moments.",
  "There is something irreplaceable about pulling a vinyl record from its sleeve, dropping the stylus into the groove, and listening to the faint, warm crackle before the music starts. In a stream-everything world where millions of tracks sit behind glass touchscreens, playing vinyl forces patience. You listen to an entire album side uninterrupted—embracing imperfections, subtle surface pops, and sleeve art like a slow ritual.",
  "My grandmother never cooked with measuring spoons. She measured flour by the handful, judged salt by a quick pinch, and knew a chicken stew was finished simply by the sound of the simmer. Trying to write down her recipes for a family cookbook turned out to be nearly impossible. Whenever I asked for exact quantities, she would laugh and say, 'You don't measure with cups, child—you listen with your nose.'",
  "Debugging code at 2 AM feels like conversing with a stubborn ghost in the machine. A single missing semicolon or off-by-one array index can derail an entire data pipeline, yet hunting it down through stack traces brings a weird sense of quiet triumph. When the terminal finally prints green checkmarks after hours of frustration, the sheer relief makes you forget how exhausted you actually are.",
  "Reaching the mountain ridge just as dawn breaks, the fog still clings to the pines below like a sea of white cotton. Your lungs burn from the freezing high-altitude air and your calves ache from three hours of climbing in darkness, but the silence up here is absolute. Watching the morning sun hit the granite peak reminds you how small our daily anxieties really are."
];

const DEFAULT_AI_SAMPLES = [
  "Furthermore, urban architecture serves as a testament to the ever-evolving interplay between human innovation and societal needs. In conclusion, it is important to note that modern city planning plays a pivotal role in fostering sustainable community growth. Notably, historical facades seamlessly bridge the gap between tradition and modernity. Moreover, by harnessing multifaceted design principles, contemporary architects can create spaces that not only accommodate rising populations but also enrich the cultural tapestry of urban environments. Crucially, these developments underscore the paramount importance of holistic infrastructure.",
  "In today's fast-paced digital landscape, leveraging synergistic paradigms is crucial for driving sustainable enterprise growth. Moreover, by seamlessly integrating cutting-edge cloud architectures with data-driven operational frameworks, organizations can optimize cross-functional efficiency. Ultimately, fostering an agile corporate ecosystem empowers stakeholders to navigate market complexities while maximizing long-term value creation. In conclusion, continuous innovation remains paramount.",
  "Technology has undoubtedly revolutionized the way humans communicate, work, and interact with their surrounding environments. In the modern era, artificial intelligence plays an increasingly pivotal role across diverse sectors including healthcare, finance, and education. Furthermore, it is essential to emphasize that ethical considerations must guide the implementation of autonomous systems. Consequently, establishing robust regulatory frameworks is paramount to ensuring societal alignment and security.",
  "To comprehensively analyze the global implications of climate change, one must evaluate multifaceted environmental and economic metrics. Crucially, empirical evidence underscores that transitioning toward renewable energy grids requires strategic policy intervention. Moreover, by aligning international regulatory standards with fiscal incentives, governments can catalyze private sector investment. In conclusion, holistic cooperation is indispensable for long-term ecological stability.",
  "While proponents argue that remote work models enhance individual autonomy and work-life balance, critics contend that distributed environments may hinder spontaneous collaborative synergy. On one hand, flexibility reduces commuting overhead and increases focus time. On the other hand, maintaining organizational cohesion requires deliberate communication structures. Ultimately, a balanced hybrid approach offers a sustainable middle ground."
];

export default function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [samplePools, setSamplePools] = useState({ human: DEFAULT_HUMAN_SAMPLES, ai: DEFAULT_AI_SAMPLES });
  const [lastHumanIdx, setLastHumanIdx] = useState(-1);
  const [lastAiIdx, setLastAiIdx] = useState(-1);
  const [error, setError] = useState(null);

  const workspaceRef = useRef(null);
  const heroRef = useRef(null);
  const bgLogoRef = useRef(null);
  const bgGlitchRef = useRef(null);
  const pointerLeakRef = useRef(null);

  // Mouse cursor tracking for interactive pointer light leaks & custom lens follower
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = `${e.clientX}px`;
      const y = `${e.clientY}px`;
      document.documentElement.style.setProperty('--mouse-x', x);
      document.documentElement.style.setProperty('--mouse-y', y);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Zero-Lag Direct GPU Composited Scroll Engine
  useEffect(() => {
    let ticking = false;

    const updateScrollGPU = () => {
      const vh = window.innerHeight || 800;
      const scrollY = window.scrollY;

      // Page 1 Hero opacity: 1 -> 0 cleanly between scroll 0 and 0.45 * vh
      const heroProgress = Math.min(1, Math.max(0, scrollY / (vh * 0.45)));
      const heroOpacity = (1 - heroProgress).toFixed(3);
      const heroScale = (1 - (heroProgress * 0.12)).toFixed(3);

      // Page 2 Glitch background opacity: 0 -> 1 cleanly between 0.25 * vh and 0.75 * vh
      const glitchProgress = Math.min(1, Math.max(0, (scrollY - (vh * 0.25)) / (vh * 0.5)));
      const glitchOpacity = glitchProgress.toFixed(3);
      const glitchScale = (1.06 - (glitchProgress * 0.06)).toFixed(3);
      const translateY = ((1 - glitchProgress) * 45).toFixed(1);

      // Direct GPU Style Updates on DOM elements (Zero DOM Tree Recalculation)
      if (bgLogoRef.current) {
        bgLogoRef.current.style.opacity = heroOpacity;
      }
      if (heroRef.current) {
        heroRef.current.style.opacity = heroOpacity;
        heroRef.current.style.transform = `scale(${heroScale}) translate3d(0, 0, 0)`;
      }
      if (bgGlitchRef.current) {
        bgGlitchRef.current.style.opacity = glitchOpacity;
        bgGlitchRef.current.style.transform = `scale(${glitchScale}) translate3d(0, 0, 0)`;
      }
      if (pointerLeakRef.current) {
        pointerLeakRef.current.style.opacity = glitchOpacity;
      }
      if (workspaceRef.current) {
        workspaceRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollGPU);
        ticking = true;
      }
    };

    // Initial positioning
    updateScrollGPU();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch preset samples on mount
  useEffect(() => {
    fetch(`${API_BASE}/samples`)
      .then(res => res.json())
      .then(data => {
        if (data.human_samples && data.ai_samples) {
          setSamplePools({
            human: data.human_samples.map(s => s.text),
            ai: data.ai_samples.map(s => s.text)
          });
        }
      })
      .catch(() => {
        // Fallback to default local sample pools
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
    const pool = samplePools[type] || (type === 'human' ? DEFAULT_HUMAN_SAMPLES : DEFAULT_AI_SAMPLES);
    if (!pool || pool.length === 0) return;

    let nextIdx;
    const lastIdx = type === 'human' ? lastHumanIdx : lastAiIdx;

    if (pool.length === 1) {
      nextIdx = 0;
    } else {
      do {
        nextIdx = Math.floor(Math.random() * pool.length);
      } while (nextIdx === lastIdx);
    }

    if (type === 'human') setLastHumanIdx(nextIdx);
    else setLastAiIdx(nextIdx);

    setText(pool[nextIdx]);
    setResults(null);
    setError(null);
    scrollToWorkspace();
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
      {/* Sleek Custom Magnifying Lens Follower */}
      <div className="custom-cursor-lens" />

      {/* Dynamic Animated Cyber Noise Atmosphere Overlay */}
      <div className="cyber-noise-overlay" />

      {/* Dual Dynamic Background Cross-Fade Layers */}
      <div ref={bgLogoRef} className="bg-layer-logo" />
      <div ref={bgGlitchRef} className="bg-layer-glitch" />

      {/* Interactive Mouse Pointer Light Leak Flare on Page 2 */}
      <div ref={pointerLeakRef} className="pointer-light-leak" />

      {/* PAGE 1: Full-Bleed Logo Background Landing Section */}
      <div ref={heroRef} className="hero-page-section">
        <WhiteLogoHero onScrollToWorkspace={scrollToWorkspace} />
      </div>

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
