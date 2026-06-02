import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../stores/authStore';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const isLanding = location.pathname === '/';

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: '0 32px',
          transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
          background: scrolled ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        }}
      >
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          height: '68px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }} id="navbar-logo">
            {/* Minimal square logo */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              style={{
                width: '32px', height: '32px',
                border: '1.5px solid rgba(255,255,255,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: 700, color: '#ffffff',
                fontFamily: 'Space Mono, monospace',
                position: 'relative',
              }}
            >
              S
              {/* Corner accents */}
              <span style={{ position:'absolute', top:-2, left:-2, width:5, height:5, borderTop:'1.5px solid #fff', borderLeft:'1.5px solid #fff' }} />
              <span style={{ position:'absolute', bottom:-2, right:-2, width:5, height:5, borderBottom:'1.5px solid #fff', borderRight:'1.5px solid #fff' }} />
            </motion.div>
            <span style={{
              fontSize: '1rem', fontWeight: 700, color: '#ffffff',
              letterSpacing: '0.04em', fontFamily: 'Space Grotesk, sans-serif',
            }}>
              SmartService
            </span>
          </Link>

          {/* Nav links — desktop */}
          {isLanding && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden-mobile">
              {[
                { href: '#features', label: 'Features' },
                { href: '#how-it-works', label: 'How It Works' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  style={{
                    padding: '8px 18px',
                    color: '#555555',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    fontFamily: 'Space Grotesk, sans-serif',
                    letterSpacing: '0.01em',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => { e.target.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.target.style.color = '#555555'; }}
                >
                  {label}
                </a>
              ))}
            </div>
          )}

          {/* Auth CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="btn btn-ghost btn-sm"
                  id="navbar-dashboard"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="btn btn-outline btn-sm"
                  id="navbar-logout"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm"
                  id="navbar-login"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm"
                    id="navbar-register"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
