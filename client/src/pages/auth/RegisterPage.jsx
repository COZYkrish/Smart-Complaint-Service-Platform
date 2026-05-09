import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';

function InputField({ id, label, type = 'text', value, onChange, error, autoComplete, hint }) {
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
          boxShadow: focused ? `0 0 0 4px ${error ? 'rgba(244,63,94,0.1)' : 'rgba(99,102,241,0.12)'}` : 'none',
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
          color: error ? '#f43f5e' : focused ? '#818cf8' : '#475569',
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
            exit={{ opacity: 0 }}
            style={{ fontSize: '0.75rem', color: '#f43f5e', marginTop: '6px' }}
          >
            ⚠ {error}
          </motion.p>
        )}
        {!error && hint && focused && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters required';
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) e.confirm = "Passwords don't match";
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
    const result = await registerUser(form.name.trim(), form.email, form.password);
    if (result.success) {
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2
    : 3;
  const strengthColors = ['transparent', '#f43f5e', '#f59e0b', '#10b981'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

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
      <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 60%)', top: '-100px', left: '-100px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 60%)', bottom: '0', right: '0', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>⬡</div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>SmartService</span>
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px', marginTop: 0 }}>Create your account</h1>
          <p style={{ color: '#64748b', fontSize: '0.9375rem', margin: 0 }}>Start resolving complaints smarter, today.</p>
        </div>

        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -2, 2, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-strong"
          style={{ padding: '40px' }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <InputField id="reg-name" label="Full name" value={form.name} onChange={update('name')} error={errors.name} autoComplete="name" />
            <InputField id="reg-email" label="Email address" type="email" value={form.email} onChange={update('email')} error={errors.email} autoComplete="email" />
            <InputField
              id="reg-password"
              label="Password"
              type="password"
              value={form.password}
              onChange={update('password')}
              error={errors.password}
              autoComplete="new-password"
              hint="Use at least 6 characters for a strong password"
            />

            {/* Password strength indicator */}
            {form.password.length > 0 && (
              <div style={{ marginTop: '-16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      style={{
                        flex: 1,
                        height: '3px',
                        borderRadius: '2px',
                        background: strength >= level ? strengthColors[strength] : 'rgba(255,255,255,0.08)',
                        transition: 'background 0.3s',
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
              </div>
            )}

            <InputField id="reg-confirm" label="Confirm password" type="password" value={form.confirm} onChange={update('confirm')} error={errors.confirm} autoComplete="new-password" />

            <button
              type="submit"
              className="btn btn-primary"
              id="register-submit"
              disabled={isLoading}
              style={{ width: '100%', marginTop: '8px', fontSize: '1rem', padding: '16px', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }} id="register-to-login">
                Sign in →
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
