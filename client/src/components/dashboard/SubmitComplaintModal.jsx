import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useComplaintStore from '../../stores/complaintStore';

const categories = ['technical', 'billing', 'service', 'product', 'other'];
const priorities = ['low', 'medium', 'high', 'urgent'];

export default function SubmitComplaintModal({ onClose }) {
  const [form, setForm] = useState({ title: '', description: '', category: 'other', priority: 'medium' });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1: form, 2: success
  const { createComplaint, isLoading } = useComplaintStore();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.trim().length < 5) e.title = 'Title must be at least 5 characters';
    if (!form.description.trim()) e.description = 'Description is required';
    else if (form.description.trim().length < 20) e.description = 'Please describe your issue in at least 20 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setErrors({});
    const result = await createComplaint(form);
    if (result.success) {
      setStep(2);
    } else {
      toast.error(result.message || 'Failed to submit complaint');
    }
  };

  const priorityColors = { low: '#10b981', medium: '#f59e0b', high: '#f97316', urgent: '#f43f5e' };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="glass-strong"
        style={{ width: '100%', maxWidth: '560px', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ padding: '40px' }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                  <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 4px' }}>Submit Complaint</h2>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Tell us what's wrong and we'll fix it fast.</p>
                </div>
                <button
                  onClick={onClose}
                  id="modal-close"
                  style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s', flexShrink: 0 }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* Title */}
                <div className="form-group">
                  <label className="form-label" htmlFor="complaint-title">Title</label>
                  <input
                    id="complaint-title"
                    className={`form-input ${errors.title ? 'error' : ''}`}
                    placeholder="Brief summary of your issue"
                    value={form.title}
                    onChange={update('title')}
                  />
                  {errors.title && <p className="form-error">{errors.title}</p>}
                </div>

                {/* Category + Priority row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="complaint-category">Category</label>
                    <select id="complaint-category" className="form-select" value={form.category} onChange={update('category')}>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="complaint-priority">Priority</label>
                    <select id="complaint-priority" className="form-select" value={form.priority} onChange={update('priority')}>
                      {priorities.map((p) => (
                        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Priority indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '-12px', marginBottom: '16px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: priorityColors[form.priority], animation: form.priority === 'urgent' ? 'breathe 1s ease-in-out infinite' : 'none' }} />
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {form.priority === 'urgent' ? '🚨 Will be escalated immediately' :
                     form.priority === 'high' ? '⚡ Expedited review within 2 hours' :
                     form.priority === 'medium' ? '⏱ Standard review within 24 hours' :
                     '🌿 Non-urgent, reviewed within 72 hours'}
                  </span>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label" htmlFor="complaint-description">
                    Description
                    <span style={{ color: '#334155', marginLeft: '8px', fontWeight: 400 }}>
                      ({form.description.length}/2000)
                    </span>
                  </label>
                  <textarea
                    id="complaint-description"
                    className={`form-textarea ${errors.description ? 'error' : ''}`}
                    placeholder="Describe your issue in detail. Include steps to reproduce, expected vs actual behavior..."
                    value={form.description}
                    onChange={update('description')}
                    maxLength={2000}
                    rows={5}
                  />
                  {errors.description && <p className="form-error">{errors.description}</p>}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-ghost" onClick={onClose} id="modal-cancel">Cancel</button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    id="modal-submit"
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.7 : 1, minWidth: '140px' }}
                  >
                    {isLoading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg className="animate-spin-slow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" /></svg>
                        Submitting...
                      </span>
                    ) : 'Submit Complaint'}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ padding: '60px 40px', textAlign: 'center' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '36px',
                }}
              >
                ✓
              </motion.div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>Complaint Submitted!</h2>
              <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: 1.7 }}>
                Your complaint is in our queue. We've sent a confirmation email and will keep you updated.
              </p>
              <button className="btn btn-primary" onClick={onClose} id="success-close">
                Back to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
