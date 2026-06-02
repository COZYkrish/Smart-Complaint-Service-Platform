import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'framer-motion';
import HeroCanvas from './HeroCanvas';
import { MagneticLink, useScramble } from '../ui/UIEffects';

/* ── Word-by-word 3D flip reveal ───────────────────────── */
const words = ['Resolve', 'Every', 'Complaint', 'Intelligently.'];

function Word3D({ word, index, highlight }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.span
      ref={ref}
      initial={{ rotateX: 90, opacity: 0, y: 20 }}
      animate={inView ? { rotateX: 0, opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: index * 0.15 + 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        display: 'inline-block',
        transformOrigin: '50% 0%',
        transformStyle: 'preserve-3d',
        color: highlight ? 'transparent' : '#ffffff',
        background: highlight
          ? 'linear-gradient(135deg, #ffffff 0%, #777777 50%, #ffffff 100%)'
          : undefined,
        backgroundSize: highlight ? '200% auto' : undefined,
        WebkitBackgroundClip: highlight ? 'text' : undefined,
        backgroundClip: highlight ? 'text' : undefined,
        animation: highlight ? 'shimmer-text 3s linear infinite' : undefined,
      }}
    >
      {word}
    </motion.span>
  );
}

/* ── Animated stat counter ──────────────────────────────── */
function StatItem({ value, label, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative', paddingLeft: '20px' }}
    >
      {/* Left accent line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.4, delay: delay + 0.2 }}
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: '1px', background: 'rgba(255,255,255,0.2)',
          transformOrigin: 'top',
        }}
      />
      <div style={{
        fontSize: '2rem', fontWeight: 700, color: '#ffffff',
        lineHeight: 1, fontFamily: 'Space Mono, monospace',
        letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '0.6875rem', color: '#444444', marginTop: '6px',
        fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
        fontFamily: 'Space Mono, monospace',
      }}>
        {label}
      </div>
    </motion.div>
  );
}

/* ── Main HeroSection ───────────────────────────────────── */
export default function HeroSection() {
  const sectionRef = useRef(null);

  // Scroll-driven parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const scrollProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  // Parallax transforms
  const contentY    = useTransform(scrollProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollProgress, [0, 0.6], [1, 0]);
  const contentScale   = useTransform(scrollProgress, [0, 1], [1, 0.88]);
  const bgY         = useTransform(scrollProgress, [0, 1], ['0%', '15%']);

  // Eyebrow label scramble
  const [triggered, setTriggered] = useState(false);
  const scrambled = useScramble('Smart Service Platform', triggered);
  useEffect(() => {
    const timer = setTimeout(() => setTriggered(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: '#000000',
      }}
    >
      {/* Scanlines */}
      <div className="scanline-overlay" />

      {/* Background grid */}
      <motion.div
        style={{ y: bgY, position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)"/>
        </svg>
      </motion.div>

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)',
        zIndex: 1,
      }} />

      {/* 3D Canvas — right */}
      <div style={{
        position: 'absolute', right: 0, top: 0,
        width: '58%', height: '100%', pointerEvents: 'none', zIndex: 2,
      }}>
        <HeroCanvas scrollProgress={scrollYProgress} />
      </div>

      {/* Content — left */}
      <motion.div
        className="container-wide"
        style={{
          position: 'relative', zIndex: 10,
          y: contentY, opacity: contentOpacity, scale: contentScale,
        }}
      >
        <div style={{ maxWidth: '600px' }}>

          {/* Chapter label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '28px' }}
          >
            <span className="chapter-label">Chapter 01 — The Awakening</span>
          </motion.div>

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ marginBottom: '36px' }}
          >
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '6px 18px',
                border: '1px solid rgba(255,255,255,0.12)',
                fontSize: '0.75rem', fontWeight: 600, color: '#888888',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                fontFamily: 'Space Mono, monospace',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
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
              marginBottom: '28px',
              display: 'flex', flexWrap: 'wrap',
              gap: '0.28em', lineHeight: 1.02,
              perspective: '800px',
              perspectiveOrigin: '50% 50%',
            }}
          >
            {words.map((word, i) => (
              <Word3D key={i} word={word} index={i} highlight={i === 2} />
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: '1.0625rem', color: '#666666', lineHeight: 1.75,
              marginBottom: '52px', maxWidth: '460px',
              fontWeight: 400,
            }}
          >
            A cinematic platform for submitting, tracking, and resolving
            service complaints — with real-time updates and intelligent routing.
          </motion.p>

          {/* CTA Buttons — 3D Magnetic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.8 }}
            style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '72px' }}
          >
            <MagneticLink
              to="/register"
              id="hero-cta-primary"
              className="btn btn-primary btn-lg"
            >
              Get Started
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.2 }}
            style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}
          >
            <StatItem value="99.9%" label="Uptime SLA"      delay={2.3} />
            <StatItem value="< 2h"  label="Avg Resolution"  delay={2.4} />
            <StatItem value="50K+"  label="Issues Resolved"  delay={2.5} />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
        style={{
          position: 'absolute', bottom: '36px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '10px', zIndex: 10,
        }}
      >
        <span style={{
          fontSize: '0.625rem', color: '#333333',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          fontFamily: 'Space Mono, monospace',
        }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          style={{
            width: '1px', height: '48px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
          }}
        />
      </motion.div>
    </section>
  );
}
