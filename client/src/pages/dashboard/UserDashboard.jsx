import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../../components/dashboard/Sidebar';
import useAuthStore from '../../stores/authStore';
import useComplaintStore from '../../stores/complaintStore';
import { AnimatePresence } from 'framer-motion';
import SubmitComplaintModal from '../../components/dashboard/SubmitComplaintModal';
import ComplaintCard from '../../components/dashboard/ComplaintCard';
import { useSocket } from '../../hooks/useSocket';

function StatCard({ label, value, icon, color, delta }) {
  return (
    <motion.div
      className="stat-card"
      whileHover={{ y: -4, borderColor: `${color}40` }}
      style={{ flex: 1, minWidth: '180px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#64748b' }}>{label}</span>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>{value}</div>
      {delta !== undefined && (
        <div style={{ fontSize: '0.75rem', color: delta >= 0 ? '#10b981' : '#f43f5e', marginTop: '6px' }}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)} this month
        </div>
      )}
    </motion.div>
  );
}

function OverviewTab() {
  const { complaints, fetchComplaints, isLoading } = useComplaintStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchComplaints(); }, []);

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === 'resolved').length;
  const pending = complaints.filter((c) => c.status === 'pending').length;
  const inProgress = complaints.filter((c) => ['in-review', 'in-progress'].includes(c.status)).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>My Dashboard</h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>Track and manage your service complaints</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="btn btn-primary"
          id="open-submit-modal"
          style={{ gap: '8px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Complaint
        </motion.button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <StatCard label="Total" value={total} color="#6366f1" icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" /></svg>
        } />
        <StatCard label="Pending" value={pending} color="#f59e0b" icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
        } />
        <StatCard label="In Progress" value={inProgress} color="#06b6d4" icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        } />
        <StatCard label="Resolved" value={resolved} color="#10b981" icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        } />
      </div>

      {/* Recent complaints */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>Recent Complaints</h2>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '200px', borderRadius: '16px' }} />
          ))}
        </div>
      ) : complaints.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '80px 24px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#475569', margin: '0 0 8px' }}>No complaints yet</h3>
          <p style={{ color: '#334155', fontSize: '0.9rem', margin: '0 0 24px' }}>Submit your first complaint and we'll get on it right away.</p>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)} id="empty-submit">
            Submit Complaint
          </button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {complaints.slice(0, 6).map((c) => (
              <ComplaintCard key={c._id} complaint={c} onClick={() => {}} />
            ))}
          </div>
        </AnimatePresence>
      )}

      <AnimatePresence>
        {showModal && <SubmitComplaintModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

function AllComplaintsTab() {
  const { complaints, fetchComplaints, isLoading, filters, setFilters } = useComplaintStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchComplaints(); }, [filters]);

  const statusOptions = ['', 'pending', 'in-review', 'in-progress', 'resolved', 'closed'];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>My Complaints</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)} id="complaints-tab-submit">
          + New
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <select
          className="form-select"
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
          style={{ maxWidth: '160px', padding: '8px 36px 8px 12px', fontSize: '0.875rem' }}
          id="filter-status"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ') : 'All Status'}</option>
          ))}
        </select>
        <select
          className="form-select"
          value={filters.priority}
          onChange={(e) => setFilters({ priority: e.target.value })}
          style={{ maxWidth: '160px', padding: '8px 36px 8px 12px', fontSize: '0.875rem' }}
          id="filter-priority"
        >
          {['', 'low', 'medium', 'high', 'urgent'].map((p) => (
            <option key={p} value={p}>{p ? p.charAt(0).toUpperCase() + p.slice(1) : 'All Priority'}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {[1, 2, 4].map((i) => <div key={i} className="skeleton" style={{ height: '220px', borderRadius: '16px' }} />)}
        </div>
      ) : complaints.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ color: '#475569' }}>No complaints match your filters.</p>
        </div>
      ) : (
        <AnimatePresence>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {complaints.map((c) => (
              <ComplaintCard key={c._id} complaint={c} onClick={() => {}} />
            ))}
          </div>
        </AnimatePresence>
      )}

      <AnimatePresence>
        {showModal && <SubmitComplaintModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default function UserDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  useSocket();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F1C' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main style={{ flex: 1, overflow: 'auto', minHeight: '100vh' }}>
        <div style={{ padding: 'clamp(24px, 4vw, 48px)' }}>
          <Routes>
            <Route index element={<OverviewTab />} />
            <Route path="complaints" element={<AllComplaintsTab />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
