import React from "react";
import "../styles/Breathapplyser.css";

const Breathapplyser = () => {
  return (
    <div className="breathapplyser-container">
      <img
        src={`${process.env.PUBLIC_URL}/logos/breathapplyser.png`}
        alt="Breathapplyser Logo"
        className="breathapplyser-logo"
      />
      <h1>Breathapplyser</h1>
      <p>A modern breathalyzer app with smart insights.</p>
      <div className="feature-list">
        <h2>Features:</h2>
        <ul>
          <li>Accurate BAC estimations</li>
          <li>Integration with smart devices</li>
          <li>Health insights and tips</li>
        </ul>
      </div>
    </div>
  );
};

export default Breathapplyser;
