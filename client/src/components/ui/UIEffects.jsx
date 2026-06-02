import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

/* ── Custom Cursor ──────────────────────────────────────── */
export function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf  = useRef(null);

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }
    };

    const lerp = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top  = `${ring.current.y}px`;
      }
      raf.current = requestAnimationFrame(lerp);
    };
    raf.current = requestAnimationFrame(lerp);

    const enter = () => setHovering(true);
    const leave = () => setHovering(false);

    window.addEventListener('mousemove', move);
    document.querySelectorAll('a, button, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });

    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring ${hovering ? 'hovering' : ''}`} />
    </>
  );
}

/* ── Scroll Progress Bar ────────────────────────────────── */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      className="scroll-progress-bar"
      style={{ scaleX, width: '100%' }}
    />
  );
}

/* ── Section Cut Transition ─────────────────────────────── */
export function SectionCut({ trigger }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={trigger ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 0.35, ease: [0.87, 0, 0.13, 1] }}
      style={{
        height: '1.5px',
        background: '#ffffff',
        transformOrigin: 'left',
        width: '100%',
      }}
    />
  );
}

/* ── Text Scramble Hook ──────────────────────────────────── */
export function useScramble(text, trigger, duration = 900) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef(null);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&?';

  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const total = Math.floor(duration / 16);
    cancelAnimationFrame(frameRef.current);
    const tick = () => {
      const progress = frame / total;
      setDisplay(
        text
          .split('')
          .map((ch, i) =>
            i < progress * text.length
              ? ch
              : ch === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
          )
          .join('')
      );
      if (++frame <= total) frameRef.current = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [trigger, text]);

  return display;
}

/* ── 3D Magnetic Button ──────────────────────────────────── */
export function MagneticButton({ children, className = '', style = {}, ...props }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -10, y: dx * 10, scale: 1.04 });
  };

  const handleLeave = () => setTilt({ x: 0, y: 0, scale: 1 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: tilt.scale }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ display: 'inline-block', transformStyle: 'preserve-3d', perspective: 600 }}
    >
      <button className={className} style={style} {...props}>
        {children}
      </button>
    </motion.div>
  );
}

/* ── 3D Link Button (for react-router Link) ─────────────── */
export function MagneticLink({ children, to, className = '', style = {}, id }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -8, y: dx * 8, scale: 1.03 });
  };

  const handleLeave = () => setTilt({ x: 0, y: 0, scale: 1 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: tilt.scale }}
      transition={{ type: 'spring', stiffness: 280, damping: 18 }}
      style={{ display: 'inline-block', transformStyle: 'preserve-3d', perspective: 600 }}
    >
      {/* Use an anchor fallback — Link is passed as children */}
      <a href={to} id={id} className={className} style={style}>{children}</a>
    </motion.div>
  );
}
