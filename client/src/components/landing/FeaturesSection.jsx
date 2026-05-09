import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Real-Time Tracking',
    description: 'Watch your complaint progress in real-time. Status updates push instantly via WebSocket — no manual refresh needed.',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.15)',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Intelligent Routing',
    description: 'Smart priority detection categorizes and routes complaints to the right team instantly, cutting response times by 80%.',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.15)',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Analytics Dashboard',
    description: 'Comprehensive analytics give admins instant visibility into complaint trends, resolution rates, and team performance.',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.15)',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Email Notifications',
    description: 'Beautifully designed email updates keep users informed at every stage — from submission to resolution.',
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.15)',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Enterprise Security',
    description: 'JWT auth, bcrypt encryption, rate limiting, and role-based access control — security baked in from day one.',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.15)',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Smart Caching',
    description: 'High-performance caching ensures blazing fast load times even under heavy load with intelligent cache invalidation.',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.15)',
  },
];

function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card"
      style={{ padding: '32px', height: '100%' }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background: feature.glow,
          border: `1px solid ${feature.color}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: feature.color,
          marginBottom: '20px',
          transition: 'all 0.3s',
        }}
      >
        {feature.icon}
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px', margin: '0 0 12px' }}>
        {feature.title}
      </h3>
      <p style={{ fontSize: '0.9375rem', color: '#64748b', lineHeight: 1.7, margin: 0 }}>
        {feature.description}
      </p>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section id="features" className="section-padding" style={{ position: 'relative' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.03) 50%, transparent 100%)', pointerEvents: 'none' }} />

      <div className="container-wide">
        {/* Section header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <span className="text-caption" style={{ marginBottom: '16px', display: 'block' }}>
            Platform Features
          </span>
          <h2 className="text-headline" style={{ marginBottom: '20px' }}>
            Everything you need to{' '}
            <span className="gradient-text">resolve faster</span>
          </h2>
          <p className="text-body" style={{ maxWidth: '520px', margin: '0 auto', fontSize: '1.0625rem' }}>
            Built for teams that take service quality seriously. Every feature designed with obsessive attention to detail.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
