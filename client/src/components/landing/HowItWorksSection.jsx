import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

/* ── 3D Step Model ──────────────────────────────────────── */
function StepModel({ stepIndex }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.5 + stepIndex;
    ref.current.rotation.x = Math.sin(t * 0.3 + stepIndex) * 0.3;
  });

  const models = [
    <torusKnotGeometry key={0} args={[0.35, 0.13, 60, 8]} />,
    <icosahedronGeometry key={1} args={[0.45, 0]} />,
    <octahedronGeometry  key={2} args={[0.45, 0]} />,
    <dodecahedronGeometry key={3} args={[0.42, 0]} />,
  ];

  return (
    <mesh ref={ref}>
      {models[stepIndex]}
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

function StepCanvas({ stepIndex }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ width: '56px', height: '56px', background: 'transparent' }}
    >
      <ambientLight intensity={0.1} />
      <pointLight position={[2, 2, 2]} intensity={1} color="#ffffff" />
      <Float floatIntensity={0.2} speed={1.5}>
        <StepModel stepIndex={stepIndex} />
      </Float>
    </Canvas>
  );
}

/* ── Steps Data ─────────────────────────────────────────── */
const steps = [
  {
    step: '01',
    title: 'Submit Your Complaint',
    description: 'Fill out our intuitive form with your complaint details. Add category, priority, and description in under 2 minutes.',
  },
  {
    step: '02',
    title: 'Real-Time Review',
    description: 'Our admin team gets instantly notified via Socket.io. Your complaint is reviewed and routed to the right specialist.',
  },
  {
    step: '03',
    title: 'Active Resolution',
    description: 'Track every status change — from "In Review" to "In Progress". You get email updates at each stage automatically.',
  },
  {
    step: '04',
    title: 'Resolved & Closed',
    description: 'Once resolved, review the solution and close the complaint. Full status history preserved for your records.',
  },
];

/* ── Single Step Row ────────────────────────────────────── */
function StepRow({ step, index, total }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 80px 1fr',
        gap: '32px',
        alignItems: 'center',
        marginBottom: index < total - 1 ? '0' : '0',
        position: 'relative',
      }}
    >
      {/* Left content */}
      <div style={{ textAlign: 'right', opacity: isEven ? 1 : 0.15 }}>
        {isEven && (
          <>
            <div style={{
              fontFamily: 'Space Mono, monospace', fontSize: '0.6875rem',
              color: '#444444', letterSpacing: '0.15em', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              Step {step.step}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
              {step.title}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#555555', lineHeight: 1.7, maxWidth: '340px', marginLeft: 'auto' }}>
              {step.description}
            </p>
          </>
        )}
      </div>

      {/* Center node */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {/* Timeline spine segment top */}
        {index > 0 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.05 }}
            style={{
              width: '1px', height: '40px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.2))',
              transformOrigin: 'top', marginBottom: '8px',
            }}
          />
        )}
        {index === 0 && <div style={{ height: '48px' }} />}

        {/* Step node */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 260, damping: 18 }}
          style={{
            width: '64px', height: '64px',
            border: '1px solid rgba(255,255,255,0.3)',
            background: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 2,
          }}
        >
          <StepCanvas stepIndex={index} />
          {/* Glow ring */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: index * 0.6 }}
            style={{
              position: 'absolute', inset: -8,
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          />
        </motion.div>

        {/* Number label */}
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.625rem', color: '#333333',
          letterSpacing: '0.1em', marginTop: '10px',
        }}>
          {step.step}
        </div>

        {/* Timeline spine segment bottom */}
        {index < total - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              width: '1px', height: '40px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))',
              transformOrigin: 'top', marginTop: '8px',
            }}
          />
        )}
        {index < total - 1 && <div style={{ height: '8px' }} />}
      </div>

      {/* Right content */}
      <div style={{ textAlign: 'left', opacity: !isEven ? 1 : 0.15 }}>
        {!isEven && (
          <>
            <div style={{
              fontFamily: 'Space Mono, monospace', fontSize: '0.6875rem',
              color: '#444444', letterSpacing: '0.15em', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              Step {step.step}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
              {step.title}
            </h3>
            <p style={{ fontSize: '0.9375rem', color: '#555555', lineHeight: 1.7, maxWidth: '340px' }}>
              {step.description}
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ── HowItWorksSection ──────────────────────────────────── */
export default function HowItWorksSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const sectionY = useTransform(scrollYProgress, [0, 1], ['30px', '-30px']);

  return (
    <section
      ref={sectionRef}
      className="section-padding"
      style={{
        position: 'relative', background: '#030303',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div className="container-wide" style={{ y: sectionY }}>
        {/* Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 40 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '100px' }}
        >
          <span className="chapter-label" style={{ marginBottom: '20px', display: 'block' }}>
            Chapter 03 — The Journey
          </span>
          <span className="text-caption" style={{ marginBottom: '20px', display: 'block', color: '#333333' }}>
            How It Works
          </span>
          <h2 className="text-headline">
            From complaint to{' '}
            <span className="gradient-text">resolution</span>
          </h2>
          <p style={{
            fontSize: '1rem', color: '#555555', marginTop: '20px',
            maxWidth: '440px', margin: '20px auto 0', lineHeight: 1.7,
          }}>
            Three steps. Zero friction. One resolution.
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={titleInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.87, 0, 0.13, 1] }}
            style={{
              height: '1px', background: 'rgba(255,255,255,0.12)',
              width: '80px', margin: '32px auto 0', transformOrigin: 'center',
            }}
          />
        </motion.div>

        {/* Steps — alternating timeline */}
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {steps.map((step, i) => (
            <StepRow key={step.step} step={step} index={i} total={steps.length} />
          ))}
        </div>

        {/* Mobile fallback — simple list */}
        <style>{`
          @media (max-width: 640px) {
            .steps-grid { display: none !important; }
          }
        `}</style>
      </motion.div>
    </section>
  );
}
