import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import useMediaTracking from "../hooks/useMediaTracking";

const DOPPELGAN_CAR_URL = "https://doppelgang-car.vercel.app";

const terminalLines = [
  "const doppelganCar = {",
  "  name: 'Doppelgan-Car',",
  "  type: 'Web Application',",
  "  description: 'AI-powered car personality matcher',",
  "  url: 'https://doppelgang-car.vercel.app'",
  "};",
];

const projectInfo = `const doppelganCar = {
  name: "Doppelgan-Car",
  type: "Web Application",
  description: "AI-powered car personality matcher",
  technologies: [
    "Nuxt.js",
    "JavaScript",
    "Python",
    "Flask",
    "OpenAI",
    "Render"
  ],
  features: [
    "AI-powered car matching",
    "Personality analysis",
    "Image upload and processing",
    "Mobile-friendly interface"
  ]
};`;

const DoppelganCar = () => {
  const { trackMediaClick } = useMediaTracking();

  const images = [
    { src: `${process.env.PUBLIC_URL}/images/DoppelganCar/Homepage.png`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/images/DoppelganCar/Upload.png`, caption: "Upload and Analyze" },
    { src: `${process.env.PUBLIC_URL}/images/DoppelganCar/Results.png`, caption: "Car Match Results" },
    { src: `${process.env.PUBLIC_URL}/images/DoppelganCar/MobileView.png`, caption: "Mobile-Friendly UI" },
  ].map((image) => ({
    ...image,
    onClick: () => trackMediaClick("image", image.src, image.caption),
  }));

  return (
    <ProjectLayout
      title="Doppelgan-Car"
      terminalLines={terminalLines}
      logo={`${process.env.PUBLIC_URL}/logos/Doppelgancar.png`}
      codeSnippet={projectInfo}
      embedUrl={DOPPELGAN_CAR_URL}
      embedTitle="Doppelgan-Car"
      images={images}
    >
      <div>
        <a
          href={DOPPELGAN_CAR_URL}
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

export default DoppelganCar;
