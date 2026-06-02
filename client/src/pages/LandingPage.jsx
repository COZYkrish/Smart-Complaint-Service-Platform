import Navbar from '../components/ui/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import CTASection from '../components/landing/CTASection';
import { CustomCursor, ScrollProgressBar } from '../components/ui/UIEffects';
import { motion } from 'framer-motion';

/* ── Cinematic section divider ──────────────────────────── */
function CinematicDivider({ label }) {
  return (
    <div style={{ position: 'relative', padding: '0', overflow: 'hidden' }}>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.87, 0, 0.13, 1] }}
        style={{
          height: '1px',
          background: 'rgba(255,255,255,0.07)',
          transformOrigin: 'left',
        }}
      />
      {label && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            position: 'absolute', top: '50%', right: '32px',
            transform: 'translateY(-50%)',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.5rem', letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase',
            background: '#000', padding: '0 12px',
          }}
        >
          {label}
        </motion.div>
      )}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div style={{ background: '#000000', minHeight: '100vh' }}>
      {/* Global effects */}
      <div className="noise-overlay" />
      <ScrollProgressBar />

      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* Divider */}
      <CinematicDivider label="§ 02" />

      {/* Features */}
      <span id="features" />
      <FeaturesSection />

      {/* Divider */}
      <CinematicDivider label="§ 03" />

      {/* How It Works */}
      <span id="how-it-works" />
      <HowItWorksSection />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '48px 32px',
        background: '#000000',
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
        }}>
          <p style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.625rem', color: '#282828',
            letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            © 2024 SmartService Platform
          </p>
          <p style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.625rem', color: '#222222',
            letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            Built with obsessive attention to detail
          </p>
        </div>
      </footer>
    </div>
  );
}
