import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/DadJokeGenerator.css";

const DadJokeGenerator = () => {
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

      <div className="dadjokegenerator-container">
        <img
          src={`${process.env.PUBLIC_URL}/logos/DadJokeGenerator.png`}
          alt="DadJokeGenerator Logo"
          className="dadjokegenerator-logo animated-logo"
        />
        <h1 className="animated-title">DadJokeGenerator</h1>
        <p className="animated-subtitle">A web app for generating endless dad jokes.</p>

        {/* Visit Website Button */}
        <a
          href="https://dad-joke-generator-68xz.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          className="dadjoke-website-link"
        >
          Visit the Website
        </a>

        <div className="dadjoke-video-container">
          <video
            controls
            className="dadjoke-video animated-video"
            onClick={() => setIsModalOpen(true)} // Open modal on video click
          >
            <source
              src={`${process.env.PUBLIC_URL}/videos/DadJokeGenerator/DadJokeDemo.mp4`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <p className="video-caption animated-caption">Dad Joke Generator Demo</p>
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
                  src={`${process.env.PUBLIC_URL}/videos/DadJokeGenerator/DadJokeDemo.mp4`}
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

export default DadJokeGenerator;
