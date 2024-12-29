import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/LifeSmart.css";

const LifeSmart = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle screen size change for navbar and hamburger menu
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      {/* Conditional rendering for HamburgerMenu or Navbar */}
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <div className="lifesmart-container">
        <img
          src={`${process.env.PUBLIC_URL}/logos/lifesmart.png`}
          alt="LifeSmart Logo"
          className="lifesmart-logo"
        />
        <h1 className="lifesmart-title">LifeSmart</h1>
        <p className="lifesmart-subtitle">
          A suite of tools to teach financial literacy to young people.
        </p>
        <div className="lifesmart-content">
          <h2>Features:</h2>
          <ul>
            <li>Stock market simulator</li>
            <li>Personal budgeting tool</li>
            <li>Financial goal tracker</li>
          </ul>
          <div className="dashboard-preview">
            <h3>Dashboard Preview:</h3>
            <img
              src={`${process.env.PUBLIC_URL}/images/LifeSmart-Dashboard.png`}
              alt="LifeSmart Dashboard"
              className="lifesmart-dashboard-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeSmart;
