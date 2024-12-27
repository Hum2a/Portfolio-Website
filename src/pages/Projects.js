import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Projects.css";

const projects = [
  {
    name: "Breathapplyser",
    description: "Tracks how much you drink, tells you how drunk you are",
    logo: "breathapplyser.png",
    route: "/breathapplyser",
    tags: ["JavaScript", "Node.js", "React Native", "Firebase", "TypeScript", "BevTech"],
  },
  {
    name: "BiasLens",
    description: "Political alignment analyser for web articles",
    logo: "biaslens.png",
    route: "/biaslens",
    tags: ["Next.js", "JavaScript", "Node.js", "Python", "Django", "Vercel", "MediaTech"],
  },
  {
    name: "LifeSmart",
    description: "Collection of tools to teach financial literacy to young people",
    logo: "lifesmart.png",
    route: "/lifesmart",
    tags: ["JavaScript", "Node.js", "Vue.js", "Firebase", "EdTech", "FinTech"],
  },
  {
    name: "Mentage",
    description: "WhatsApp chatbot designed to help the user learn",
    logo: "Mentage.png",
    route: "/mentage",
    tags: ["AI", "Chatbot", "Education"],
  },
  {
    name: "Therabot",
    description: "Whatsapp & Webchat Chabot designed to provide conversational support therapy.",
    logo: "therabot.png",
    route: "/therabot",
    tags: ["Mental Health", "Chatbot", "Support"],
  },
  {
    name: "CulinAIry",
    description: "An AI-powered recipe generator for personalized meals",
    logo: "Culinairy.png",
    route: "/culinary",
    tags: ["JavaScript", "Node.js", "React", "Firebase", "TypeScript", "FoodTech", "AiTech"],
  },
  {
    name: "DadJokeGenerator",
    description: "Press a button, get a dad joke",
    logo: "dadjokegenerator.png",
    route: "/dadjokegenerator",
    tags: ["Ember.js", "JavaScript", "Node.js", "Render"],
  },
  {
    name: "DoomScroll",
    description: "Infinitely doom scroll useless facts",
    logo: "doomscroll.png",
    route: "/doomscroll",
    tags: ["JavaScript", "Node.js", "React"],
  },
  {
    name: "Pitchdeck Classifier",
    description: "Pitchdeck classifier",
    logo: "Contrarian.png",
    route: "/contrarian",
    tags: ["AI", "Business", "Classification"],
  },
];

const Projects = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="projects-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="projects-title">My Projects</motion.h1>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="project-card"
            variants={cardVariants}
            whileHover={{ scale: 1.05 }}
          >
            <Link to={project.route} className="project-link">
              <img
                src={`${process.env.PUBLIC_URL}/logos/${project.logo}`}
                alt={`${project.name} Logo`}
                className="project-logo"
              />
              <div className="project-hover-content">
                <h2 className="project-name">{project.name}</h2>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Projects;
