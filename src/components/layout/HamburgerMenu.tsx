import React, { useState } from "react";
import { Link } from "react-router-dom";
import { prefetchProjects } from "../../utils/prefetchRoute";
import "./HamburgerMenu.css";

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
        <Link to="/career" className="menu-link" onClick={() => setIsOpen(false)}>
          Career
        </Link>
        <Link to="/" className="menu-link" onClick={() => setIsOpen(false)}>
          Home
        </Link>
        <Link to="/about" className="menu-link" onClick={() => setIsOpen(false)}>
          About
        </Link>
        <Link
          to="/projects"
          className="menu-link"
          onClick={() => setIsOpen(false)}
          onMouseEnter={prefetchProjects}
          onFocus={prefetchProjects}
        >
          Projects
        </Link>
        <Link to="/contact" className="menu-link" onClick={() => setIsOpen(false)}>
          Contact
        </Link>
        <Link to="/github" className="menu-link" onClick={() => setIsOpen(false)}>
          GitHub
        </Link>
      </div>
    </div>
  );
};

export default HamburgerMenu;
