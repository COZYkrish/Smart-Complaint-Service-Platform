import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  {
    step: '01',
    title: 'Submit Your Complaint',
    description: 'Fill out our intuitive form with your complaint details. Add category, priority, and description in under 2 minutes.',
    color: '#6366f1',
  },
  {
    step: '02',
    title: 'Real-Time Review',
    description: 'Our admin team gets instantly notified via Socket.io. Your complaint is reviewed and routed to the right specialist.',
    color: '#a855f7',
  },
  {
    step: '03',
    title: 'Active Resolution',
    description: 'Track every status change — from "In Review" to "In Progress". You get email updates at each stage automatically.',
    color: '#06b6d4',
  },
  {
    step: '04',
    title: 'Resolved & Closed',
    description: 'Once resolved, review the solution and close the complaint. Full status history preserved for your records.',
    color: '#10b981',
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container-wide">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <span className="text-caption" style={{ marginBottom: '16px', display: 'block' }}>
            How It Works
          </span>
          <h2 className="text-headline">
            From complaint to{' '}
            <span className="gradient-text">resolution</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div style={{ position: 'relative' }}>
          {/* Connecting line */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: 'calc(12.5% + 40px)',
              right: 'calc(12.5% + 40px)',
              height: '1px',
              background: 'linear-gradient(90deg, #6366f1, #a855f7, #06b6d4, #10b981)',
              opacity: 0.25,
              display: 'none',
            }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px' }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: 'center', padding: '8px' }}
              >
                {/* Step number circle */}
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `${step.color}15`,
                    border: `1px solid ${step.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: step.color,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {step.step}
                  </span>
                  {/* Glow ring */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '-4px',
                      borderRadius: '50%',
                      border: `1px solid ${step.color}20`,
                      animation: 'breathe 3s ease-in-out infinite',
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                </div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.7 }}>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
