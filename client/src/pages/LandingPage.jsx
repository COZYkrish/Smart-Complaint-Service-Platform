import Navbar from '../components/ui/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import CTASection from '../components/landing/CTASection';

export default function LandingPage() {
  return (
    <div style={{ background: '#0A0F1C', minHeight: '100vh' }}>
      {/* Film grain overlay */}
      <div className="noise-overlay" />

      <Navbar />
      <HeroSection />

      {/* Section divider */}
      <div className="divider" style={{ margin: '0 auto', maxWidth: '600px' }} />

      <span id="features" />
      <FeaturesSection />

      <div className="divider" style={{ margin: '0 auto', maxWidth: '600px' }} />

      <span id="how-it-works" />
      <HowItWorksSection />

      <CTASection />

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#334155', fontSize: '0.875rem' }}>
          © 2024 SmartService Platform · Built with obsessive attention to detail
        </p>
      </footer>
    </div>
  );
}
