import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './stores/authStore';

// Lazy loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const UserDashboard = lazy(() => import('./pages/dashboard/UserDashboard'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));

function LoadingSpinner() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F1C',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '2px solid rgba(99,102,241,0.2)',
            borderTopColor: '#6366f1',
            animation: 'spin-slow 0.8s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <p style={{ color: '#475569', fontSize: '0.875rem' }}>Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, requireRole }) {
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

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

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15,22,40,0.95)',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(20px)',
            fontSize: '0.9375rem',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#0A0F1C' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#0A0F1C' } },
        }}
      />

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />

          {/* Guest only */}
          <Route path="/login" element={
            <GuestRoute><LoginPage /></GuestRoute>
          } />
          <Route path="/register" element={
            <GuestRoute><RegisterPage /></GuestRoute>
          } />

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
    </BrowserRouter>
  );
}
