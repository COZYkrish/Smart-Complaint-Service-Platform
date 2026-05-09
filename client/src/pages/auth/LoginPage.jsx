import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';

function InputField({ id, label, type = 'text', value, onChange, error, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div style={{ position: 'relative', marginBottom: '24px' }}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        style={{
          width: '100%',
          padding: '22px 16px 10px',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${error ? 'rgba(244,63,94,0.6)' : focused ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: '12px',
          color: '#f8fafc',
          fontSize: '0.9375rem',
          fontFamily: 'Inter, sans-serif',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
          boxShadow: focused
            ? `0 0 0 4px ${error ? 'rgba(244,63,94,0.1)' : 'rgba(99,102,241,0.12)'}`
            : 'none',
        }}
      />
      <label
        htmlFor={id}
        style={{
          position: 'absolute',
          left: '16px',
          top: focused || hasValue ? '8px' : '50%',
          transform: focused || hasValue ? 'translateY(0)' : 'translateY(-50%)',
          fontSize: focused || hasValue ? '0.6875rem' : '0.9375rem',
          fontWeight: focused || hasValue ? 600 : 400,
          color: error
            ? '#f43f5e'
            : focused
            ? '#818cf8'
            : '#475569',
          transition: 'all 0.2s cubic-bezier(0.22,1,0.36,1)',
          pointerEvents: 'none',
          letterSpacing: focused || hasValue ? '0.08em' : '0',
          textTransform: focused || hasValue ? 'uppercase' : 'none',
        }}
      >
        {label}
      </label>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: '0.75rem', color: '#f43f5e', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>⚠</span> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'At least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setErrors({});
    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back!');
      const user = useAuthStore.getState().user;
      navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      toast.error(result.message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0F1C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 60%)', top: '-100px', right: '-100px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 60%)', bottom: '-50px', left: '-50px', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>⬡</div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>SmartService</span>
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px', marginTop: 0 }}>Welcome back</h1>
          <p style={{ color: '#64748b', fontSize: '0.9375rem', margin: 0 }}>Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -2, 2, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-strong"
          style={{ padding: '40px' }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <InputField
              id="login-email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            <InputField
              id="login-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />

            <button
              type="submit"
              className="btn btn-primary"
              id="login-submit"
              disabled={isLoading}
              style={{ width: '100%', marginTop: '8px', fontSize: '1rem', padding: '16px', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg className="animate-spin-slow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={{ marginTop: '28px', textAlign: 'center' }}>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }} id="login-to-register">
                Create one →
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Demo credentials hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: '20px',
            padding: '14px 20px',
            borderRadius: '10px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.15)',
            fontSize: '0.8125rem',
            color: '#64748b',
            textAlign: 'center',
          }}
        >
          Admin demo: <strong style={{ color: '#818cf8' }}>admin@smartservice.io</strong> / <strong style={{ color: '#818cf8' }}>Admin@123456</strong>
        </motion.div>
      </motion.div>
    </div>
  );
}
