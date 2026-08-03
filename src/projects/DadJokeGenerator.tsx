import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import useMediaTracking from "../hooks/useMediaTracking";

const DAD_JOKE_SITE_URL = "https://dad-joke-generator-68xz.onrender.com";
const DAD_JOKE_VIDEO = `/videos/DadJokeGenerator/DadJokeDemo.mp4`;

const terminalLines = [
  "const dadJokeGenerator = {",
  "  name: 'Dad Joke Generator',",
  "  type: 'Web Application',",
  "  description: 'A web app for generating endless dad jokes',",
  "  url: 'https://dad-joke-generator-68xz.onrender.com'",
  "};",
];

const projectInfo = `const dadJokeGenerator = {
  name: "Dad Joke Generator",
  type: "Web Application",
  description: "A web app for generating endless dad jokes",
  technologies: [
    "Ember.js",
    "Node.js",
    "Render"
  ],
  features: [
    "Random dad joke generation",
    "Simple and fun interface",
    "Endless entertainment"
  ]
};`;

const DadJokeGenerator = () => {
  const { trackMediaClick } = useMediaTracking();

  const videos = [
    {
      src: DAD_JOKE_VIDEO,
      caption: "Dad Joke Generator Demo",
      onClick: () =>
        trackMediaClick("video", DAD_JOKE_VIDEO, "Dad Joke Generator Demo"),
    },
  ];

  return (
    <ProjectLayout
      title="Dad Joke Generator"
      terminalLines={terminalLines}
      logo={`/logos/DadJokeGenerator.png`}
      codeSnippet={projectInfo}
      embedUrl={DAD_JOKE_SITE_URL}
      embedTitle="Dad Joke Generator"
      videos={videos}
    >
      <div>
        <a
          href={DAD_JOKE_SITE_URL}
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

export default DadJokeGenerator;
