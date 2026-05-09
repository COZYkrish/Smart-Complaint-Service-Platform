import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '../../components/dashboard/Sidebar';
import useComplaintStore from '../../stores/complaintStore';
import { useSocket } from '../../hooks/useSocket';
import toast from 'react-hot-toast';
import api from '../../services/api';

const STATUS_COLORS_MAP = {
  pending: '#f59e0b',
  'in-review': '#6366f1',
  'in-progress': '#06b6d4',
  resolved: '#10b981',
  closed: '#64748b',
};

const PRIORITY_COLORS = { low: '#10b981', medium: '#f59e0b', high: '#f97316', urgent: '#f43f5e' };

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(15,22,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', backdropFilter: 'blur(12px)' }}>
      <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0 0 4px' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>
          {p.value} {p.name}
        </p>
      ))}
    </div>
  );
}

function AdminOverview() {
  const { complaints, fetchComplaints, stats, fetchStats, isLoading } = useComplaintStore();
  const [realtimeCount, setRealtimeCount] = useState(0);

  useEffect(() => {
    fetchComplaints();
    fetchStats();
  }, []);

  const byStatus = stats?.byStatus || [];
  const pieData = byStatus.map((s) => ({ name: s._id, value: s.count, color: STATUS_COLORS_MAP[s._id] || '#64748b' }));

  const chartData = [
    { name: 'Mon', complaints: 4 },
    { name: 'Tue', complaints: 7 },
    { name: 'Wed', complaints: 5 },
    { name: 'Thu', complaints: 9 },
    { name: 'Fri', complaints: 12 },
    { name: 'Sat', complaints: 6 },
    { name: 'Sun', complaints: 3 },
  ];

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>Admin Overview</h1>
          <span style={{ padding: '4px 12px', borderRadius: '999px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', fontSize: '0.75rem', color: '#818cf8', fontWeight: 600 }}>
            Live
          </span>
        </div>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Platform-wide complaint management</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Complaints', value: stats?.total ?? complaints.length, color: '#6366f1' },
          { label: 'This Month', value: stats?.thisMonth ?? 0, color: '#a855f7' },
          { label: 'Resolved', value: stats?.resolved ?? 0, color: '#10b981' },
          { label: 'Resolution Rate', value: `${stats?.resolutionRate ?? 0}%`, color: '#06b6d4' },
        ].map((s) => (
          <motion.div
            key={s.label}
            className="stat-card"
            whileHover={{ y: -3 }}
            style={{ padding: '24px' }}
          >
            <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '12px', fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {/* Area chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ padding: '28px' }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#e2e8f0', margin: '0 0 24px' }}>Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="complaints" name="complaints" stroke="#6366f1" strokeWidth={2} fill="url(#areaGradient)" dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6, fill: '#818cf8' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
          style={{ padding: '28px' }}
        >
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#e2e8f0', margin: '0 0 24px' }}>By Status</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
                {pieData.map((d) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: d.color, flexShrink: 0 }} />
                    <span style={{ color: '#94a3b8', textTransform: 'capitalize', flex: 1 }}>{d.name.replace('-', ' ')}</span>
                    <span style={{ color: '#f8fafc', fontWeight: 600 }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#334155' }}>No data yet</div>
          )}
        </motion.div>
      </div>

      {/* Recent complaints table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
        style={{ padding: '0', overflow: 'hidden' }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#e2e8f0', margin: 0 }}>Recent Complaints</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>User</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {complaints.slice(0, 8).map((c) => (
                <tr key={c._id}>
                  <td style={{ color: '#e2e8f0', fontWeight: 500, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</td>
                  <td style={{ color: '#94a3b8' }}>{c.userId?.name || 'Unknown'}</td>
                  <td style={{ textTransform: 'capitalize', color: '#64748b' }}>{c.category}</td>
                  <td>
                    <span style={{ padding: '2px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: `${PRIORITY_COLORS[c.priority]}15`, color: PRIORITY_COLORS[c.priority], textTransform: 'capitalize' }}>
                      {c.priority}
                    </span>
                  </td>
                  <td>
                    <span style={{ padding: '3px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, background: `${STATUS_COLORS_MAP[c.status]}18`, color: STATUS_COLORS_MAP[c.status], textTransform: 'capitalize', border: `1px solid ${STATUS_COLORS_MAP[c.status]}30`, whiteSpace: 'nowrap' }}>
                      {c.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td style={{ color: '#475569', fontSize: '0.8125rem' }}>
                    {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#334155', padding: '40px' }}>No complaints yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

function AdminComplaints() {
  const { complaints, fetchComplaints, updateComplaint, deleteComplaint, filters, setFilters, isLoading } = useComplaintStore();

  useEffect(() => { fetchComplaints(); }, [filters]);

  const handleStatusUpdate = async (id, status) => {
    const result = await updateComplaint(id, { status });
    if (result.success) toast.success(`Status updated to ${status}`);
    else toast.error(result.message);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this complaint?')) return;
    const result = await deleteComplaint(id);
    if (result.success) toast.success('Complaint deleted');
    else toast.error(result.message);
  };

  const statusOptions = ['pending', 'in-review', 'in-progress', 'resolved', 'closed'];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>All Complaints</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select className="form-select" value={filters.status} onChange={(e) => setFilters({ status: e.target.value })} style={{ maxWidth: '160px', padding: '8px 36px 8px 12px', fontSize: '0.875rem' }} id="admin-filter-status">
            {['', ...statusOptions].map((s) => (
              <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ') : 'All Status'}</option>
            ))}
          </select>
        </div>
      </div>

      <motion.div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>User</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#475569', padding: '40px' }}>Loading...</td></tr>
              ) : complaints.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#334155', padding: '40px' }}>No complaints found.</td></tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c._id}>
                    <td style={{ color: '#e2e8f0', fontWeight: 500, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</td>
                    <td>
                      <div>
                        <div style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>{c.userId?.name}</div>
                        <div style={{ color: '#475569', fontSize: '0.75rem' }}>{c.userId?.email}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ padding: '2px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, background: `${PRIORITY_COLORS[c.priority]}15`, color: PRIORITY_COLORS[c.priority], textTransform: 'capitalize' }}>
                        {c.priority}
                      </span>
                    </td>
                    <td>
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusUpdate(c._id, e.target.value)}
                        id={`status-select-${c._id}`}
                        style={{
                          background: `${STATUS_COLORS_MAP[c.status]}15`,
                          color: STATUS_COLORS_MAP[c.status],
                          border: `1px solid ${STATUS_COLORS_MAP[c.status]}30`,
                          borderRadius: '8px',
                          padding: '4px 8px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          outline: 'none',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s} style={{ background: '#1e293b', color: '#f8fafc' }}>
                            {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ color: '#475569', fontSize: '0.8125rem' }}>
                      {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(c._id)}
                        id={`delete-${c._id}`}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569', padding: '6px', borderRadius: '6px', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; e.currentTarget.style.color = '#f43f5e'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6m5-3h4" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  useSocket();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F1C' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main style={{ flex: 1, overflow: 'auto', minHeight: '100vh' }}>
        <div style={{ padding: 'clamp(24px, 4vw, 48px)' }}>
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
