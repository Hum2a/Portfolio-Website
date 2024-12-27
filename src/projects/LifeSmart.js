import React from "react";
import "../styles/LifeSmart.css";

const LifeSmart = () => {
  return (
    <div className="lifesmart-container">
      <img
        src={`${process.env.PUBLIC_URL}/logos/lifesmart.png`}
        alt="LifeSmart Logo"
        className="doomscroller-logo"
      />
      <h1>LifeSmart</h1>
      <p>An app designed to track and enhance your daily productivity.</p>
      <div className="dashboard-preview">
        <h2>Dashboard Preview:</h2>
        <img
          src={`${process.env.PUBLIC_URL}/images/lifesmart-dashboard.png`}
          alt="Dashboard Preview"
        />
      </div>
    </div>
  );
};

export default LifeSmart;
