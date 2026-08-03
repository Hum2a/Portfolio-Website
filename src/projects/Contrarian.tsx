import React, { useState } from "react";
import { motion } from "framer-motion";
import ProjectLayout from "../components/projects/ProjectLayout";
import useMediaTracking from "../hooks/useMediaTracking";
import "./Contrarian.css";

const terminalLines = [
  "const contrarian = {",
  "  name: 'Contrarian',",
  "  type: 'Web Application',",
  "  description: 'Pitch deck classifier for investors',",
  "};",
];

const projectInfo = `const contrarian = {
  name: "Contrarian",
  type: "Web Application",
  description: "Pitch deck classifier for investors to analyze startup pitches",
  technologies: [
    "React.js",
    "Python",
    "Flask",
    "OpenAI API",
    "Firebase",
    "Render"
  ],
  features: [
    "AI-powered pitch analysis",
    "Pitch deck classification",
    "Investment insights",
    "OmniWidget integration"
  ]
};`;

const Contrarian = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { trackMediaClick } = useMediaTracking();

  const media = [
    { type: "image", src: `/images/Contrarian/Homepage.png`, caption: "Homepage" },
    { type: "image", src: `/images/Contrarian/Round2.png`, caption: "Round 2" },
    { type: "video", src: `/videos/Contrarian/OmniWidget.mp4`, caption: "OmniWidget Demo" },
  ];

  return (
    <ProjectLayout
      title="Contrarian"
      terminalLines={terminalLines}
      logo={`/logos/Contrarian.png`}
      codeSnippet={projectInfo}
    >
      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Media
        </h2>
        <div className="project-media">
          {media.map((item, index) => (
            <motion.div
              key={index}
              className="media-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => {
                trackMediaClick(item.type, item.src, item.caption);
                item.type === "image" ? setSelectedImage(item) : setSelectedVideo(item);
              }}
            >
              {item.type === "image" ? (
                <img src={item.src} alt={item.caption} className="gallery-image" />
              ) : (
                <video className="gallery-video" src={item.src} />
              )}
              <p className="media-caption">{item.caption}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedImage(null)}>
              ×
            </button>
            <img src={selectedImage.src} alt={selectedImage.caption} className="modal-image" />
            <p className="modal-caption">{selectedImage.caption}</p>
          </motion.div>
        </div>
      )}

      {selectedVideo && (
        <div className="modal" onClick={() => setSelectedVideo(null)}>
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelectedVideo(null)}>
              ×
            </button>
            <video controls className="modal-video" autoPlay src={selectedVideo.src} />
            <p className="modal-caption">{selectedVideo.caption}</p>
          </motion.div>
        </div>
      )}
    </ProjectLayout>
  );
};

export default Contrarian;
