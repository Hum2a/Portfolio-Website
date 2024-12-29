import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/HamburgerMenu.css";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsOpen(!isOpen);
  };

  return (
    <div className="hamburger-menu">
      <div className="hamburger-icon" onClick={toggleMenu}>
        <div className={`line ${isOpen ? "line-open" : ""}`}></div>
        <div className={`line ${isOpen ? "line-open" : ""}`}></div>
        <div className={`line ${isOpen ? "line-open" : ""}`}></div>
      </div>
      <div className={`menu-dropdown ${isOpen ? "menu-open" : ""}`} onClick={(e) => e.stopPropagation()}>
        <Link to="/" className="menu-link" onClick={() => setIsOpen(false)}>
          Home
        </Link>
        <Link to="/about" className="menu-link" onClick={() => setIsOpen(false)}>
          About
        </Link>
        <Link to="/projects" className="menu-link" onClick={() => setIsOpen(false)}>
          Projects
        </Link>
        <Link to="/contact" className="menu-link" onClick={() => setIsOpen(false)}>
          Contact
        </Link>
      </div>
    </div>
  );
};

export default HamburgerMenu;
