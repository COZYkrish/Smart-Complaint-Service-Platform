import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/* ── Mini 3D Model per card ─────────────────────────────── */
function FeatureModel3D({ type }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.4;
    ref.current.rotation.y = t * 0.6;
  });

  const getGeometry = () => {
    switch (type) {
      case 0: return <torusKnotGeometry args={[0.5, 0.18, 80, 12]} />;
      case 1: return <octahedronGeometry args={[0.65, 0]} />;
      case 2: return <icosahedronGeometry args={[0.6, 0]} />;
      case 3: return <torusGeometry args={[0.5, 0.2, 8, 40]} />;
      case 4: return <dodecahedronGeometry args={[0.6, 0]} />;
      case 5: return <tetrahedronGeometry args={[0.7, 0]} />;
      default: return <boxGeometry args={[0.8, 0.8, 0.8]} />;
    }
  };

  return (
    <mesh ref={ref}>
      {getGeometry()}
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

function MiniCanvas({ type }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ width: '64px', height: '64px', background: 'transparent' }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[2, 2, 2]} intensity={1} color="#ffffff" />
      <Float floatIntensity={0.3} speed={2}>
        <FeatureModel3D type={type} />
      </Float>
    </Canvas>
  );
}

/* ── Features Data ──────────────────────────────────────── */
const features = [
  {
    title: 'Real-Time Tracking',
    description: 'Watch your complaint progress in real-time. Status updates push instantly via WebSocket — no manual refresh needed.',
  },
  {
    title: 'Intelligent Routing',
    description: 'Smart priority detection categorizes and routes complaints to the right team instantly, cutting response times by 80%.',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Comprehensive analytics give admins instant visibility into complaint trends, resolution rates, and team performance.',
  },
  {
    title: 'Email Notifications',
    description: 'Beautifully designed email updates keep users informed at every stage — from submission to resolution.',
  },
  {
    title: 'Enterprise Security',
    description: 'JWT auth, bcrypt encryption, rate limiting, and role-based access control — security baked in from day one.',
  },
  {
    title: 'Smart Caching',
    description: 'High-performance caching ensures blazing fast load times even under heavy load with intelligent cache invalidation.',
  },
];

/* ── Feature Card ───────────────────────────────────────── */
function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      data-index={`0${index + 1}`}
      className="feature-card-bw"
      initial={{ opacity: 0, y: 50, rotateX: 15 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'none', height: '100%' }}
    >
      {/* 3D model icon */}
      <div style={{
        width: '64px', height: '64px',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.02)',
        transition: 'border-color 0.3s',
        borderColor: hovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
      }}>
        <MiniCanvas type={index} />
      </div>

      {/* Index number */}
      <div style={{
        fontFamily: 'Space Mono, monospace',
        fontSize: '0.625rem', letterSpacing: '0.2em',
        color: '#333333', marginBottom: '16px',
        textTransform: 'uppercase',
      }}>
        Feature — {String(index + 1).padStart(2, '0')}
      </div>

      <h3 style={{
        fontSize: '1.125rem', fontWeight: 700, color: '#ffffff',
        marginBottom: '14px', lineHeight: 1.3,
        transition: 'color 0.3s',
      }}>
        {feature.title}
      </h3>
      <p style={{
        fontSize: '0.9375rem', color: '#555555', lineHeight: 1.75,
        fontWeight: 400,
      }}>
        {feature.description}
      </p>

      {/* Bottom reveal line on hover */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '1px', background: 'rgba(255,255,255,0.3)',
          transformOrigin: 'left',
        }}
      />
    </motion.div>
  );
}

/* ── FeaturesSection ────────────────────────────────────── */
export default function FeaturesSection() {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  // Scroll-driven parallax for entire section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const sectionY = useTransform(scrollYProgress, [0, 1], ['0px', '-40px']);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="section-padding"
      style={{ position: 'relative', background: '#000000', overflow: 'hidden' }}
    >
      {/* Background grid — offset */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
      }} />

      <motion.div className="container-wide" style={{ y: sectionY }}>

        {/* Section header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 40 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '100px' }}
        >
          <span className="chapter-label" style={{ marginBottom: '20px', display: 'block' }}>
            Chapter 02 — The Arsenal
          </span>
          <span
            className="text-caption"
            style={{ marginBottom: '20px', display: 'block', color: '#333333' }}
          >
            Platform Features
          </span>
          <h2 className="text-headline" style={{ marginBottom: '20px' }}>
            Everything you need to{' '}
            <span className="gradient-text">resolve faster</span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={titleInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.87, 0, 0.13, 1] }}
            style={{
              height: '1px', background: 'rgba(255,255,255,0.12)',
              width: '120px', margin: '28px auto 0', transformOrigin: 'center',
            }}
          />
        </motion.div>

        {/* Feature grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1px',
            background: 'rgba(255,255,255,0.06)',
          }}
        >
          {features.map((feature, i) => (
            <div key={feature.title} style={{ background: '#000000' }}>
              <FeatureCard feature={feature} index={i} />
            </div>
          ))}
        </div>

        {/* Bottom count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={titleInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            textAlign: 'center', marginTop: '60px',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.625rem', letterSpacing: '0.2em',
            color: '#333333', textTransform: 'uppercase',
          }}
        >
          {features.length} core capabilities — built with obsessive precision
        </motion.div>
      </motion.div>
    </section>
  );
}
