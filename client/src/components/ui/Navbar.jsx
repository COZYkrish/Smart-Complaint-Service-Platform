import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../stores/authStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0 24px',
          transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
          background: scrolled ? 'rgba(10,15,28,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
            id="navbar-logo"
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 800,
                color: 'white',
                boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
              }}
            >
              ⬡
            </div>
            <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#f8fafc' }}>
              SmartService
            </span>
          </Link>

          {/* Nav links — desktop */}
          {isLanding && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden-mobile">
              {['#features', '#how-it-works'].map((href, i) => (
                <a
                  key={href}
                  href={href}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    color: '#64748b',
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.target.style.color = '#e2e8f0'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={(e) => { e.target.style.color = '#64748b'; e.target.style.background = 'transparent'; }}
                >
                  {i === 0 ? 'Features' : 'How It Works'}
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
                >
                  Dashboard
                </Link>
                <button onClick={logout} className="btn btn-outline btn-sm" id="navbar-logout">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm" id="navbar-login">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" id="navbar-register">
                  Get Started
                </Link>
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
