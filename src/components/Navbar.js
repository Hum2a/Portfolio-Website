import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-code">&lt;</span>
          <span className="navbar-logo-text">HB</span>
          <span className="navbar-logo-code">/&gt;</span>
        </Link>
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
          >
            About
          </Link>
          <Link 
            to="/projects" 
            className={`navbar-link ${isActive('/projects') ? 'active' : ''}`}
          >
            Projects
          </Link>
          <Link 
            to="/contact" 
            className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
