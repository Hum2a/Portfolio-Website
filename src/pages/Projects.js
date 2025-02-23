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
  },
  {
    name: "B8",
    description: "Marketting Firm",
    logo: "B8.png",
    route: "/b8",
    tags: ["JavaScript", "React.js", "Vite", "Stripe", "Google Pay API", "Google Maps API", "Render"]
  },
  {
    name: "BiasLens",
    description: "Political alignment analyser for web articles",
    logo: "BiasLens.png",
    route: "/biaslens",
    tags: ["JavaScript", "Next.js", "JavaScript", "Node.js", "Python", "Django", "Firebase", "Vercel", "MediaTech"],
  },
  {
    name: "LifeSmart",
    description: "Collection of tools to teach financial literacy to young people",
    logo: "LifeSmart.png",
    route: "/lifesmart",
    tags: ["JavaScript", "Node.js", "Vue.js", "Firebase", "HostPresto", "EdTech", "FinTech"],
  },
  {
    name: "Mentage",
    description: "WhatsApp chatbot designed to help the user learn",
    logo: "Mentage.png",
    route: "/mentage",
    tags: ["JavaScript", "AI", "Chatbot", "EdTech", "React", "Python", "Flask", "Firebase", "OpenAi API"],
  },
  {
    name: "Therabot",
    description: "Whatsapp & Webchat Chabot designed to provide conversational support therapy.",
    logo: "Therabot.png",
    route: "/therabot",
    tags: ["JavaScript", "HealthTec", "Chatbot", "Node.js", "React", "Firebase", "Render", "OpenAi API"],
  },
  {
    name: "CulinAIry",
    description: "An AI-powered recipe generator for personalized meals",
    logo: "CulinAIry.png",
    route: "/culinary",
    tags: ["JavaScript", "Node.js", "React", "Firebase", "TypeScript", "Render", "FoodTech", "AI"],
  },
  {
    name: "Dad Joke Generator",
    description: "Press a button, get a dad joke",
    logo: "DadJokeGenerator.png",
    route: "/dadjokegenerator",
    tags: ["JavaScript", "Ember.js", "Node.js", "Render", "JokeTech"],
  },
  {
    name: "DoomScroll",
    description: "Infinitely doom scroll useless facts",
    logo: "Doomscroll.png",
    route: "/doomscroll",
    tags: ["JavaScript", "Node.js", "React", "Render", "JokeTech"],
  },
  {
    name: "Contrarian",
    description: "Pitchdeck classifier",
    logo: "Contrarian.png",
    route: "/contrarian",
    tags: ["JavaScript", "AI", "Python", "React", "Flask", "Render", "OpenAi API", "Firebase", "InvestTech", "FinTech"],
  },
  {
    name: "Liberal Democrats",
    description: "Informative Website for the LDMF",
    logo: "LDMF.png",
    route: "/ldmf",
    tags: ["JavaScript", "Vue.js", "Node.js"]
  },
  {
    name: "PNG to SVG",
    description: "Web tool to convert PNG's to SVG's",
    logo: "PNGtoSVG.png",
    route: "/pngtosvg",
    tags: ["JavaScript", "Angular", "Node.js"]
  },
  {
    name: "Doppelgan-Car",
    description: "AI-powered car personality matcher",
    logo: "Doppelgancar.png",
    route: "/doppelgancar",
    tags: ["AI", "Machine Learning", "Nuxt.js", "JavaScript", "Python", "Flask", "Render", "OpenAI"],
  }  
];

const Projects = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Extract unique tags from projects and sort them alphabetically
  const allTags = [...new Set(projects.flatMap((project) => project.tags))].sort();


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
      const filtered = projects.filter((project) =>
        updatedTags.every((selectedTag) => project.tags.includes(selectedTag))
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
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
    </div>
  );
};

export default Projects;