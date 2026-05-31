import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import useMediaTracking from "../hooks/useMediaTracking";

const LDMF_URL = "https://ldmf.onrender.com";

const terminalLines = [
  "const liberalDemocrats = {",
  "  name: 'Liberal Democrats',",
  "  type: 'Informative Website',",
  "  description: 'Informative website for the LDMF',",
  "  url: 'https://ldmf.onrender.com'",
  "};",
];

const projectInfo = `const liberalDemocrats = {
  name: "Liberal Democrats",
  type: "Informative Website",
  description: "Informative website for the Liberal Democrats Muslim Foundation (LDMF)",
  technologies: [
    "Vue.js",
    "Node.js"
  ],
  features: [
    "Policy information",
    "Campaign updates",
    "News and updates",
    "Contact forms",
    "Join us functionality"
  ]
};`;

const LiberalDemocrats = () => {
  const { trackMediaClick } = useMediaTracking();

  const images = [
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Homepage.png`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/AboutUs.png`, caption: "About Us" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Campaigns.png`, caption: "Campaigns" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/ContactUs.png`, caption: "Contact Us" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Education.png`, caption: "Education Policy" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Equality.png`, caption: "Equality Campaign" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Housing.png`, caption: "Housing" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/JoinUs.png`, caption: "Join Us" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/MentalHealth.png`, caption: "Mental Health" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/Brexit.png`, caption: "Brexit Policy" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/ClimateEmergency.png`, caption: "Climate Emergency" },
    { src: `${process.env.PUBLIC_URL}/images/Liberal Democrats/News.png`, caption: "News and Updates" },
  ].map((image) => ({
    ...image,
    onClick: () => trackMediaClick("image", image.src, image.caption),
  }));

  return (
    <ProjectLayout
      title="Liberal Democrats"
      terminalLines={terminalLines}
      logo={`${process.env.PUBLIC_URL}/logos/LDMF.png`}
      codeSnippet={projectInfo}
      embedUrl={LDMF_URL}
      embedTitle="LDMF"
      images={images}
    >
      <div>
        <a
          href={LDMF_URL}
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

export default LiberalDemocrats;
