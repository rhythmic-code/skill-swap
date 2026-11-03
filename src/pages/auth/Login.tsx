import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, FlaskConical } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { isDemoMode } from '../../lib/supabase';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, enterDemoMode } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) { error('Sign in failed', err.message); }
    else { success('Welcome back!'); navigate('/discover'); }
  };

  const handleDemo = () => {
    enterDemoMode();
    success('Demo mode active', 'Exploring as Alex Rivera');
    navigate('/discover');
  };

  return (
    <div
      className="tex-desk"
      style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              fontWeight: 600,
              fontSize: 'var(--text-md)',
              color: 'var(--color-ink)',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              marginBottom: 'var(--space-lg)',
            }}
          >
            <span className="nav__logo-mark" aria-hidden="true"><Zap size={14} /></span>
            SkillSwap
          </Link>
          <h1 style={{ fontSize: 'var(--text-section)', fontWeight: 600, color: 'var(--color-ink)', margin: 0 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginTop: 'var(--space-xs)' }}>
            Sign in to your account to continue
          </p>
        </div>

        <div
          className="tex-cotton"
          style={{
            borderRadius: 'var(--radius-card)',
            padding: 'var(--space-2xl)',
            boxShadow: 'var(--edge-stock), var(--cast-stock-lift)',
          }}
        >
          {isDemoMode && (
            <div className="banner-demo" style={{ marginBottom: 'var(--space-lg)' }}>
              <p style={{ fontWeight: 600, margin: '0 0 4px' }}>Supabase not configured</p>
              <p style={{ margin: 0 }}>Configure your <code style={{ fontFamily: 'var(--font-outlier)', fontSize: '0.9em' }}>.env</code> file to enable real auth, or use demo mode to explore.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div>
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="you@university.edu"
                required
                autoComplete="email"
                disabled={isDemoMode}
              />
            </div>
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={isDemoMode}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 'var(--space-md)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-muted)',
                    padding: 0,
                    display: 'flex',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading || isDemoMode}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              margin: 'var(--space-lg) 0',
            }}
          >
            <hr className="rule" style={{ flex: 1 }} />
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>or</span>
            <hr className="rule" style={{ flex: 1 }} />
          </div>

          <button
            onClick={handleDemo}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <FlaskConical size={15} aria-hidden="true" />
            Continue in demo mode
          </button>

          <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginTop: 'var(--space-xl)' }}>
            No account?{' '}
            <Link to="/auth/sign-up" style={{ color: 'var(--color-accent-2)', fontWeight: 500 }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
