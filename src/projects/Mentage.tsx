import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import useMediaTracking from "../hooks/useMediaTracking";

const MENTAGE_URL = "https://mentage.onrender.com";

const terminalLines = [
  "const mentage = {",
  "  name: 'Mentage',",
  "  type: 'Web Application',",
  "  description: 'AI chatbot designed to help students revise',",
  "  url: 'https://mentage.onrender.com'",
  "};",
];

const projectInfo = `const mentage = {
  name: "Mentage",
  type: "Web Application",
  description: "AI chatbot designed to help students revise",
  technologies: [
    "React.js",
    "Python",
    "Flask",
    "Firebase",
    "OpenAI API"
  ],
  features: [
    "AI-powered learning assistance",
    "Topic management",
    "Conversational interface",
    "Personalized revision help"
  ]
};`;

const Mentage = () => {
  const { trackMediaClick } = useMediaTracking();

  const images = [
    { src: `/images/Mentage/Homepage.png`, caption: "Homepage" },
    { src: `/images/Mentage/Edit topics.png`, caption: "Edit Topics: Manage Topics" },
    { src: `/images/Mentage/Profile.png`, caption: "Profile" },
    { src: `/images/Mentage/conversation 1.png`, caption: "Conversation 1: Chat Interface" },
    { src: `/images/Mentage/conversation 2.png`, caption: "Conversation 2: Chat Features" },
  ].map((image) => ({
    ...image,
    onClick: () => trackMediaClick("image", image.src, image.caption),
  }));

  return (
    <ProjectLayout
      title="Mentage"
      terminalLines={terminalLines}
      logo={`/logos/Mentage.png`}
      codeSnippet={projectInfo}
      embedUrl={MENTAGE_URL}
      embedTitle="Mentage"
      images={images}
    >
      <div>
        <a
          href={MENTAGE_URL}
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

export default Mentage;
