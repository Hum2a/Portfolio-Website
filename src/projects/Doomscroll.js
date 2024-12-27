import React from "react";
import "../styles/Doomscroll.css";

const DoomScroll = () => {
  return (
    <div className="doomscroll-container">
      <img
        src={`${process.env.PUBLIC_URL}/logos/doomscroll.png`}
        alt="DoomScroll Logo"
        className="doomscroll-logo"
      />
      <h1>DoomScroll</h1>
      <p>A satirical app to mimic infinite scrolling behavior.</p>
      
      <div className="doomscroll-video-container">
        <video controls className="doomscroll-video">
          <source src={`${process.env.PUBLIC_URL}/videos/DoomScroll/Doomscroll Demo.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="video-caption">DoomScroll App Demo</p>
      </div>
    </div>
  );
};

export default DoomScroll;
