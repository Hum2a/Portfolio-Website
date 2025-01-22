// PNGtoSVG.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/PNGtoSVG.css";

const PNGtoSVG = () => {
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
        className="pngtosvg-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.img
          src={`${process.env.PUBLIC_URL}/logos/PNGtoSVG.png`}
          alt="PNG to SVG Logo"
          className="pngtosvg-logo"
          whileHover={{ scale: 1.1 }}
        />

        {/* Title */}
        <motion.h1
          className="pngtosvg-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          PNG to SVG Converter
        </motion.h1>
        <p className="pngtosvg-subtitle">
          Easily convert PNG images into SVG format.
        </p>

        {/* Features Section */}
        <div className="pngtosvg-features">
          <h2>Features:</h2>
          <ul>
            <li>Simple and intuitive upload process</li>
            <li>High-quality SVG conversions</li>
            <li>Downloadable results in one click</li>
          </ul>
        </div>

        {/* Visit Website Button */}
        <motion.a
          href="https://pngtosvg-ulmg.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          className="pngtosvg-website-link"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          Visit the Website
        </motion.a>

        {/* Images Section */}
        <div className="pngtosvg-images">
          <motion.div
            className="image-container"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/images/PNGtoSVG/sample.png`}
              alt="Sample Conversion"
              className="pngtosvg-image"
            />
            <p className="image-caption">Sample Conversion Result</p>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
};

export default PNGtoSVG;
