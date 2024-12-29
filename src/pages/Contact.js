import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import { FaEnvelope, FaLinkedin, FaGithub, FaPhone, FaTwitter } from "react-icons/fa";
import "../styles/Contact.css";

const Contact = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };

  const contactMethods = [
    {
      icon: <FaEnvelope />,
      title: "Email",
      description: "Reach out to me via email",
      link: "mailto:Humzabutt1711@hotmail.com",
      buttonText: "Send an Email",
    },
    {
      icon: <FaLinkedin />,
      title: "LinkedIn",
      description: "Connect with me on LinkedIn",
      link: "https://www.linkedin.com/in/humza-butt-201057208/",
      buttonText: "View Profile",
    },
    {
      icon: <FaGithub />,
      title: "GitHub",
      description: "Check out my GitHub repositories",
      link: "https://github.com/Hum2a",
      buttonText: "View GitHub",
    },
    {
      icon: <FaPhone />,
      title: "Phone",
      description: "Give me a call",
      link: "tel:+447450251281",
      buttonText: "Call Me",
    },
    {
      icon: <FaTwitter />,
      title: "Twitter",
      description: "Follow me on Twitter",
      link: "https://x.com/HumzaUnoriginal",
      buttonText: "Follow",
    },
  ];

  return (
    <div>
      {/* Conditional rendering for HamburgerMenu or Navbar */}
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="contact-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">
          I’d love to hear from you! Reach out via email, social media, or give me a call.
        </p>
        <div className="contact-methods">
          {contactMethods.map((method, index) => (
            <motion.div
              className="contact-card"
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="contact-icon">{method.icon}</div>
              <h2>{method.title}</h2>
              <p>{method.description}</p>
              <a href={method.link} target="_blank" rel="noopener noreferrer">
                <button className="contact-button">{method.buttonText}</button>
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
