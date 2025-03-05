import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/BiasLens.css";

const BiasLens = () => {
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

  const logoVariants = {
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.4 } },
  };

  const images = [
    {
      src: `${process.env.PUBLIC_URL}/images/BiasLens/Homepage 1.png`,
      caption: "Homepage displaying news sources",
    },
    {
      src: `${process.env.PUBLIC_URL}/images/BiasLens/Homepage 2.png`,
      caption: "News articles analyzed for bias",
    },
    {
      src: `${process.env.PUBLIC_URL}/images/BiasLens/Homepage 3.png`,
      caption: "News articles analyzed for bias",
    },
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
        className="biaslens-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.img
          src={`${process.env.PUBLIC_URL}/logos/BiasLens.png`}
          alt="BiasLens Logo"
          className="biaslens-logo"
          variants={logoVariants}
          whileHover="hover"
        />

        {/* Title */}
        <motion.h1
          className="biaslens-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          BiasLens News
        </motion.h1>

        {/* Visit Website Button */}
        <motion.a
          href="https://biaslens.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="bias-website-link"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          Visit the Website
        </motion.a>

        {/* Images Section */}
        <div className="biaslens-images">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="image-container"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.caption}
                className="biaslens-image"
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

export default BiasLens;
