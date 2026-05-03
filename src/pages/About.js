import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import "../styles/About.css";

/** Narrative blurbs; six are chosen at random per visit (see {@link JOURNEY_VISIBLE_COUNT}). */
const PROFESSIONAL_JOURNEY_SPOTLIGHTS = [
  {
    name: "Breathapplyser",
    description: "Android and iOS app tracking alcohol intake",
    metaLabel: "features",
    metaItems: ["Real-time BAC calculation", "Drink tracking"],
  },
  {
    name: "TheraBot",
    description: "Conversational AI mental health support chatbot",
    metaLabel: "platforms",
    metaItems: ["WhatsApp", "React Web"],
  },
  {
    name: "CulinAIry",
    description: "AI-powered recipe generator for personalized meals",
    metaLabel: "tech",
    metaItems: ["AI", "React", "Firebase"],
  },
  {
    name: "BiasLens",
    description: "News aggregator analyzing sentiment and political bias",
    metaLabel: "tech",
    metaItems: ["NLP", "Next.js", "Python"],
  },
  {
    name: "LifeSmart",
    description: "Financial literacy tools with stock market simulators",
    metaLabel: "features",
    metaItems: ["Asset simulators", "Educational tools"],
  },
  {
    name: "Gremlins",
    description: "Playful Windows tray companion with configurable gremlins and quiet hours",
    metaLabel: "tech",
    metaItems: ["C#", ".NET", "WPF", "React"],
  },
  {
    name: "Recount",
    description: "Productivity suite: extension and dashboard for time and focus",
    metaLabel: "tech",
    metaItems: ["Chrome MV3", "Next.js", "Supabase"],
  },
  {
    name: "Brute-forcer",
    description: "Client-side password entropy and crack-time estimator",
    metaLabel: "features",
    metaItems: ["Privacy-first", "Live demo"],
  },
];

const JOURNEY_VISIBLE_COUNT = 6;

function shuffleCopy(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const About = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [journeySpotlights] = useState(() =>
    shuffleCopy(PROFESSIONAL_JOURNEY_SPOTLIGHTS).slice(0, JOURNEY_VISIBLE_COUNT)
  );

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
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const skillsCode = `const skills = {
  frontend: ['React.js', 'Vue.js', 'Angular', 'Ember.js', 'Next.js', 'Nuxt.js'],
  backend: ['Node.js', 'Python', '.NET', 'C#'],
  databases: ['Firebase', 'MongoDB', 'PostgreSQL'],
  apis: ['OpenAI API', 'Twilio', 'WhatsApp API', 'FinHub'],
  deployment: ['Render', 'Vercel', 'CI/CD', 'HostPresto']
};`;

  return (
    <div className="about-page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="about-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="about-header" variants={itemVariants}>
          <h1 className="about-title">
            <span className="code-comment">//</span> About Me
          </h1>
          <Terminal
            lines={[
              "const developer = {",
              "  name: 'Humza Butt',",
              "  role: 'Full Stack Software Developer',",
              "  passion: 'Creating technology that improves lives'",
              "};"
            ]}
            prompt=">"
            typingSpeed={22}
            autoStart={true}
            className="about-terminal"
            title="about.js"
          />
        </motion.div>

        <motion.div className="about-section" variants={itemVariants}>
          <h2 className="section-title">
            <span className="code-comment">//</span> Professional Journey
          </h2>
          <p className="section-description">
            Here are some of the innovative projects I've worked on — this section shows six at
            a time, picked at random (refresh to reshuffle):
          </p>
          <div className="projects-list">
            {journeySpotlights.map((spotlight) => (
              <div className="project-item" key={spotlight.name}>
                <span className="project-keyword">const</span>{" "}
                <span className="project-name">{spotlight.name}</span> = {"{"}
                <br />
                <span className="project-property">  description</span>: "{spotlight.description}",
                <br />
                <span className="project-property">
                  {"  "}
                  {spotlight.metaLabel}
                </span>
                :{" "}
                {JSON.stringify(spotlight.metaItems).replace(/","/g, '", "')}
                ,
                <br />
                {"}"};
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="about-section" variants={itemVariants}>
          <h2 className="section-title">
            <span className="code-comment">//</span> Technical Expertise
          </h2>
          <CodeBlock
            code={skillsCode}
            language="javascript"
            showLineNumbers={true}
            copyable={false}
            className="skills-codeblock"
          />
        </motion.div>

        <motion.div className="about-section" variants={itemVariants}>
          <h2 className="section-title">
            <span className="code-comment">//</span> Beyond Coding
          </h2>
          <div className="beyond-coding">
            <div className="activity-item">
              <span className="activity-keyword">//</span> Leadership
              <br />
              <span className="activity-code">
                Social Secretary for Japanese & Self Defence Societies at University of Portsmouth
                <br />
                <span className="code-comment">// Result: Nominated for "Most Improved Society of the Year"</span>
              </span>
            </div>
            <div className="activity-item">
              <span className="activity-keyword">//</span> Sports
              <br />
              <span className="activity-code">
                Badminton: Competing since age 7, multiple trophies
                <br />
                Kickboxing: 2 years (2021-2023), multiple interclubs
                <br />
                Dodgeball: BUCS 22/23 Champions with UoP Dodgeball
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div className="about-footer" variants={itemVariants}>
          <Terminal
            lines={[
              "console.log('Let\\'s connect and create something amazing together!');",
              "",
              "// Whether it's crafting innovative software or empowering others",
              "// through technology, I strive to make a difference."
            ]}
            prompt=">"
            typingSpeed={22}
            autoStart={true}
            className="about-footer-terminal"
            title="connect.js"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
