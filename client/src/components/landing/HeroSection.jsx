import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'framer-motion';
import HeroCanvas from './HeroCanvas';
import { MagneticLink, useScramble } from '../ui/UIEffects';

/* ── Word 3D flip reveal ─────────────────────────────────── */
const words = ['Resolve', 'Every', 'Complaint', 'Intelligently.'];

function Word3D({ word, index, highlight }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.span
      ref={ref}
      initial={{ rotateX: 90, opacity: 0, y: 16 }}
      animate={inView ? { rotateX: 0, opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay: index * 0.13 + 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'inline-block',
        transformOrigin: '50% 0%',
        transformStyle: 'preserve-3d',
        color: highlight ? 'transparent' : '#ffffff',
        background: highlight
          ? 'linear-gradient(135deg, #ffffff 0%, #666666 50%, #ffffff 100%)'
          : undefined,
        backgroundSize: highlight ? '200% auto' : undefined,
        WebkitBackgroundClip: highlight ? 'text' : undefined,
        backgroundClip: highlight ? 'text' : undefined,
        animation: highlight ? 'shimmer-text 3s linear infinite' : undefined,
        lineHeight: 1.05,
      }}
    >
      {word}
    </motion.span>
  );
}



/* ── HeroSection ─────────────────────────────────────────── */
export default function HeroSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const scrollSmooth = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  /* Parallax transforms — subtle so buttons stay visible */
  const contentY       = useTransform(scrollSmooth, [0, 1], ['0%', '18%']);
  const contentOpacity = useTransform(scrollSmooth, [0, 0.7], [1, 0]);

  /* Scramble eyebrow */
  const [triggered, setTriggered] = useState(false);
  const scrambled = useScramble('SMART SERVICE PLATFORM', triggered);
  useEffect(() => { const t = setTimeout(() => setTriggered(true), 500); return () => clearTimeout(t); }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#000000',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Scanlines */}
      <div className="scanline-overlay" />

      {/* Background dot-grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
      }} />

      {/* Right-side vignette to blend 3D into black */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 42%, rgba(0,0,0,0.1) 65%, transparent 100%)',
      }} />

      {/* ── 3D CANVAS — fills entire right side ─────────────── */}
      <div style={{
        position: 'absolute',
        right: '-2%',
        top: '0',
        width: '62%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      }}>
        <HeroCanvas scrollProgress={scrollYProgress} />
      </div>

      {/* ── LEFT CONTENT ────────────────────────────────────── */}
      <motion.div
        style={{
          position: 'relative', zIndex: 10,
          y: contentY, opacity: contentOpacity,
          width: '100%',
        }}
      >
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '0 40px',
        }}>
          {/* Content column — max 52% wide on desktop */}
          <div style={{ maxWidth: '560px' }}>

            {/* Chapter label */}
            <motion.span
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="chapter-label"
              style={{ display: 'block', marginBottom: '20px' }}
            >
              Chapter 01 — The Awakening
            </motion.span>

            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ marginBottom: '28px' }}
            >
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '5px 16px',
                border: '1px solid rgba(255,255,255,0.12)',
                fontSize: '0.65rem', fontWeight: 600, color: '#666666',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                fontFamily: 'Space Mono, monospace',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <span style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: '#ffffff', display: 'inline-block',
                  animation: 'breathe 2s ease-in-out infinite',
                }} />
                {scrambled}
              </span>
            </motion.div>

            {/* Headline — 3D word flip */}
            <h1
              className="text-display"
              style={{
                marginBottom: '20px',
                display: 'flex', flexWrap: 'wrap',
                gap: '0.22em',
                fontSize: 'clamp(2.6rem, 5.5vw, 5.5rem)',
                perspective: '700px',
                perspectiveOrigin: '0% 50%',
              }}
            >
              {words.map((word, i) => (
                <Word3D key={i} word={word} index={i} highlight={i === 2} />
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: '0.9875rem', color: '#555555', lineHeight: 1.75,
                marginBottom: '36px', maxWidth: '440px', fontWeight: 400,
              }}
            >
              A cinematic platform for submitting, tracking, and resolving
              service complaints — with real-time updates and intelligent routing.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '48px' }}
            >
              <MagneticLink
                to="/register"
                id="hero-cta-primary"
                className="btn btn-primary btn-lg"
              >
                Get Started
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </MagneticLink>

              <MagneticLink
                to="#features"
                id="hero-cta-secondary"
                className="btn btn-outline btn-lg"
              >
                See How It Works
              </MagneticLink>
            </motion.div>


          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
        style={{
          position: 'absolute', bottom: '28px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '8px', zIndex: 10,
        }}
      >
        <span style={{
          fontSize: '0.55rem', color: '#2a2a2a',
          letterSpacing: '0.28em', textTransform: 'uppercase',
          fontFamily: 'Space Mono, monospace',
        }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          style={{
            width: '1px', height: '40px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
          }}
        />
      </motion.div>
    </section>
  );
}
