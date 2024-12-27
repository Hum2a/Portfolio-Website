import React from "react";
import { motion } from "framer-motion";
import "../styles/About.css";

const About = () => {
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
        <p>
          I have worked on various innovative projects, including:
        </p>
        <ul>
          <li>
            <strong>TheraBot:</strong> A conversational AI mental health
            support chatbot deployed on WhatsApp and React websites.
          </li>
          <li>
            <strong>CulinAIry:</strong> An AI-powered recipe generator for
            personalized meal plans.
          </li>
          <li>
            <strong>BiasLens:</strong> A modern news aggregator analyzing
            sentiment and political bias using NLP techniques.
          </li>
          <li>
            <strong>LifeSmart:</strong> Financial literacy tools like stock
            market and asset simulators.
          </li>
        </ul>
      </motion.div>

      <motion.div className="about-section" variants={itemVariants}>
        <h2>Technical Expertise</h2>
        <ul>
          <li>
            <strong>Frontend:</strong> React.js, Vue.js, Angular, Ember.js
          </li>
          <li>
            <strong>Backend:</strong> Node.js, Python, .NET
          </li>
          <li>
            <strong>Databases:</strong> Firebase, MongoDB, PostgreSQL
          </li>
          <li>
            <strong>APIs:</strong> OpenAI API, Twilio, WhatsApp API
          </li>
          <li>
            <strong>Deployment:</strong> Render, Vercel, CI/CD pipelines
          </li>
        </ul>
      </motion.div>

      <motion.div className="about-section" variants={itemVariants}>
        <h2>Beyond Coding</h2>
        <p>
          As the Social Secretary for the Japanese and Self Defence Societies
          at the University of Portsmouth, I organized successful events and
          built engaging communities.
        </p>
      </motion.div>

      <motion.div className="about-footer" variants={itemVariants}>
        <p>
          Whether it’s crafting innovative software or empowering others
          through technology, I strive to make a difference. Let’s connect and
          create something amazing together!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default About;
