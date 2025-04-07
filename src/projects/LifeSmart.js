import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/LifeSmart.css";

const projects = [
  {
    id: "misc",
    title: "LifeSmart Platform Overview",
    description: "A comprehensive look at the LifeSmart platform's main interfaces and features.",
    features: [
      "Modern and intuitive user interface",
      "Secure user authentication",
      "Admin dashboard for content management",
      "Seamless navigation between tools",
    ],
    media: [
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Misc/HomeScreen.png`, caption: "Home Screen" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Misc/SelectScreen.png`, caption: "Tool Selection Screen" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Misc/Login.png`, caption: "Login Interface" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Misc/Admin Dashboard.png`, caption: "Admin Dashboard" },
    ],
  },
  {
    id: "financial-quiz",
    title: "Financial Quiz",
    description: "A fun and interactive quiz to test and improve financial literacy.",
    features: [
      "Engaging financial questions",
      "Customizable difficulty levels",
      "Real-time scoring and feedback",
    ],
    media: [
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Quiz/LandingPage.png`, caption: "Quiz Landing Page" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Quiz/Quizcreation.png`, caption: "Quiz Creation Page" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Quiz/Question 1.png`, caption: "Question 1 Example" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Quiz/Question 1 answered.png`, caption: "Answered Question" },
      { type: "video", src: `${process.env.PUBLIC_URL}/videos/LifeSmart/Quiz/Highlighted words.mp4`, caption: "Highlighted Words Feature" },
      { type: "video", src: `${process.env.PUBLIC_URL}/videos/LifeSmart/Quiz/Scoreboard video.mp4`, caption: "Scoreboard Feature Demo" },
    ],
  },
  {
    id: "asset-market-simulation",
    title: "Asset Market Simulation Tool",
    description: "Simulate stock market scenarios to teach investment strategies.",
    features: [
      "Realistic market conditions",
      "Portfolio management",
      "Data-driven analytics and reports",
    ],
    media: [
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Asset Simulation/Homepage.png`, caption: "Homepage" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Asset Simulation/Results.png`, caption: "Simulation Results" },
      { type: "video", src: `${process.env.PUBLIC_URL}/videos/LifeSmart/Asset Simulation/Simulation.mp4`, caption: "Simulation in Action" },
    ],
  },
  {
    id: "budget-tool",
    title: "Budget Planning Tool",
    description: "An interactive tool to help users create and manage their personal budgets effectively.",
    features: [
      "Step-by-step budget creation process",
      "Visual budget breakdown",
      "Excel export functionality",
      "Customizable expense categories",
      "Interactive progress tracking",
    ],
    media: [
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step1.png`, caption: "Step 1: Income Input" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step2.png`, caption: "Step 2: Needs Expenses" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step3.png`, caption: "Step 3: Wants Expenses" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step4no.png`, caption: "Step 4: Savings Details" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step4yes.png`, caption: "Step 4: Savings Input" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step5.png`, caption: "Step 5: Budget Review" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step6.png`, caption: "Step 6: 6 Month Projection" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/Step7.png`, caption: "Step 7: Final Spreadsheet" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/LifeSmart/Budget Tool/ExcelSpreadsheet.png`, caption: "Excel Export Example" },
    ],
  },
];

const LifeSmart = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedProject, setSelectedProject] = useState(projects[0]); // Default to the first project
  const [selectedMedia, setSelectedMedia] = useState(null);

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

  return (
    <div>
      {/* Conditional rendering for HamburgerMenu or Navbar */}
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <div className="lifesmart-container">
        <img
          src={`${process.env.PUBLIC_URL}/logos/LifeSmart.png`}
          alt="LifeSmart Logo"
          className="lifesmart-logo"
        />
        <h1 className="lifesmart-title">LifeSmart</h1>
        <p className="lifesmart-subtitle">
          A suite of tools to teach financial literacy to young people.
        </p>
          {/* External Website Button */}
          <a
            href="https://lifesmart.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-button"
          >
            Visit the LifeSmart Website
          </a>

        {/* Project Selection Dropdown */}
        <div className="project-selector">
          <label htmlFor="project-dropdown" className="selector-label">
            Select a Project:
          </label>
          <select
            id="project-dropdown"
            value={selectedProject.id}
            onChange={(e) =>
              setSelectedProject(
                projects.find((project) => project.id === e.target.value)
              )
            }
            className="project-dropdown"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        {/* Project Details */}
        <div className="lifesmart-content">
          <h2>{selectedProject.title}</h2>
          <p>{selectedProject.description}</p>
          <h3>Features:</h3>
          <ul>
            {selectedProject.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          {/* Media Section */}
          <div className="project-media">
            {selectedProject.media.map((media, index) => (
              <div
                key={index}
                className="media-container"
                onClick={() => setSelectedMedia(media)}
              >
                {media.type === "image" ? (
                  <img
                    src={media.src}
                    alt={media.caption}
                    className="project-image"
                  />
                ) : (
                  <video className="project-video-preview" src={media.src} />
                )}
                <p className="media-caption">{media.caption}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Media Modal */}
        {selectedMedia && (
          <div className="modal" onClick={() => setSelectedMedia(null)}>
            <div className="modal-content">
              {selectedMedia.type === "image" ? (
                <img
                  src={selectedMedia.src}
                  alt={selectedMedia.caption}
                  className="modal-image"
                />
              ) : (
                <video
                  controls
                  className="modal-video"
                  autoPlay
                  src={selectedMedia.src}
                />
              )}
              <p className="modal-caption">{selectedMedia.caption}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LifeSmart;
