import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Homepage.css";

const Homepage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: "easeInOut" },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  return (
    <div>
      <Navbar />
    <motion.div
      className="homepage-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="homepage-title" variants={textVariants}>
        Humza Butt
      </motion.h1>
      <motion.p className="homepage-subtitle" variants={textVariants}>
        Crafting solutions with code.
      </motion.p>
      <motion.button
        whileHover={{
          scale: 1.1,
          backgroundColor: "#fff",
          color: "#1f4037",
        }}
        whileTap={{ scale: 0.95 }}
        className="explore-button"
        onClick={() => navigate("/projects")}
      >
        Explore My Work
      </motion.button>
    </motion.div>
    </div>
  );
};

export default Homepage;
