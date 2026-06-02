import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './stores/authStore';
import SmoothScroll from './components/ui/SmoothScroll';
import { CustomCursor } from './components/ui/UIEffects';

// Lazy loaded pages
const LandingPage    = lazy(() => import('./pages/LandingPage'));
const LoginPage      = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage   = lazy(() => import('./pages/auth/RegisterPage'));
const UserDashboard  = lazy(() => import('./pages/dashboard/UserDashboard'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));

/* ── Loading spinner — B&W ──────────────────────────────── */
function LoadingSpinner() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {/* Spinning square */}
        <div style={{
          width: '40px', height: '40px',
          border: '1.5px solid rgba(255,255,255,0.15)',
          borderTopColor: '#ffffff',
          animation: 'spin-slow 0.9s linear infinite',
        }} />
        <p style={{
          color: '#333333', fontSize: '0.6875rem',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          fontFamily: 'Space Mono, monospace',
        }}>
          Loading
        </p>
      </div>
    </div>
  );
}

/* ── Route guards ───────────────────────────────────────── */
function ProtectedRoute({ children, requireRole }) {
  const { user, token } = useAuthStore();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (requireRole && user.role !== requireRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}

function GuestRoute({ children }) {
  const { user, token } = useAuthStore();
  if (token && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}

/* ── App ────────────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      {/* Lenis smooth scroll — wraps everything inside router so it can
          read location.pathname and conditionally enable/disable */}
      <SmoothScroll>
        <CustomCursor />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(8, 8, 8, 0.95)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '0',
              backdropFilter: 'blur(20px)',
              fontSize: '0.875rem',
              fontFamily: 'Space Grotesk, sans-serif',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              padding: '14px 18px',
            },
            success: { iconTheme: { primary: '#ffffff', secondary: '#000000' } },
            error:   { iconTheme: { primary: '#ff4444', secondary: '#000000' } },
          }}
        />

        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />

            {/* Guest only */}
            <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

            {/* User dashboard */}
            <Route path="/dashboard/*" element={
              <ProtectedRoute><UserDashboard /></ProtectedRoute>
            } />

            {/* Admin dashboard */}
            <Route path="/admin/*" element={
              <ProtectedRoute requireRole="admin"><AdminDashboard /></ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </SmoothScroll>
    </BrowserRouter>
  );
}
