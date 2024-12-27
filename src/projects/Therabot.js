import React from "react";
import { motion } from "framer-motion";
import "../styles/Therabot.css";

const Therabot = () => {
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
      className="therabot-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo */}
      <motion.img
        src={`${process.env.PUBLIC_URL}/logos/therabot.png`}
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

      {/* Features Section */}
      <div className="therabot-features">
        <h2>Features:</h2>
        <ul>
          <li>Guided meditations</li>
          <li>Personalized mental health tips</li>
          <li>Anonymous chat sessions</li>
        </ul>
      </div>

      {/* images Section */}
      <div className="therabot/Therabot">
      <motion.div
          className="image-container"
          whileHover="hover"
          variants={imageVariants}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/Therabot/Dashboard.png`}
            alt="Expanded Conversation History"
            className="therabot-image"
          />
          <p className="image-caption">Dashboard</p>
        </motion.div>
        <motion.div
          className="image-container"
          whileHover="hover"
          variants={imageVariants}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/Therabot/Settings.png`}
            alt="Expanded Conversation History"
            className="therabot-image"
          />
          <p className="image-caption">Settings</p>
        </motion.div>
        <motion.div
          className="image-container"
          whileHover="hover"
          variants={imageVariants}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/Therabot/Role settings.png`}
            alt="Expanded Conversation History"
            className="therabot-image"
          />
          <p className="image-caption">Role Settings</p>
        </motion.div>
        <motion.div
          className="image-container"
          whileHover="hover"
          variants={imageVariants}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/Therabot/Tone settings.png`}
            alt="Expanded Conversation History"
            className="therabot-image"
          />
          <p className="image-caption">Tone Settings</p>
        </motion.div>
        <motion.div
          className="image-container"
          whileHover="hover"
          variants={imageVariants}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/Therabot/Profile.png`}
            alt="Profile Settings"
            className="therabot-image"
          />
          <p className="image-caption">Manage your profile information</p>
        </motion.div>
        <motion.div
          className="image-container"
          whileHover="hover"
          variants={imageVariants}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/Therabot/Web chat empty.png`}
            alt="Web Chat Empty State"
            className="therabot-image"
          />
          <p className="image-caption">Chat interface overview</p>
        </motion.div>
        <motion.div
          className="image-container"
          whileHover="hover"
          variants={imageVariants}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/Therabot/ACtive webchat.png`}
            alt="Active Web Chat"
            className="therabot-image"
          />
          <p className="image-caption">Live chat in action</p>
        </motion.div>
        <motion.div
          className="image-container"
          whileHover="hover"
          variants={imageVariants}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/Therabot/Conversation History.png`}
            alt="Expanded Conversation History"
            className="therabot-image"
          />
          <p className="image-caption">Review past sessions</p>
        </motion.div>
        <motion.div
          className="image-container"
          whileHover="hover"
          variants={imageVariants}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/Therabot/Conveersation Hisotry expanded a bit.png`}
            alt="Expanded Conversation History"
            className="therabot-image"
          />
          <p className="image-caption">Review past sessions</p>
        </motion.div>
        <motion.div
          className="image-container"
          whileHover="hover"
          variants={imageVariants}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/Therabot/Whatsapp chat.png`}
            alt="Expanded Conversation History"
            className="therabot-image"
          />
          <p className="image-caption">Whatsapp Chat</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Therabot;
