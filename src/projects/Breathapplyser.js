import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/Breathapplyser.css";

const Breathapplyser = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const videos = [
    { src: `${process.env.PUBLIC_URL}/videos/Breathapplyser/Homepage.mp4`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/videos/Breathapplyser/TapToStartDrinking.mp4`, caption: "Tap to Start Drinking" },
    { src: `${process.env.PUBLIC_URL}/videos/Breathapplyser/History.mp4`, caption: "History" },
    { src: `${process.env.PUBLIC_URL}/videos/Breathapplyser/Animated Charts.mp4`, caption: "Animated Charts" },
    { src: `${process.env.PUBLIC_URL}/videos/Breathapplyser/AnimatedSettings.mp4`, caption: "Animated Settings" },
    { src: `${process.env.PUBLIC_URL}/videos/Breathapplyser/SettingsJumping.mp4`, caption: "Settings Jumping" },
  ];

  const pageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

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

      <motion.div
        className="breathapplyser-container"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        <motion.img
          src={`${process.env.PUBLIC_URL}/logos/Breathapplyser.png`}
          alt="Breathapplyser Logo"
          className="breathapplyser-logo"
          whileHover={{ scale: 1.1 }}
        />
        <motion.h1
          className="breathapplyser-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Breathapplyser
        </motion.h1>
        <motion.p
          className="breathapplyser-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          A modern breathalyzer app with smart insights.
        </motion.p>

        <motion.div
          className="feature-list"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <h2>Features:</h2>
          <ul>
            <li>Accurate BAC estimations</li>
            <li>Integration with smart devices</li>
            <li>Health insights and tips</li>
          </ul>
        </motion.div>

        {/* Videos Section */}
        <div className="video-gallery">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              className="video-container"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedVideo(video)}
            >
              <video className="gallery-video" controls>
                <source src={video.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="video-caption">{video.caption}</p>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {selectedVideo && (
          <div className="modal" onClick={() => setSelectedVideo(null)}>
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <video className="modal-video" controls autoPlay>
                <source src={selectedVideo.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="modal-caption">{selectedVideo.caption}</p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Breathapplyser;
