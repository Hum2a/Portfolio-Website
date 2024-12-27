import React from "react";
import "../styles/DadJokeGenerator.css";

const DadJokeGenerator = () => {
  return (
    <div className="dadjokegenerator-container">
      <img
        src={`${process.env.PUBLIC_URL}/logos/dadjokegenerator.png`}
        alt="DadJokeGenerator Logo"
        className="dadjokegenerator-logo animated-logo"
      />
      <h1 className="animated-title">DadJokeGenerator</h1>
      <p className="animated-subtitle">A web app for generating endless dad jokes.</p>
      
      <div className="dadjoke-video-container">
        <video controls className="dadjoke-video animated-video">
          <source src={`${process.env.PUBLIC_URL}/videos/DadJokeGenerator/DadJokeDemo.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="video-caption animated-caption">Dad Joke Generator Demo</p>
      </div>

      {/* <button className="joke-button animated-button">Generate Joke</button>
      <div className="joke-display animated-display">
        Why don’t skeletons fight each other? They don’t have the guts!
      </div> */}
    </div>
  );
};

export default DadJokeGenerator;
