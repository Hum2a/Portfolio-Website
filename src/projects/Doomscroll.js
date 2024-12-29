import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/Doomscroll.css";

const DoomScroll = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

      <div className="doomscroll-container">
        <img
          src={`${process.env.PUBLIC_URL}/logos/doomscroll.png`}
          alt="DoomScroll Logo"
          className="doomscroll-logo"
        />
        <h1>DoomScroll</h1>
        <p>A satirical app to mimic infinite scrolling behavior.</p>

        <div className="doomscroll-video-container">
          <video
            controls
            className="doomscroll-video"
            onClick={() => setIsModalOpen(true)} // Opens modal on video click
          >
            <source
              src={`${process.env.PUBLIC_URL}/videos/DoomScroll/Doomscroll Demo.mp4`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <p className="video-caption">DoomScroll App Demo</p>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content">
              <video
                controls
                className="modal-video"
                autoPlay
              >
                <source
                  src={`${process.env.PUBLIC_URL}/videos/DoomScroll/Doomscroll Demo.mp4`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoomScroll;
