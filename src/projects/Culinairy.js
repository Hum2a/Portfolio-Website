import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import useMediaTracking from "../hooks/useMediaTracking";

const CULINAIRY_URL = "https://culinairy-239n.onrender.com";

const terminalLines = [
  "const culinary = {",
  "  name: 'CulinAIry',",
  "  type: 'Web Application',",
  "  description: 'AI-powered recipe generator for personalized meals',",
  "  url: 'https://culinairy-239n.onrender.com'",
  "};",
];

const projectInfo = `const culinary = {
  name: "CulinAIry",
  type: "Web Application",
  description: "AI-powered recipe generator for personalized meals",
  technologies: [
    "React.js",
    "Node.js",
    "Firebase",
    "TypeScript",
    "Render"
  ],
  features: [
    "AI-powered recipe generation",
    "Meal planning",
    "Recipe saving",
    "User profiles",
    "Personalized meal suggestions"
  ]
};`;

const CulinAIry = () => {
  const { trackMediaClick } = useMediaTracking();

  const images = [
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Homepage.png`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Recipe Generated.png`, caption: "Recipe Generated" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Login page.png`, caption: "Login and Register" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Meal Planner.png`, caption: "Meal Planner" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/MealsPlaned.png`, caption: "Planned Meals" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Profile.png`, caption: "Profile Settings" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Saved Recipes Closed.png`, caption: "Saved Recipes Overview" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/SaveD Recipes Expanded.png`, caption: "Saved Recipes Expanded" },
  ].map((image) => ({
    ...image,
    onClick: () => trackMediaClick("image", image.src, image.caption),
  }));

  return (
    <ProjectLayout
      title="CulinAIry"
      terminalLines={terminalLines}
      logo={`${process.env.PUBLIC_URL}/logos/CulinAIry.png`}
      codeSnippet={projectInfo}
      embedUrl={CULINAIRY_URL}
      embedTitle="CulinAIry"
      images={images}
    >
      <div>
        <a
          href={CULINAIRY_URL}
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

export default CulinAIry;
