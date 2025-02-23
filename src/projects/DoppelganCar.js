import React, { useState } from "react";
import { motion } from "framer-motion";
import HamburgerMenu from "../components/HamburgerMenu";
import Navbar from "../components/Navbar";
import "../styles/DoppelganCar.css";

const DoppelganCar = () => {
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
    { src: `${process.env.PUBLIC_URL}/images/DoppelganCar/Homepage.png`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/images/DoppelganCar/Upload.png`, caption: "Upload and Analyze" },
    { src: `${process.env.PUBLIC_URL}/images/DoppelganCar/Results.png`, caption: "Car Match Results" },
    { src: `${process.env.PUBLIC_URL}/images/DoppelganCar/MobileView.png`, caption: "Mobile-Friendly UI" },
  ];

  const websiteUrl = "https://doppelgang-car.vercel.app"

  return (
    <div>
        {isMobile ? <HamburgerMenu /> : <Navbar />}
    <motion.div
      className="doppelgancar-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo */}
      <motion.img
        src={`${process.env.PUBLIC_URL}/logos/Doppelgancar.png`}
        alt="DoppelganCar Logo"
        className="doppelgancar-logo"
        whileHover={{ scale: 1.1 }}
      />

      {/* Title */}
      <motion.h1
        className="doppelgancar-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Doppelgan-Car
      </motion.h1>
      <p className="doppelgancar-subtitle">
        An AI-powered app that matches your facial features to a car model.
      </p>

    {/* Visit Website Button */}
    <motion.a
        href={websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="doppelgancar-website-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Visit Website 🚗
    </motion.a>

      {/* Features Section */}
      <div className="doppelgancar-features">
        <h2>Features:</h2>
        <ul>
          <li>Advanced AI-based facial recognition</li>
          <li>Instant car recommendations based on your face</li>
          <li>Seamless image upload & processing</li>
          <li>Live API-powered car data and images</li>
        </ul>
      </div>

      {/* Images Section */}
      <div className="doppelgancar-images">
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
              className="doppelgancar-image"
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
            <p className="modal-caption">{selectedImage.caption}</p>
          </div>
        </div>
      )}
    </motion.div>
</div>

  );
};

export default DoppelganCar;
