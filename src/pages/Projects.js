import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HamburgerMenu from "../components/HamburgerMenu";
import Navbar from "../components/Navbar";
import "../styles/Projects.css";

const projects = [
  {
    name: "Breathapplyser",
    description: "Tracks how much you drink, tells you how drunk you are",
    logo: "Breathapplyser.png",
    route: "/breathapplyser",
    tags: ["JavaScript", "Node.js", "React Native", "Firebase", "TypeScript", "BevTech", "Android", "IOS"],
    visible: true
  },
  {
    name: "LifeSmart",
    description: "Collection of tools to teach financial literacy to young people",
    logo: "LifeSmart.png",
    route: "/lifesmart",
    tags: ["JavaScript", "Node.js", "React.js", "Vue.js", "Firebase", "HostPresto", "Render", "Chart.js", "EdTech", "FinTech"],
    visible: true
  },
  {
    name: "B8",
    description: "Marketting Firm",
    logo: "B8.png",
    route: "/b8",
    tags: ["JavaScript", "React.js", "Vite", "Stripe", "Google Pay API", "Google Maps API", "React-Globe.gl", "Custom CMS", "Firebase", "Render"],
    visible: true
  },
  {
    name: "BakesByOlayide",
    description: "E-commerce platform for custom baked goods and desserts",
    logo: "BakesByOlayide.png",
    route: "/bakesbyolayide",
    tags: ["JavaScript", "React.js", "Node.js", "Firebase", "Stripe", "FoodTech", "E-commerce"],
    visible: true
  },
  {
    name: "BiasLens",
    description: "Political alignment analyser for web articles",
    logo: "BiasLens.png",
    route: "/biaslens",
    tags: ["JavaScript", "Next.js", "JavaScript", "Node.js", "Python", "Django", "Firebase", "Vercel", "MediaTech"],
    visible: true
  },
  {
    name: "Ministry of Justice",
    description: "Task Management System for the Ministry of Justice",
    logo: "MinistryofJustice.png",
    route: "/ministryofjustice",
    tags: ["JavaScript", "React.js", "Node.js", "Firebase", "Render"],
    visible: false
  },
  {
    name: "Mentage",
    description: "WhatsApp chatbot designed to help the user learn",
    logo: "Mentage.png",
    route: "/mentage",
    tags: ["JavaScript", "AI", "Chatbot", "EdTech", "React.js", "Python", "Flask", "Firebase", "OpenAi API", "WebApp"],
    visible: true
  },
  {
    name: "Therabot",
    description: "Whatsapp & Webchat Chabot designed to provide conversational support therapy.",
    logo: "Therabot.png",
    route: "/therabot",
    tags: ["JavaScript", "HealthTec", "Chatbot", "Node.js", "React.js", "Firebase", "Render", "OpenAi API", "WebApp"],
    visible: true
  },
  {
    name: "Flashcards",
    description: "Interactive flashcard application for learning React concepts",
    logo: "Flashcards.svg",
    route: "/flashcards",
    tags: ["JavaScript", "React", "CSS3", "HTML5", "Education"],
    visible: true
  },
  {
    name: "CulinAIry",
    description: "An AI-powered recipe generator for personalized meals",
    logo: "CulinAIry.png",
    route: "/culinary",
    tags: ["JavaScript", "Node.js", "React.js", "Firebase", "TypeScript", "Render", "FoodTech", "AI"],
    visible: true
  },
  {
    name: "Dad Joke Generator",
    description: "Press a button, get a dad joke",
    logo: "DadJokeGenerator.png",
    route: "/dadjokegenerator",
    tags: ["JavaScript", "Ember.js", "Node.js", "Render", "JokeTech"],
    visible: true
  },
  {
    name: "DoomScroll",
    description: "Infinitely doom scroll useless facts",
    logo: "Doomscroll.png",
    route: "/doomscroll",
    tags: ["JavaScript", "Node.js", "React.js", "Render", "JokeTech"],
    visible: true
  },
  {
    name: "Contrarian",
    description: "Pitchdeck classifier",
    logo: "Contrarian.png",
    route: "/contrarian",
    tags: ["JavaScript", "AI", "Python", "React.js", "Flask", "Render", "OpenAi API", "Firebase", "InvestTech", "FinTech"],
    visible: true
  },
  {
    name: "Liberal Democrats",
    description: "Informative Website for the LDMF",
    logo: "LDMF.png",
    route: "/ldmf",
    tags: ["JavaScript", "Vue.js", "Node.js"],
    visible: true
  },
  {
    name: "PNG to SVG",
    description: "Web tool to convert PNG's to SVG's",
    logo: "PNGtoSVG.png",
    route: "/pngtosvg",
    tags: ["JavaScript", "Angular", "Node.js"],
    visible: true
  },
  {
    name: "Doppelgan-Car",
    description: "AI-powered car personality matcher",
    logo: "Doppelgancar.png",
    route: "/doppelgancar",
    tags: ["AI", "Machine Learning", "Nuxt.js", "JavaScript", "Python", "Flask", "Render", "OpenAI"],
    visible: false
  },
  {
    name: "Tindev",
    description: "Developer-focused networking platform for tech professionals",
    logo: "Tindev.png",
    route: "/tindev",
    tags: ["JavaScript", "React.js", "Node.js", "Firebase", "WebRTC", "SocialTech", "WebApp"],
    visible: false
  }
];

const Projects = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState(projects.filter(project => project.visible));
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Extract unique tags from visible projects and sort them alphabetically
  const allTags = [...new Set(projects
    .filter(project => project.visible)
    .flatMap((project) => project.tags))].sort();

  // Handle screen size change
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle tag click
  const handleTagClick = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(updatedTags);

    if (updatedTags.length > 0) {
      const filtered = projects
        .filter(project => project.visible)
        .filter((project) =>
          updatedTags.every((selectedTag) => project.tags.includes(selectedTag))
        );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects.filter(project => project.visible));
    }
  };

  return (
    <div>
      {/* Conditional rendering for HamburgerMenu or Navbar */}
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="projects-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1 className="projects-title">My Projects</motion.h1>

        {/* Tag filter section */}
        <div className="tag-filter">
          {allTags.map((tag, index) => (
            <button
              key={index}
              className={`tag-button ${
                selectedTags.includes(tag) ? "tag-button-selected" : ""
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={index}
              className="project-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <Link to={project.route} className="project-link">
                <img
                  src={`${process.env.PUBLIC_URL}/logos/${project.logo}`}
                  alt={`${project.name} Logo`}
                  className={`project-logo${project.name === "BakesByOlayide" ? " bakesbyolayide-logo" : ""}`}
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
    </div>
  );
};

export default Projects;