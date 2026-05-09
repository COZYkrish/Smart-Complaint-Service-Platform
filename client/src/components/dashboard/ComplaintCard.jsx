import { motion } from 'framer-motion';

const STATUS_STEPS = ['pending', 'in-review', 'in-progress', 'resolved'];
const STATUS_LABELS = {
  pending: 'Pending',
  'in-review': 'In Review',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};
const STATUS_COLORS = {
  pending: '#f59e0b',
  'in-review': '#6366f1',
  'in-progress': '#06b6d4',
  resolved: '#10b981',
  closed: '#64748b',
};

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#64748b';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 12px',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        background: `${color}18`,
        color: color,
        border: `1px solid ${color}30`,
        textTransform: 'capitalize',
      }}
    >
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, display: 'inline-block' }} />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export default function ComplaintCard({ complaint, onClick }) {
  const currentStep = STATUS_STEPS.indexOf(complaint.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{
        y: -3,
        borderColor: 'rgba(99,102,241,0.3)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,102,241,0.12)',
      }}
    >
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: `linear-gradient(90deg, transparent, ${STATUS_COLORS[complaint.status]}60, transparent)` }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9', margin: 0, lineHeight: 1.4, flex: 1 }}>
          {complaint.title}
        </h3>
        <StatusBadge status={complaint.status} />
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 20px', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {complaint.description}
      </p>

      {/* Progress steps */}
      {complaint.status !== 'closed' && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStep;
              const color = STATUS_COLORS[step];
              return (
                <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  {/* Connector line */}
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '2px' }}>
                    <div style={{ flex: 1, height: '100%', background: i === 0 ? 'transparent' : (done ? `linear-gradient(90deg, ${STATUS_COLORS[STATUS_STEPS[i-1]]}, ${color})` : 'rgba(255,255,255,0.06)') }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: done ? color : 'rgba(255,255,255,0.08)', border: `1px solid ${done ? color : 'rgba(255,255,255,0.12)'}`, flexShrink: 0, boxShadow: done ? `0 0 8px ${color}80` : 'none', transition: 'all 0.3s' }} />
                    <div style={{ flex: 1, height: '100%', background: i === STATUS_STEPS.length - 1 ? 'transparent' : (i < currentStep ? color : 'rgba(255,255,255,0.06)') }} />
                  </div>
                  <span style={{ fontSize: '0.625rem', color: done ? color : '#334155', fontWeight: done ? 600 : 400, textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {STATUS_LABELS[step]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', color: '#64748b', textTransform: 'capitalize' }}>
            {complaint.category}
          </span>
          <span style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: '6px', background: `${STATUS_COLORS[complaint.priority] || '#64748b'}12`, color: STATUS_COLORS[complaint.priority] || '#64748b', textTransform: 'capitalize', border: `1px solid ${STATUS_COLORS[complaint.priority] || '#64748b'}25` }}>
            {complaint.priority}
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#334155' }}>
          {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </motion.div>
  );
}
