import React from "react";
import { motion } from "framer-motion";
import ProjectLayout from "../components/projects/ProjectLayout";
import useMediaTracking from "../hooks/useMediaTracking";

const PNG_TO_SVG_URL = "https://pngtosvg-ulmg.onrender.com";
const SAMPLE_IMAGE = `${process.env.PUBLIC_URL}/images/PNGtoSVG/sample.png`;

const terminalLines = [
  "const pngToSvg = {",
  "  name: 'PNG to SVG Converter',",
  "  type: 'Web Application',",
  "  description: 'Easily convert PNG images into SVG format',",
  "  url: 'https://pngtosvg-ulmg.onrender.com'",
  "};",
];

const projectInfo = `const pngToSvg = {
  name: "PNG to SVG Converter",
  type: "Web Application",
  description: "Easily convert PNG images into SVG format",
  technologies: [
    "Angular",
    "Node.js"
  ],
  features: [
    "Simple and intuitive upload process",
    "High-quality SVG conversions",
    "Downloadable results in one click"
  ]
};`;

const PNGtoSVG = () => {
  const { trackMediaClick } = useMediaTracking();

  return (
    <ProjectLayout
      title="PNG to SVG Converter"
      terminalLines={terminalLines}
      logo={`${process.env.PUBLIC_URL}/logos/PNGtoSVG.png`}
      codeSnippet={projectInfo}
      embedUrl={PNG_TO_SVG_URL}
      embedTitle="PNG to SVG"
    >
      <div>
        <a
          href={PNG_TO_SVG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="external-link-button"
        >
          Visit the Website →
        </a>
      </div>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Sample
        </h2>
        <div className="image-gallery">
          <motion.div
            className="image-container"
            whileHover={{ y: -5 }}
            onClick={() => {
              trackMediaClick("image", SAMPLE_IMAGE, "Sample Conversion Result");
            }}
            style={{ cursor: "pointer" }}
          >
            <img src={SAMPLE_IMAGE} alt="Sample Conversion" className="gallery-image" />
            <p className="image-caption">Sample Conversion Result</p>
          </motion.div>
        </div>
      </section>
    </ProjectLayout>
  );
};

export default PNGtoSVG;
