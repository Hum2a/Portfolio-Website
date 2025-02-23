import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/Therabot.css";

const Therabot = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };

  const imageVariants = {
    hover: { scale: 1.05, transition: { duration: 0.4 } },
  };

  const images = [
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Dashboard.png`, caption: "Dashboard" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Settings.png`, caption: "Settings" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Role settings.png`, caption: "Role Settings" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Tone settings.png`, caption: "Tone Settings" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Profile.png`, caption: "Profile Settings" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Web chat empty.png`, caption: "Chat interface overview" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/ACtive webchat.png`, caption: "Live chat in action" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Conversation History.png`, caption: "Review past sessions" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Conveersation Hisotry expanded a bit.png`, caption: "Expanded Conversation History" },
    { src: `${process.env.PUBLIC_URL}/images/Therabot/Whatsapp chat.png`, caption: "Whatsapp Chat" },
  ];

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
        className="therabot-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.img
          src={`${process.env.PUBLIC_URL}/logos/Therabot.png`}
          alt="Therabot Logo"
          className="therabot-logo"
          whileHover={{ scale: 1.1 }}
        />

        {/* Title */}
        <motion.h1
          className="therabot-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Therabot
        </motion.h1>
        <p className="therabot-subtitle">
          A chatbot offering mental health support and resources.
        </p>

        {/* Visit Website Button */}
        <motion.a
          href="https://therabot-site.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          className="therabot-website-link"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          Visit the Website
        </motion.a>

        {/* Features Section */}
        <div className="therabot-features">
          <h2>Features:</h2>
          <ul>
            <li>Guided meditations</li>
            <li>Personalized mental health tips</li>
            <li>Anonymous chat sessions</li>
          </ul>
        </div>

        {/* Images Section */}
        <div className="therabot-images">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="image-container"
              whileHover="hover"
              variants={imageVariants}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.caption}
                className="therabot-image"
              />
              <p className="image-caption">{image.caption}</p>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="modal" onClick={() => setSelectedImage(null)}>
            <div className="modal-content">
              <img
                src={selectedImage.src}
                alt={selectedImage.caption}
                className="modal-image"
              />
              <p className="modal-caption">{images.caption}</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Therabot;
