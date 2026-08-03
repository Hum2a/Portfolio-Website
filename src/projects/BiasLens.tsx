import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import useMediaTracking from "../hooks/useMediaTracking";

const BIAS_LENS_URL = "https://biaslens.vercel.app";

const terminalLines = [
  "const biaslens = {",
  "  name: 'BiasLens',",
  "  type: 'Web Application',",
  "  description: 'Political alignment analyser for web articles',",
  "  url: 'https://biaslens.vercel.app'",
  "};",
];

const projectInfo = `const biaslens = {
  name: "BiasLens",
  type: "Web Application",
  description: "Political alignment analyser for web articles",
  technologies: [
    "Next.js",
    "JavaScript",
    "Node.js",
    "Python",
    "Django",
    "Firebase",
    "Vercel"
  ],
  features: [
    "News article analysis",
    "Political bias detection",
    "Sentiment analysis",
    "NLP techniques"
  ]
};`;

const BiasLens = () => {
  const { trackMediaClick } = useMediaTracking();

  const images = [
    {
      src: `/images/BiasLens/Homepage 1.png`,
      caption: "Homepage displaying news sources",
    },
    {
      src: `/images/BiasLens/Homepage 2.png`,
      caption: "News articles analyzed for bias",
    },
    {
      src: `/images/BiasLens/Homepage 3.png`,
      caption: "News articles analyzed for bias",
    },
  ].map((image) => ({
    ...image,
    onClick: () => trackMediaClick("image", image.src, image.caption),
  }));

  return (
    <ProjectLayout
      title="BiasLens"
      terminalLines={terminalLines}
      logo={`/logos/BiasLens.png`}
      codeSnippet={projectInfo}
      embedUrl={BIAS_LENS_URL}
      embedTitle="BiasLens"
      images={images}
    >
      <div>
        <a
          href={BIAS_LENS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="external-link-button"
        >
          Visit the Website →
        </a>
      </div>
    </ProjectLayout>
  );
};

export default BiasLens;
