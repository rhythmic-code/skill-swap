import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  Users,
  GitMerge,
  Star,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FlaskConical,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ── How it works ───────────────────────────────────────────────────────────
const STEPS = [
  {
    n: '1',
    title: 'Create your profile',
    body: 'List the skills you can offer and the skills you need. Be specific about your experience and availability.',
  },
  {
    n: '2',
    title: 'Discover matches',
    body: 'The matching engine surfaces students whose skills complement yours, scored and explained.',
  },
  {
    n: '3',
    title: 'Propose an exchange',
    body: 'Send a structured proposal with deliverables, milestones, and timelines. Both sides agree before work starts.',
  },
  {
    n: '4',
    title: 'Build together',
    body: 'Track milestones, confirm completion, and leave a review. Your reputation grows with every exchange.',
  },
];

// ── Example exchanges ──────────────────────────────────────────────────────
const EXCHANGES = [
  { a: 'React development', b: 'SEO and growth strategy',  aRole: 'CS student', bRole: 'Marketing student' },
  { a: 'UI/UX design', b: 'Frontend implementation', aRole: 'Design student', bRole: 'CS student' },
  { a: 'Video editing', b: 'Logo and brand identity', aRole: 'Film student', bRole: 'Design student' },
  { a: 'Python automation', b: 'User research', aRole: 'ML student', bRole: 'Business student' },
];

// ── FAQ ────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'Is SkillSwap free?',
    a: 'Completely free. SkillSwap has no fees, commissions, or subscriptions. It is built to remove financial barriers to collaboration.',
  },
  {
    q: 'How do I trust a collaborator?',
    a: 'Every completed exchange produces a mutual review. You can view a student\'s collaboration history, reviews, and portfolio links before agreeing to work together. Start with small, well-defined scopes.',
  },
  {
    q: 'What if the exchange does not work out?',
    a: 'SkillSwap coordinates exchanges but does not enforce them. If something breaks down, you can report it. We recommend starting small before committing to large scopes.',
  },
  {
    q: 'Do skills have to be equal in value?',
    a: 'No. Exchanges are negotiated directly between participants based on effort and deliverables. SkillSwap does not impose hour-for-hour equivalence.',
  },
  {
    q: 'What happens after I accept a proposal?',
    a: 'A collaboration record is created. You track milestones, confirm your own deliverables as complete, and mark the collaboration done when both sides are satisfied. Reviews become available after mutual confirmation.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--color-rule)', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-md) 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: 'var(--space-lg)',
        }}
        aria-expanded={open}
      >
        <span style={{ fontSize: 'var(--text-md)', fontWeight: 500, color: 'var(--color-ink)' }}>{q}</span>
        {open
          ? <ChevronUp size={16} style={{ color: 'var(--color-muted)', flexShrink: 0 }} aria-hidden="true" />
          : <ChevronDown size={16} style={{ color: 'var(--color-muted)', flexShrink: 0 }} aria-hidden="true" />
        }
      </button>
      {open && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', lineHeight: 1.65, paddingBottom: 'var(--space-md)', maxWidth: '65ch', margin: 0 }}>
          {a}
        </p>
      )}
    </div>
  );
}

