import React from "react";
import ProjectLayout from "../components/projects/ProjectLayout";
import "./BakesByOlayide.css";

const BAKES_SITE_URL = "https://bakesbyolayide.co.uk";

const terminalLines = [
  "const bakesByOlayide = {",
  "  name: 'BakesByOlayide',",
  "  type: 'E-commerce Platform',",
  "  description: 'E-commerce platform for custom baked goods',",
  "  url: 'https://bakesbyolayide.co.uk'",
  "};",
];

const projectInfo = `const bakesByOlayide = {
  name: "BakesByOlayide",
  type: "E-commerce Platform",
  description: "E-commerce platform for custom baked goods and desserts",
  technologies: [
    "React.js",
    "Node.js",
    "Firebase",
    "Stripe"
  ],
  features: [
    "Custom cake ordering",
    "Product catalog",
    "Secure payment processing",
    "Order management",
    "User accounts"
  ]
};`;

const engineering = [
  { icon: "🎠", title: "Sophisticated Carousel", text: "Custom-built, touch-friendly, hardware-accelerated, and responsive." },
  { icon: "🎨", title: "Advanced CSS Architecture", text: "Responsive, animated, and themable with CSS Grid & Flexbox." },
  { icon: "⚡", title: "Performance Optimizations", text: "Hardware-accelerated, efficient image loading, and smooth transitions." },
  { icon: "♿", title: "Accessibility Features", text: "ARIA labels, semantic HTML, keyboard navigation, and high contrast." },
  { icon: "🛡️", title: "Robust Error Handling", text: "Graceful fallbacks, loading states, and error boundaries." },
  { icon: "🔄", title: "State Management", text: "Efficient, predictable, and clean separation of UI and logic." },
  { icon: "📦", title: "Code Organization", text: "Modular, reusable, and well-documented components." },
  { icon: "✨", title: "User Experience", text: "Smooth transitions, intuitive navigation, and responsive feedback." },
  { icon: "📱", title: "Mobile-First Approach", text: "Touch-friendly, responsive, and optimized for all devices." },
  { icon: "🛠️", title: "Maintainability", text: "DRY principles, consistent styling, and easy to extend." },
  { icon: "🔒", title: "Security", text: "Safe input handling, secure image loading, and protected routes." },
  { icon: "🧪", title: "Testing", text: "Testable, isolated, and predictable component logic." },
];

const BakesByOlayide = () => {
  return (
    <ProjectLayout
      title="BakesByOlayide"
      terminalLines={terminalLines}
      logo={`${process.env.PUBLIC_URL}/logos/BakesByOlayide.png`}
      codeSnippet={projectInfo}
      embedUrl={BAKES_SITE_URL}
      embedTitle="BakesByOlayide"
    >
      <div>
        <a
          href={BAKES_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="external-link-button"
        >
          Visit the Website →
        </a>
      </div>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> About
        </h2>
        <p className="section-description">
          BakesByOlayide offers a seamless online experience for ordering bespoke cakes and baked goods. Whether you're celebrating a birthday, wedding, or any special event, our platform makes it easy to customize, order, and enjoy delicious treats with just a few clicks.
        </p>
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Engineering Excellence
        </h2>
        <div className="engineering-grid">
          {engineering.map((card, index) => (
            <div key={index} className="engineering-card">
              <span className="engineering-icon">{card.icon}</span>
              <strong>{card.title}</strong>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>
    </ProjectLayout>
  );
};

export default BakesByOlayide;
