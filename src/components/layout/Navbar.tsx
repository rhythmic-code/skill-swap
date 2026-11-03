import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Zap,
  Search,
  Sparkles,
  Plus,
  GitMerge,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  ChevronDown,
  FlaskConical,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar } from '../ui/Avatar';

export function Navbar() {
  const { user, profile, signOut, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { to: '/discover', icon: <Search size={15} />, label: 'Discover' },
    { to: '/matches', icon: <Sparkles size={15} />, label: 'Matches' },
    { to: '/collaborations', icon: <GitMerge size={15} />, label: 'Collaborations' },
  ];

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* Logo */}
        <Link to="/" className="nav__logo">
          <span className="nav__logo-mark" aria-hidden="true">
            <Zap size={14} />
          </span>
          SkillSwap
        </Link>

        {/* Desktop nav */}
        {user && (
          <nav className="nav__links" aria-label="Main navigation">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `nav__link${isActive ? ' nav__link--active' : ''}`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="nav__end">
          {isDemoMode && (
            <span className="nav__demo-badge" aria-label="Demo mode active">
              <FlaskConical size={12} aria-hidden="true" />
              Demo
            </span>
          )}

          {user ? (
            <>
              <Link to="/create/offer" className="btn btn-primary btn--sm" style={{ display: 'none' }}
                aria-hidden="true"
              >
                <Plus size={14} aria-hidden="true" />
                Create
              </Link>
              <Link
                to="/create/offer"
                className="btn btn-secondary btn--sm"
                style={{ display: 'inline-flex' }}
              >
                <Plus size={14} aria-hidden="true" />
                Create
              </Link>

              {/* Profile dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="nav__profile-button"
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  aria-label="Open profile menu"
                >
                  <Avatar
                    src={profile?.avatar_url}
                    name={profile?.display_name || 'User'}
                    size="sm"
                  />
                  <ChevronDown size={13} style={{ color: 'var(--color-muted)' }} aria-hidden="true" />
                </button>

                {profileOpen && (
                  <>
                    <div
                      style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-dropdown)' } as React.CSSProperties}
                      onClick={() => setProfileOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="dropdown" role="menu">
                      <div className="dropdown__header">
                        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-ink)', marginBottom: 2 }}>
                          {profile?.display_name || 'Demo User'}
                        </p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                          @{profile?.username || 'demo'}
                        </p>
                      </div>
                      <Link
                        to={`/users/${profile?.username}`}
                        onClick={() => setProfileOpen(false)}
                        className="dropdown__item"
                        role="menuitem"
                      >
                        <User size={14} aria-hidden="true" />
                        View profile
                      </Link>
                      <Link
                        to="/proposals"
                        onClick={() => setProfileOpen(false)}
                        className="dropdown__item"
                        role="menuitem"
                      >
                        <GitMerge size={14} aria-hidden="true" />
                        Proposals
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setProfileOpen(false)}
                        className="dropdown__item"
                        role="menuitem"
                      >
                        <Settings size={14} aria-hidden="true" />
                        Settings
                      </Link>
                      <div className="dropdown__divider" role="separator" />
                      <button
                        onClick={handleSignOut}
                        className="dropdown__item dropdown__item--danger"
                        role="menuitem"
                      >
                        <LogOut size={14} aria-hidden="true" />
                        {isDemoMode ? 'Exit demo' : 'Sign out'}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile toggle */}
              <button
                className="nav__mobile-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-expanded={mobileOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="btn btn-ghost btn--sm" style={{ display: 'none' }}
                aria-hidden="true"
              >
                Sign in
              </Link>
              <Link to="/auth/login" className="btn btn-ghost btn--sm" style={{ display: 'inline-flex' }}>
                Sign in
              </Link>
              <Link to="/auth/sign-up" className="btn btn-primary btn--sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {user && (
        <div
          className={`nav__mobile${mobileOpen ? ' nav__mobile--open' : ''}`}
          aria-hidden={!mobileOpen}
        >
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `nav__link${isActive ? ' nav__link--active' : ''}`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/create/offer"
            onClick={() => setMobileOpen(false)}
            className="nav__link"
          >
            <Plus size={15} aria-hidden="true" />
            Create listing
          </Link>
        </div>
      )}
    </header>
  );
}
