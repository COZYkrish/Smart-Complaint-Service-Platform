import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { MagneticLink } from '../ui/UIEffects';

/* ── CTA 3D Background Model ────────────────────────────── */
function CTAModel() {
  const group = useRef();
  const ring1  = useRef();
  const ring2  = useRef();
  const ring3  = useRef();
  const core   = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) group.current.rotation.y = t * 0.06;
    if (ring1.current) { ring1.current.rotation.x = t * 0.12; ring1.current.rotation.z = t * 0.05; }
    if (ring2.current) { ring2.current.rotation.y = t * 0.09; ring2.current.rotation.z = -t * 0.07; }
    if (ring3.current) { ring3.current.rotation.x = -t * 0.08; ring3.current.rotation.y = t * 0.1; }
    if (core.current) {
      const s = 1 + Math.sin(t * 1.1) * 0.04;
      core.current.scale.setScalar(s);
      core.current.rotation.x = t * 0.2;
      core.current.rotation.y = t * 0.3;
    }
  });

  return (
    <group ref={group}>
      {/* Core icosahedron */}
      <mesh ref={core}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.15} />
      </mesh>
      {/* Orbit rings */}
      <mesh ref={ring1}>
        <torusGeometry args={[2.4, 0.006, 8, 200]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[3.2, 0.004, 8, 200]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>
      <mesh ref={ring3}>
        <torusGeometry args={[4.0, 0.003, 8, 200]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </mesh>
      {/* Small floating cubes */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 2.4, Math.sin(angle) * 0.5, Math.sin(angle) * 2.4]}
          >
            <boxGeometry args={[0.08, 0.08, 0.08]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Flash Effect ───────────────────────────────────────── */
function CameraFlash({ trigger }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 120);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      style={{
        position: 'fixed', inset: 0, background: '#ffffff',
        zIndex: 9000, pointerEvents: 'none',
      }}
    />
  );
}

/* ── CTASection ─────────────────────────────────────────── */
export default function CTASection() {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true, margin: '-100px' });
  const [flashed, setFlashed] = useState(false);

  // Trigger flash on section enter
  useEffect(() => {
    if (inView && !flashed) {
      const t = setTimeout(() => setFlashed(true), 200);
      return () => clearTimeout(t);
    }
  }, [inView]);

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-20px', '20px']);

  return (
    <section
      ref={sectionRef}
      className="section-padding"
      style={{
        position: 'relative', background: '#000000',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <CameraFlash trigger={flashed} />

      {/* Full-bleed 3D canvas background */}
      <motion.div
        style={{
          position: 'absolute', inset: 0, y: bgY,
          pointerEvents: 'none', zIndex: 0,
          opacity: 0.5,
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 7], fov: 55 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <ambientLight intensity={0.05} />
          <pointLight position={[4, 4, 4]} intensity={1.2} color="#ffffff" />
          <Float floatIntensity={0.2} speed={0.8}>
            <CTAModel />
          </Float>
        </Canvas>
      </motion.div>

      {/* Noise overlay */}
      <div className="noise-overlay" style={{ zIndex: 1 }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.92) 80%)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Content */}
      <motion.div
        ref={ref}
        className="container-narrow"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}
      >
        {/* Chapter label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginBottom: '32px' }}
        >
          <span className="chapter-label">Chapter 04 — The Call</span>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{ marginBottom: '28px' }}
        >
          <span className="text-caption" style={{ color: '#333333' }}>Your story starts here</span>
        </motion.div>

        {/* Big headline */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            fontWeight: 700, color: '#ffffff',
            lineHeight: 1.05, letterSpacing: '-0.04em',
            marginBottom: '28px',
          }}
        >
          Are you{' '}
          <span className="gradient-text">ready?</span>
        </motion.h2>

        {/* Sub-text */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.55 }}
          style={{
            fontSize: '1.0625rem', color: '#555555',
            maxWidth: '420px', margin: '0 auto 56px',
            lineHeight: 1.75, fontStyle: 'italic',
          }}
        >
          Join thousands of teams delivering exceptional service.
          Free to start, scales with you.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <MagneticLink
            to="/register"
            id="cta-section-register"
            className="btn btn-primary btn-lg"
          >
            Create Free Account
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </MagneticLink>
          <MagneticLink
            to="/login"
            id="cta-section-login"
            className="btn btn-outline btn-lg"
          >
            Sign In
          </MagneticLink>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.0 }}
          style={{ marginTop: '80px' }}
        >
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.5625rem', letterSpacing: '0.3em',
            color: '#222222', textTransform: 'uppercase',
          }}>
            — End of Chapter 04 —
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
