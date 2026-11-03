import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div>
          <Link to="/" className="nav__logo" style={{ marginBottom: 'var(--space-md)', display: 'inline-flex' }}>
            <span className="nav__logo-mark" aria-hidden="true">
              <Zap size={14} />
            </span>
            SkillSwap
          </Link>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', lineHeight: 1.6, maxWidth: '28ch' }}>
            A barter marketplace where students exchange skills to build real projects without cash.
          </p>
        </div>

        <nav aria-label="Platform links">
          <p className="footer__nav-head">Platform</p>
          <ul className="footer__links">
            {[
              { to: '/discover', label: 'Discover skills' },
              { to: '/matches', label: 'Find matches' },
              { to: '/create/offer', label: 'Offer a skill' },
              { to: '/create/request', label: 'Request help' },
            ].map(l => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Community links">
          <p className="footer__nav-head">Community</p>
          <ul className="footer__links">
            {[
              { to: '/guidelines', label: 'Community guidelines' },
              { to: '/about', label: 'About SkillSwap' },
              { to: '/faq', label: 'FAQ' },
              { to: '/contact', label: 'Contact' },
            ].map(l => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal links">
          <p className="footer__nav-head">Legal</p>
          <ul className="footer__links">
            {[
              { to: '/privacy', label: 'Privacy policy' },
              { to: '/terms', label: 'Terms of use' },
            ].map(l => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="footer__bottom">
        <span>© 2024 SkillSwap. Built for students, by students.</span>
        <span>This is an MVP. Exchanges are between consenting participants.</span>
      </div>
    </footer>
  );
}
