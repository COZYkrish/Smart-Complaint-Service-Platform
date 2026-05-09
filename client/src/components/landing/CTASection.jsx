import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            borderRadius: '32px',
            padding: 'clamp(60px, 8vw, 100px) clamp(40px, 6vw, 80px)',
            textAlign: 'center',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Background glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          {/* Top border gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '20%',
              right: '20%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(168,85,247,0.6), transparent)',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="text-caption" style={{ marginBottom: '20px', display: 'block', color: '#818cf8' }}>
              Start Today
            </span>
            <h2 className="text-headline" style={{ marginBottom: '20px' }}>
              Ready to transform your{' '}
              <span className="gradient-text">service experience?</span>
            </h2>
            <p className="text-body" style={{ maxWidth: '480px', margin: '0 auto 48px', fontSize: '1.0625rem' }}>
              Join thousands of teams delivering exceptional service. Free to start, scales with you.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg" id="cta-section-register">
                Create Free Account
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg" id="cta-section-login">
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
