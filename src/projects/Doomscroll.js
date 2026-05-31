import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import useMediaTracking from "../hooks/useMediaTracking";

const DOOMSCROLL_URL = "https://infinite-useless-scroll.onrender.com";
const DOOMSCROLL_VIDEO = `${process.env.PUBLIC_URL}/videos/DoomScroll/Doomscroll Demo.mp4`;

const terminalLines = [
  "const doomscroll = {",
  "  name: 'DoomScroll',",
  "  type: 'Web Application',",
  "  description: 'A satirical app to mimic infinite scrolling',",
  "  url: 'https://infinite-useless-scroll.onrender.com'",
  "};",
];

const projectInfo = `const doomscroll = {
  name: "DoomScroll",
  type: "Web Application",
  description: "A satirical app to mimic infinite scrolling behavior",
  technologies: [
    "React.js",
    "Node.js",
    "Render"
  ],
  features: [
    "Infinite scrolling",
    "Useless facts generator",
    "Satirical design",
    "Endless entertainment"
  ]
};`;

const DoomScroll = () => {
  const { trackMediaClick } = useMediaTracking();

  const videos = [
    {
      src: DOOMSCROLL_VIDEO,
      caption: "DoomScroll App Demo",
      onClick: () => trackMediaClick("video", DOOMSCROLL_VIDEO, "DoomScroll App Demo"),
    },
  ];

  return (
    <ProjectLayout
      title="DoomScroll"
      terminalLines={terminalLines}
      logo={`${process.env.PUBLIC_URL}/logos/Doomscroll.png`}
      codeSnippet={projectInfo}
      embedUrl={DOOMSCROLL_URL}
      embedTitle="DoomScroll"
      videos={videos}
    >
      <div>
        <a
          href={DOOMSCROLL_URL}
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

export default DoomScroll;
