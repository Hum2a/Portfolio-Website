import React, { useState } from "react";
import { motion } from "framer-motion";
import ProjectLayout from "../components/projects/ProjectLayout";
import useMediaTracking from "../hooks/useMediaTracking";
import "./MinistryOfJustice.css";

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
      { type: "image", src: `/images/MinistryOfJustice/CaseManagement/Dashboard.png`, caption: "Case Management Dashboard" },
      { type: "image", src: `/images/MinistryOfJustice/CaseManagement/CaseDetails.png`, caption: "Case Details View" },
      { type: "image", src: `/images/MinistryOfJustice/CaseManagement/DocumentViewer.png`, caption: "Document Management" },
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
      { type: "image", src: `/images/MinistryOfJustice/CourtScheduling/Calendar.png`, caption: "Court Calendar View" },
      { type: "image", src: `/images/MinistryOfJustice/CourtScheduling/Schedule.png`, caption: "Hearing Schedule" },
      { type: "image", src: `/images/MinistryOfJustice/CourtScheduling/ResourceView.png`, caption: "Resource Management" },
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
      { type: "image", src: `/images/MinistryOfJustice/LegalResearch/Search.png`, caption: "Advanced Search Interface" },
      { type: "image", src: `/images/MinistryOfJustice/LegalResearch/Results.png`, caption: "Search Results" },
      { type: "image", src: `/images/MinistryOfJustice/LegalResearch/DocumentView.png`, caption: "Document Viewer" },
    ],
  },
];

const terminalLines = [
  "const ministryOfJustice = {",
  "  name: 'Ministry of Justice Projects',",
  "  type: 'Enterprise Web Applications',",
  "  description: 'Digital transformation initiatives for the justice system'",
  "};",
];

const projectInfo = `const ministryOfJustice = {
  name: "Ministry of Justice Projects",
  type: "Enterprise Web Applications",
  description: "Digital transformation initiatives for the justice system",
  technologies: [
    "React.js",
    "Node.js",
    "Firebase",
    "Render"
  ],
  projects: [
    "Case Management System",
    "Court Scheduling System",
    "Legal Research Portal"
  ]
};`;

const MinistryOfJustice = () => {
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { trackMediaClick } = useMediaTracking();

  return (
    <ProjectLayout
      title="Ministry of Justice"
      terminalLines={terminalLines}
      logo={`/logos/MinistryOfJustice.png`}
      codeSnippet={projectInfo}
    >
      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Select a Project
        </h2>
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
      </section>

      <motion.section
        className="project-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        key={selectedProject.id}
      >
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> {selectedProject.title}
        </h2>
        <p className="section-description">{selectedProject.description}</p>
        <div className="features-list">
          {selectedProject.features.map((feature, index) => (
            <div key={index} className="feature-item">
              <span className="feature-keyword">✓</span>
              <span className="feature-text">{feature}</span>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="project-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        key={`media-${selectedProject.id}`}
      >
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Screenshots
        </h2>
        <div className="project-media">
          {selectedProject.media.map((media, index) => (
            <motion.div
              key={index}
              className="media-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              whileHover={{ y: -5 }}
              onClick={() => {
                trackMediaClick(media.type, media.src, media.caption);
                setSelectedMedia(media);
              }}
            >
              {media.type === "image" ? (
                <img src={media.src} alt={media.caption} className="project-image" />
              ) : (
                <video className="project-video-preview" src={media.src} />
              )}
              <p className="media-caption">{media.caption}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {selectedMedia && (
        <div className="modal" onClick={() => setSelectedMedia(null)}>
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedMedia(null)}>
              ×
            </button>
            {selectedMedia.type === "image" ? (
              <img src={selectedMedia.src} alt={selectedMedia.caption} className="modal-image" />
            ) : (
              <video controls className="modal-video" autoPlay src={selectedMedia.src} />
            )}
            <p className="modal-caption">{selectedMedia.caption}</p>
          </motion.div>
        </div>
      )}
    </ProjectLayout>
  );
};

export default MinistryOfJustice;
