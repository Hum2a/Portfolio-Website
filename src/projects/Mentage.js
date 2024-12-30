import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/Mentage.css";

const Mentage = () => {
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
    { src: `${process.env.PUBLIC_URL}/images/Mentage/Homepage.png`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/images/Mentage/Edit topics.png`, caption: "Edit Topics: Manage Topics" },
    { src: `${process.env.PUBLIC_URL}/images/Mentage/Profile.png`, caption: "Profile" },
    { src: `${process.env.PUBLIC_URL}/images/Mentage/conversation 1.png`, caption: "Conversation 1: Chat Interface" },
    { src: `${process.env.PUBLIC_URL}/images/Mentage/conversation 2.png`, caption: "Conversation 2: Chat Features" },
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
        className="mentage-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.img
          src={`${process.env.PUBLIC_URL}/logos/Mentage.png`}
          alt="Mentage Logo"
          className="mentage-logo"
          whileHover={{ scale: 1.1 }}
        />

        {/* Title */}
        <motion.h1
          className="mentage-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Mentage
        </motion.h1>
        <p className="mentage-subtitle">An AI chatbot designed to help students revise.</p>

        {/* Visit Website Button */}
        <motion.a
          href="https://mentage.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mentage-website-link"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          Visit the Website
        </motion.a>

        {/* Images Section */}
        <div className="mentage-images">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="image-container"
              whileHover="hover"
              variants={imageVariants}
              onClick={() => setSelectedImage(image)}
            >
              <img src={image.src} alt={image.caption} className="mentage-image" />
              <p className="image-caption">{image.caption}</p>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="modal" onClick={() => setSelectedImage(null)}>
            <div className="modal-content">
              <img src={selectedImage.src} alt={selectedImage.caption} className="modal-image" />
              <p className="modal-caption">{images.caption}</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Mentage;
