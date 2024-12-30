import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/LiberalDemocrats.css";

const LiberalDemocrats = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Homepage.png`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/AboutUs.png`, caption: "About Us" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Campaigns.png`, caption: "Campaigns" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/ContactUs.png`, caption: "Contact Us" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Education.png`, caption: "Education Policy" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Equality.png`, caption: "Equality Campaign" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Housing.png`, caption: "Housing" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/JoinUs.png`, caption: "Join Us" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/MentalHealth.png`, caption: "Mental Health" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Brexit.png`, caption: "Brexit Policy" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/ClimateEmergency.png`, caption: "Climate Emergency" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/News.png`, caption: "News and Updates" },
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };

  return (
    <div>
      {/* Conditional rendering for HamburgerMenu or Navbar */}
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="liberal-democrats-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.img
          src={`${process.env.PUBLIC_URL}/logos/LDMF.png`}
          alt="Liberal Democrats Logo"
          className="liberal-democrats-logo"
          whileHover={{ scale: 1.1 }}
        />

        <motion.h1
          className="liberal-democrats-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Liberal Democrats
        </motion.h1>
        <motion.p
          className="liberal-democrats-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Informative website for the Liberal Democrats Muslim Foundation (LDMF).
        </motion.p>

        <motion.a
          href="https://ldmf.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          className="website-link"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          Visit the Website
        </motion.a>

        <div className="liberal-democrats-images">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="image-container"
              onClick={() => setSelectedImage(image)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img src={image.src} alt={image.caption} className="liberal-democrats-image" />
              <p className="image-caption">{image.caption}</p>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="modal" onClick={() => setSelectedImage(null)}>
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <img src={selectedImage.src} alt={selectedImage.caption} className="modal-image" />
              <p className="modal-caption">{selectedImage.caption}</p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LiberalDemocrats;
