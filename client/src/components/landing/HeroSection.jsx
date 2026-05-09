import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroCanvas from './HeroCanvas';

const words = ['Resolve', 'Every', 'Complaint', 'Intelligently.'];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
};

const wordVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] } },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 1.6, ease: [0.22, 1, 0.36, 1] } },
};

const statsVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, delay: 2.0 } },
};

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient blobs */}
      <div
        style={{
          position: 'absolute',
          width: '60vw',
          height: '60vw',
          maxWidth: '800px',
          maxHeight: '800px',
          right: '-10%',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.06) 40%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '30vw',
          height: '30vw',
          left: '5%',
          bottom: '10%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 60%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      {/* 3D Canvas — right half */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '55%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <HeroCanvas />
      </div>

      {/* Content — left half */}
      <div className="container-wide" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '580px' }}>
          {/* Eyebrow label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: '32px' }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '999px',
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.25)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#818cf8',
                letterSpacing: '0.04em',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: 'breathe 2s ease-in-out infinite' }} />
              Smart Service Platform
            </span>
          </motion.div>

          {/* Headline — word by word */}
          <motion.h1
            className="text-display"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '0.25em', lineHeight: 1.05 }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                style={{
                  display: 'inline-block',
                  background: i === 2 ? 'linear-gradient(135deg, #6366f1, #a855f7, #06b6d4)' : undefined,
                  WebkitBackgroundClip: i === 2 ? 'text' : undefined,
                  backgroundClip: i === 2 ? 'text' : undefined,
                  WebkitTextFillColor: i === 2 ? 'transparent' : undefined,
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-body"
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
            style={{ fontSize: '1.125rem', marginBottom: '48px', maxWidth: '480px' }}
          >
            A premium platform for submitting, tracking, and resolving service complaints
            with real-time updates, intelligent routing, and a cinematic experience.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={ctaVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '64px' }}
          >
            <Link to="/register" className="btn btn-primary btn-lg" id="hero-cta-primary">
              Get Started Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a href="#features" className="btn btn-outline btn-lg" id="hero-cta-secondary">
              See How It Works
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={statsVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}
          >
            {[
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '<2h', label: 'Avg Resolution' },
              { value: '50K+', label: 'Issues Resolved' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          style={{
            width: '24px',
            height: '40px',
            borderRadius: '12px',
            border: '1.5px solid rgba(255,255,255,0.12)',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '8px',
          }}
        >
          <div style={{ width: '4px', height: '8px', borderRadius: '2px', background: 'rgba(99,102,241,0.8)' }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
