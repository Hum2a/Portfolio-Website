import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { trackEvent } from '@/services/analyticsService';
import './SiteFooter.css';

const NAV = [
  { label: 'Work', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Career', href: '/career' },
  { label: 'GitHub', href: '/github' },
  { label: 'Contact', href: '/contact' },
] as const;

const LAST_UPDATED = '2026-08';

const SiteFooter: React.FC = () => {
  const { role } = useAuth();
  const location = useLocation();
  const year = new Date().getFullYear();

  const onCvClick = () => {
    trackEvent('engagement', 'cv_download', location.pathname);
  };

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <nav className="site-footer-nav" aria-label="Footer">
            {NAV.map((item) => (
              <Link key={item.href} to={item.href} className="site-footer-link">
                {item.label}
              </Link>
            ))}
            <a
              href="/Humza-Butt-CV.pdf?v=2026-08"
              download
              className="site-footer-link"
              onClick={onCvClick}
            >
              CV
            </a>
          </nav>

          <div className="site-footer-socials">
            <a
              href="https://github.com/Hum2a"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer-social"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/humza-butt-201057208/"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer-social"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        <p className="site-footer-built">
          Built with React, Vite and Tailwind —{' '}
          <a
            href="https://github.com/Hum2a/Portfolio-Website"
            target="_blank"
            rel="noopener noreferrer"
          >
            source on GitHub
          </a>
        </p>

        <div className="site-footer-bottom">
          <p className="site-footer-copy">
            © {year} Humza Butt
            <span className="site-footer-updated">
              {' '}
              · Updated {LAST_UPDATED}
            </span>
          </p>
          <nav className="site-footer-admin" aria-label="Admin">
            {role === 'humza' && (
              <Link to="/traffic" className="site-footer-link">
                Traffic
              </Link>
            )}
            <Link
              to="/humza-login"
              className="site-footer-link site-footer-link--quiet"
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
