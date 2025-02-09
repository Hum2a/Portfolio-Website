import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/About.css";

const About = () => {
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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      {/* Conditional rendering for HamburgerMenu or Navbar */}
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="about-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="about-header" variants={itemVariants}>
          <h1>About Me</h1>
          <p>
            I'm Humza Butt, a Full Stack Software Developer passionate about
            creating technology that improves lives.
          </p>
        </motion.div>

        <motion.div className="about-section" variants={itemVariants}>
          <h2>Professional Journey</h2>
          <p>Here are a few of the innovative projects I've worked on...</p>
          <ul>
          <li>
              <strong>Breathapplyser:</strong> An Android and IOS app designed to track alcohol intake and calculate how drunk you are at any given moment.
            </li>
            <li>
              <strong>TheraBot:</strong> A conversational AI mental health
              support chatbot deployed on WhatsApp and React websites.
            </li>
            <li>
              <strong>CulinAIry:</strong> An AI-powered recipe generator for
              personalised meal plans.
            </li>
            <li>
              <strong>BiasLens:</strong> A modern news aggregator analysing
              sentiment and political bias using NLP techniques.
            </li>
            <li>
              <strong>LifeSmart:</strong> Financial literacy tools such as stock 
              market and asset simulators.
            </li>
          </ul>
        </motion.div>

        <motion.div className="about-section" variants={itemVariants}>
          <h2>Technical Expertise</h2>
          <ul>
            <li>
              <strong>Frontend:</strong> React.js, Vue.js, Angular, Ember.js, Next.js, Nuxt.js
            </li>
            <li>
              <strong>Backend:</strong> Node.js, Python, .NET, C#
            </li>
            <li>
              <strong>Databases:</strong> Firebase, MongoDB, PostgreSQL
            </li>
            <li>
              <strong>APIs:</strong> OpenAI API, Twilio, WhatsApp API, FinHub
            </li>
            <li>
              <strong>Deployment:</strong> Render, Vercel, CI/CD pipelines, HostPresto
            </li>
          </ul>
        </motion.div>

        <motion.div className="about-section" variants={itemVariants}>
          <h2>Beyond Coding</h2>
          <p>
            As the Social Secretary for the Japanese and Self Defence Societies
            at the University of Portsmouth, I organised successful events and
            built engaging communities.
          </p>
          <p>
            I have competed in numerous badminton tournaments since I was 7, earning several trophies over the years.
          </p>
          <p>
            I competed in Kickboxing for 2 years from september 2021 to 2023. Entering multiple interclubs and combatting other universities
          </p>
          <p>
            I competed in Dodgeball for 2 years at university and won BUCS 22/23 with UoP Dodgeball.  
          </p>
        </motion.div>


        <motion.div className="about-footer" variants={itemVariants}>
          <p>
            Whether it’s crafting innovative software or empowering others
            through technology, I strive to make a difference. Let’s connect
            and create something amazing together!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
