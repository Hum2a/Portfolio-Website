import React from "react";
import { motion } from "framer-motion";
import "../styles/BiasLens.css";

const BiasLens = () => {
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

  const buttonVariants = {
    hover: {
      scale: 1.1,
      backgroundColor: "#e53935",
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="biaslens-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo */}
      <motion.img
        src={`${process.env.PUBLIC_URL}/logos/biaslens.png`}
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

      {/* Image Sections */}
      <div className="biaslens-images">
        <motion.div
          className="image-container"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/BiasLens/Homepage 1.png`}
            alt="BiasLens Homepage View"
            className="biaslens-image"
          />
          <p className="image-caption">Homepage displaying news sources</p>
        </motion.div>
        <motion.div
          className="image-container"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/BiasLens/Homepage 2.png`}
            alt="BiasLens News View"
            className="biaslens-image"
          />
          <p className="image-caption">News articles analyzed for bias</p>
        </motion.div>
      </div>

      {/* Analyze Section
      <div className="example-text">
        <h2>Analyze This:</h2>
        <motion.textarea
          placeholder="Enter text to analyze for bias..."
          className="biaslens-textarea"
          whileFocus={{ scale: 1.02 }}
        ></motion.textarea>
        <motion.button
          className="biaslens-button"
          variants={buttonVariants}
          whileHover="hover"
        >
          Analyze
        </motion.button>
      </div> */}
    </motion.div>
  );
};

export default BiasLens;
