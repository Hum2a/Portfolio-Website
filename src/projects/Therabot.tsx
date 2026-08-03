import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import useMediaTracking from "../hooks/useMediaTracking";

const THERABOT_URL = "https://therabot-site.onrender.com";

const terminalLines = [
  "const therabot = {",
  "  name: 'Therabot',",
  "  type: 'Web Application & WhatsApp Bot',",
  "  description: 'Chatbot offering mental health support',",
  "  url: 'https://therabot-site.onrender.com'",
  "};",
];

const projectInfo = `const therabot = {
  name: "Therabot",
  type: "Web Application & WhatsApp Bot",
  description: "Chatbot offering mental health support and resources",
  platforms: ["Web", "WhatsApp"],
  technologies: [
    "React.js",
    "Node.js",
    "Firebase",
    "Render",
    "OpenAI API"
  ],
  features: [
    "Guided meditations",
    "Personalized mental health tips",
    "Anonymous chat sessions",
    "WhatsApp integration",
    "Conversation history"
  ]
};`;

const features = [
  "Guided meditations",
  "Personalized mental health tips",
  "Anonymous chat sessions",
];

const Therabot = () => {
  const { trackMediaClick } = useMediaTracking();

  const images = [
    { src: `/images/Therabot/Dashboard.png`, caption: "Dashboard" },
    { src: `/images/Therabot/Settings.png`, caption: "Settings" },
    { src: `/images/Therabot/Role settings.png`, caption: "Role Settings" },
    { src: `/images/Therabot/Tone settings.png`, caption: "Tone Settings" },
    { src: `/images/Therabot/Profile.png`, caption: "Profile Settings" },
    { src: `/images/Therabot/Web chat empty.png`, caption: "Chat interface overview" },
    { src: `/images/Therabot/ACtive webchat.png`, caption: "Live chat in action" },
    { src: `/images/Therabot/Conversation History.png`, caption: "Review past sessions" },
    { src: `/images/Therabot/Conveersation Hisotry expanded a bit.png`, caption: "Expanded Conversation History" },
    { src: `/images/Therabot/Whatsapp chat.png`, caption: "Whatsapp Chat" },
  ].map((image) => ({
    ...image,
    onClick: () => trackMediaClick("image", image.src, image.caption),
  }));

  return (
    <ProjectLayout
      title="Therabot"
      terminalLines={terminalLines}
      logo={`/logos/Therabot.png`}
      codeSnippet={projectInfo}
      embedUrl={THERABOT_URL}
      embedTitle="Therabot"
      features={features}
      images={images}
    >
      <div>
        <a
          href={THERABOT_URL}
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

export default Therabot;
