import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import { FaEnvelope, FaLinkedin, FaGithub, FaPhone } from "react-icons/fa";
import Terminal from "../components/animations/Terminal";
import "../styles/Contact.css";

const Contact = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const contactMethods = [
    {
      icon: <FaEnvelope />,
      title: "Email",
      description: "Reach out via email",
      link: "mailto:Humzabutt1711@hotmail.com",
      buttonText: "Send Email",
      code: "mailto:Humzabutt1711@hotmail.com",
    },
    {
      icon: <FaLinkedin />,
      title: "LinkedIn",
      description: "Connect on LinkedIn",
      link: "https://www.linkedin.com/in/humza-butt-201057208/",
      buttonText: "View Profile",
      code: "linkedin.com/in/humza-butt-201057208",
    },
    {
      icon: <FaGithub />,
      title: "GitHub",
      description: "Check out my repositories",
      link: "https://github.com/Hum2a",
      buttonText: "View GitHub",
      code: "github.com/Hum2a",
    },
    {
      icon: <FaPhone />,
      title: "Phone",
      description: "Give me a call",
      link: "tel:+447450251281",
      buttonText: "Call Me",
      code: "+44 7450 251281",
    },
  ];

  return (
    <div className="contact-page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="contact-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="contact-header" variants={itemVariants}>
          <h1 className="contact-title">
            <span className="code-comment">//</span> Get in Touch
          </h1>
          <Terminal
            lines={[
              "const contact = {",
              "  message: 'I'd love to hear from you!',",
              "  methods: ['email', 'linkedin', 'github', 'phone']",
              "};"
            ]}
            prompt=">"
            typingSpeed={80}
            autoStart={true}
            className="contact-terminal"
            title="contact.js"
          />
        </motion.div>

        <div className="contact-methods">
          {contactMethods.map((method, index) => (
            <motion.div
              className="contact-card"
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="contact-card-header">
                <div className="contact-icon">{method.icon}</div>
                <h2 className="contact-card-title">{method.title}</h2>
              </div>
              <p className="contact-card-description">{method.description}</p>
              <div className="contact-code">
                <span className="code-keyword">const</span>{" "}
                <span className="code-variable">{method.title.toLowerCase()}</span> = "
                <span className="code-string">{method.code}</span>";
              </div>
              <a
                href={method.link}
                target={method.link.startsWith("http") ? "_blank" : undefined}
                rel={method.link.startsWith("http") ? "noopener noreferrer" : undefined}
                className="contact-link"
              >
                <button className="contact-button">
                  <span>{method.buttonText}</span>
                  <span className="button-arrow">→</span>
                </button>
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
