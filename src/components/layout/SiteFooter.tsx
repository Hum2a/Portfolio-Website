import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import './SiteFooter.css';

const SiteFooter: React.FC = () => {
  const { role } = useAuth();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="site-footer-copy">
          © {year} Humza Butt
        </p>
        <nav className="site-footer-nav" aria-label="Footer">
          {role === 'humza' && (
            <Link to="/traffic" className="site-footer-link">
              Traffic
            </Link>
          )}
          <Link to="/humza-login" className="site-footer-link site-footer-link--quiet">
            Login
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default SiteFooter;