export function Landing() {
  const { user, enterDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleDemo = () => {
    enterDemoMode();
    navigate('/discover');
  };

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="tex-desk"
        style={{
          paddingTop: 'var(--space-4xl)',
          paddingBottom: 'var(--space-4xl)',
          minHeight: '76svh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="page-container"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-3xl)',
            alignItems: 'center',
          }}
        >
          {/* Text column */}
          <div>
            <h1 style={{ fontSize: 'var(--text-display)', fontWeight: 600, letterSpacing: 'var(--tracking-display)', color: 'var(--color-ink)', lineHeight: 1.04, marginBottom: 'var(--space-lg)', maxWidth: '16ch' }}>
              Build your ideas. Exchange your skills.
            </h1>
            <p className="lead" style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-xl)' }}>
              Find students who can help you build your startup or launch your project. Offer your skills in return.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              {user ? (
                <Link to="/discover" className="btn btn-primary">
                  Go to Discover <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ) : (
                <>
                  <Link to="/discover" className="btn btn-primary">
                    Find a collaborator <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  <Link to="/auth/sign-up" className="btn btn-secondary">
                    Offer your skills
                  </Link>
                </>
              )}
              <button
                onClick={handleDemo}
                className="btn btn-ghost"
                style={{ gap: 'var(--space-xs)' }}
              >
                <FlaskConical size={15} aria-hidden="true" />
                Try demo
              </button>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: 'var(--space-md)' }}>
              No credit card. No fees.
            </p>
          </div>

          {/* Signature: two stationery cards on the desk ── (waive 47b: real UI preview) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
              position: 'relative',
            }}
            aria-label="Example skill exchange cards"
            aria-hidden="true"
          >
            {/* Card A */}
            <div
              className="tex-cotton"
              style={{
                borderRadius: 'var(--radius-card)',
                padding: 'var(--space-lg)',
                boxShadow: 'var(--edge-stock), var(--cast-stock)',
                transform: 'rotate(-1.5deg)',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: 'var(--space-xs)', margin: '0 0 var(--space-xs)' }}>
                Alex Rivera · CS student, MIT
              </p>
              <p style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 var(--space-sm)' }}>
                Build a landing page in React
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-2xs)', flexWrap: 'wrap', marginBottom: 'var(--space-sm)' }}>
                <span className="skill-tag skill-tag-offer">React</span>
                <span className="skill-tag skill-tag-offer">TypeScript</span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: 0 }}>
                In exchange for: <span className="skill-tag skill-tag-need" style={{ marginLeft: 4 }}>SEO strategy</span>
              </p>
            </div>

            {/* Card B */}
            <div
              className="tex-cotton"
              style={{
                borderRadius: 'var(--radius-card)',
                padding: 'var(--space-lg)',
                boxShadow: 'var(--edge-stock), var(--cast-stock)',
                transform: 'rotate(1.2deg)',
                marginLeft: 'var(--space-xl)',
              }}
            >
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginBottom: 'var(--space-xs)', margin: '0 0 var(--space-xs)' }}>
                Priya Sharma · Marketing, NYU Stern
              </p>
              <p style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--color-ink)', margin: '0 0 var(--space-sm)' }}>
                Full SEO and growth strategy
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-2xs)', flexWrap: 'wrap', marginBottom: 'var(--space-sm)' }}>
                <span className="skill-tag skill-tag-offer">SEO</span>
                <span className="skill-tag skill-tag-offer">Content</span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: 0 }}>
                In exchange for: <span className="skill-tag skill-tag-need" style={{ marginLeft: 4 }}>React dev</span>
              </p>
            </div>

            {/* Match indicator */}
            <div
              style={{
                position: 'absolute',
                right: -12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--color-board)',
                color: 'var(--color-board-type)',
                borderRadius: 'var(--radius-pill)',
                padding: '4px 12px',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                boxShadow: 'var(--cast-stock)',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <CheckCircle size={12} />
              Matched
            </div>
          </div>
        </div>

        {/* Responsive hero */}
        <style>{`
          @media (max-width: 60rem) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .hero-cards { display: none !important; }
          }
        `}</style>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-section page-container">
        <h2 style={{ fontSize: 'var(--text-section)', fontWeight: 600, color: 'var(--color-ink)', textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
          How skill barter works
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: 'var(--space-xl)',
          }}
        >
          {STEPS.map((step) => (
            <div key={step.n}>
              <div
                className="tex-cotton"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 'var(--radius-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--edge-stock), var(--cast-stock)',
                  marginBottom: 'var(--space-md)',
                }}
              >
                <span
                  className="num"
                  style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-ink)', fontFamily: 'var(--font-outlier)' }}
                >
                  {step.n}
                </span>
              </div>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-ink)', marginBottom: 'var(--space-xs)' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', lineHeight: 1.65, margin: 0, maxWidth: '26ch' }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Example exchanges ─────────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-paper-2)', borderTop: '1px solid var(--color-rule)', borderBottom: '1px solid var(--color-rule)' }}>
        <div className="py-section page-container">
          <h2 style={{ fontSize: 'var(--text-section)', fontWeight: 600, color: 'var(--color-ink)', marginBottom: 'var(--space-3xl)' }}>
            Example exchanges
          </h2>
          <div className="grid-cols-2">
            {EXCHANGES.map((ex, i) => (
              <div
                key={i}
                className="tex-cotton"
                style={{
                  borderRadius: 'var(--radius-card)',
                  padding: 'var(--space-lg)',
                  boxShadow: 'var(--edge-stock), var(--cast-stock)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: '0 0 4px' }}>{ex.aRole}</p>
                  <span className="skill-tag skill-tag-offer" style={{ fontSize: 'var(--text-sm)', padding: '4px 12px' }}>{ex.a}</span>
                </div>
                <ArrowRight size={18} style={{ color: 'var(--color-rule-2)', flexShrink: 0 }} aria-hidden="true" />
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', margin: '0 0 4px' }}>{ex.bRole}</p>
                  <span className="skill-tag skill-tag-need" style={{ fontSize: 'var(--text-sm)', padding: '4px 12px' }}>{ex.b}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────────────────── */}
      <section className="board-section">
        <div className="py-section page-container">
          <h2 style={{ fontSize: 'var(--text-section)', fontWeight: 600, color: 'var(--color-board-type)', marginBottom: 'var(--space-3xl)' }}>
            Built for student builders
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 'var(--space-lg)',
            }}
          >
            {[
              { title: 'No budget required', body: 'Your skills are the currency. Build real projects without financial barriers.' },
              { title: 'Grow your portfolio', body: 'Every completed exchange is a real project you can show to employers.' },
              { title: 'Find your co-founder', body: 'Many great collaborations turn into startup teams.' },
              { title: 'Learn by doing', body: 'Working on real projects with real stakeholders accelerates learning faster than any course.' },
              { title: 'Build your reputation', body: 'Reviews from completed collaborations build a track record you own and can share.' },
              { title: 'On your schedule', body: 'Filter by availability. Find collaborators who can work evenings, weekends, or flexibly.' },
            ].map((b) => (
              <div
                key={b.title}
                style={{
                  borderRadius: 'var(--radius-card)',
                  padding: 'var(--space-lg)',
                  background: 'oklch(28% 0.013 40)',
                  border: '1px solid oklch(35% 0.012 42)',
                }}
              >
                <CheckCircle
                  size={18}
                  style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-sm)' }}
                  aria-hidden="true"
                />
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-board-type)', marginBottom: 'var(--space-xs)' }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'oklch(64% 0.01 50)', lineHeight: 1.65, margin: 0 }}>
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section className="py-section page-container" style={{ maxWidth: 800, marginInline: 'auto' }}>
        <h2 style={{ fontSize: 'var(--text-section)', fontWeight: 600, color: 'var(--color-ink)', marginBottom: 'var(--space-3xl)' }}>
          Frequently asked questions
        </h2>
        <div style={{ borderTop: '1px solid var(--color-rule)' }}>
          {FAQS.map(faq => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section
        className="tex-desk"
        style={{
          borderTop: '1px solid var(--color-rule)',
          paddingBlock: 'var(--space-4xl)',
          textAlign: 'center',
        }}
      >
        <div className="page-container" style={{ maxWidth: 640 }}>
          <h2 style={{ fontSize: 'var(--text-display-s)', fontWeight: 600, color: 'var(--color-ink)', letterSpacing: 'var(--tracking-display)', marginBottom: 'var(--space-lg)', lineHeight: 1.06 }}>
            Your skills are more valuable than you think.
          </h2>
          <p style={{ fontSize: 'var(--text-lead)', color: 'var(--color-muted)', marginBottom: 'var(--space-xl)' }}>
            Stop waiting to have a budget. Start building with students who have what you need.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            <Link to="/auth/sign-up" className="btn btn-primary">
              Create your profile <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <button onClick={handleDemo} className="btn btn-secondary" style={{ gap: 'var(--space-xs)' }}>
              <FlaskConical size={15} aria-hidden="true" />
              Explore demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
