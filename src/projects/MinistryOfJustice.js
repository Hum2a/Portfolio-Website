import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/MinistryOfJustice.css";

const projects = [
  {
    id: "case-management",
    title: "Case Management System",
    description: "A comprehensive system for managing legal cases and court proceedings.",
    features: [
      "Secure case documentation",
      "Real-time case status updates",
      "Document management system",
      "Court scheduling integration",
      "User access controls",
    ],
    media: [
      { type: "image", src: `${process.env.PUBLIC_URL}/images/MinistryOfJustice/CaseManagement/Dashboard.png`, caption: "Case Management Dashboard" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/MinistryOfJustice/CaseManagement/CaseDetails.png`, caption: "Case Details View" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/MinistryOfJustice/CaseManagement/DocumentViewer.png`, caption: "Document Management" },
    ],
  },
  {
    id: "court-scheduling",
    title: "Court Scheduling System",
    description: "An efficient system for managing court schedules and hearings.",
    features: [
      "Automated scheduling algorithms",
      "Conflict detection",
      "Resource allocation",
      "Calendar integration",
      "Notification system",
    ],
    media: [
      { type: "image", src: `${process.env.PUBLIC_URL}/images/MinistryOfJustice/CourtScheduling/Calendar.png`, caption: "Court Calendar View" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/MinistryOfJustice/CourtScheduling/Schedule.png`, caption: "Hearing Schedule" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/MinistryOfJustice/CourtScheduling/ResourceView.png`, caption: "Resource Management" },
    ],
  },
  {
    id: "legal-research",
    title: "Legal Research Portal",
    description: "A comprehensive platform for legal research and case law analysis.",
    features: [
      "Advanced search capabilities",
      "Case law database",
      "Legal document repository",
      "Citation management",
      "Research analytics",
    ],
    media: [
      { type: "image", src: `${process.env.PUBLIC_URL}/images/MinistryOfJustice/LegalResearch/Search.png`, caption: "Advanced Search Interface" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/MinistryOfJustice/LegalResearch/Results.png`, caption: "Search Results" },
      { type: "image", src: `${process.env.PUBLIC_URL}/images/MinistryOfJustice/LegalResearch/DocumentView.png`, caption: "Document Viewer" },
    ],
  },
];

const MinistryOfJustice = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [selectedMedia, setSelectedMedia] = useState(null);

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
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <div className="moj-container">
        <img
          src={`${process.env.PUBLIC_URL}/logos/MinistryOfJustice.png`}
          alt="Ministry of Justice Logo"
          className="moj-logo"
        />
        <h1 className="moj-title">Ministry of Justice Projects</h1>
        <p className="moj-subtitle">
          Digital transformation initiatives for the justice system.
        </p>

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
        <div className="moj-content">
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

export default MinistryOfJustice;
