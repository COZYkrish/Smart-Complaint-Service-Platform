import { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

/* ── Lenis context ──────────────────────────────────────── */
const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

/* ── SmoothScroll Provider ──────────────────────────────── */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const rafRef   = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Only apply on landing page — dashboard uses native scroll
    const isLanding = location.pathname === '/';

    const lenis = new Lenis({
      duration:        1.35,           // scroll duration (seconds)
      easing:          (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
      direction:       'vertical',
      gestureDirection:'vertical',
      smooth:          true,
      smoothTouch:     false,          // native on mobile
      touchMultiplier: 2,
      infinite:        false,
      lerp:            isLanding ? 0.065 : 0.1,  // lower = more buttery
      wheelMultiplier: 0.85,           // slight resistance for drama
    });

    lenisRef.current = lenis;

    // RAF loop
    function raf(time) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Scroll-to for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((el) => {
      el.addEventListener('click', (e) => {
        const id = el.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -80, duration: 1.6 });
        }
      });
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
    };
  }, [location.pathname]);

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [location.pathname]);

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
}
