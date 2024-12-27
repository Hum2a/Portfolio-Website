import React from "react";
import { motion } from "framer-motion";
import "../styles/Mentage.css";

const Mentage = () => {
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

  return (
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

      {/* Images Section */}
      <div className="mentage-images">
        <motion.div
          className="image-container"
          whileHover="hover"
          variants={imageVariants}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/Mentage/Homepage.png`}
            alt="Edit Topics Page"
            className="mentage-image"
          />
          <p className="image-caption">Homepage</p>
        </motion.div>
        <motion.div
          className="image-container"
          whileHover="hover"
          variants={imageVariants}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/Mentage/Edit topics.png`}
            alt="Edit Topics Page"
            className="mentage-image"
          />
          <p className="image-caption">Edit Topics: Manage Topics</p>
        </motion.div>
          <motion.div
            className="image-container"
            whileHover="hover"
            variants={imageVariants}
          >
          <img
            src={`${process.env.PUBLIC_URL}/images/Mentage/Profile.png`}
            alt="Profile"
            className="mentage-image"
          />
          <p className="image-caption">Profile</p>
        </motion.div>
          <motion.div
            className="image-container"
            whileHover="hover"
            variants={imageVariants}
          >
          <img
            src={`${process.env.PUBLIC_URL}/images/Mentage/conversation 1.png`}
            alt="Chat Interface Example 1"
            className="mentage-image"
          />
          <p className="image-caption">Conversation 1: Chat Interface</p>
        </motion.div>
        <motion.div
          className="image-container"
          whileHover="hover"
          variants={imageVariants}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/Mentage/conversation 2.png`}
            alt="Chat Interface Example 2"
            className="mentage-image"
          />
          <p className="image-caption">Conversation 2: Chat Features</p>
        </motion.div>
        <motion.div
          className="image-container"
          whileHover="hover"
          variants={imageVariants}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/Mentage/conversation 2.png`}
            alt="Chat Interface Example 2"
            className="mentage-image"
          />
          <p className="image-caption">Conversation 2: Chat Features</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Mentage;
