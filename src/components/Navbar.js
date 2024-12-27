import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-link">
        Home
      </Link>
      <Link to="/about" className="navbar-link">
        About
      </Link>
      <Link to="/projects" className="navbar-link">
        Projects
      </Link>
      <Link to="/contact" className="navbar-link">
        Contact
      </Link>
    </nav>
  );
};

export default Navbar;
