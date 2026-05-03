import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import useMediaTracking from "../hooks/useMediaTracking";
import "../styles/project-shared.css";
import "../styles/Gremlins.css";

const GREMLINS_SITE_URL = "https://gremlins.site";

const img = (filename) =>
  `${process.env.PUBLIC_URL}/images/Gremlins/${encodeURIComponent(filename)}`;

const Gremlins = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedImage, setSelectedImage] = useState(null);
  const { trackMediaClick } = useMediaTracking();

  const embedWrapRef = useRef(null);
  const shouldLoadIframe = useInView(embedWrapRef, {
    once: true,
    margin: "120px",
    amount: 0.05,
  });

  const media = [
    { type: "image", src: img("Gremlins 1.png"), caption: "Gremlins UI — primary view" },
    { type: "image", src: img("Gremlins 2.png"), caption: "Gremlins UI — secondary view" },
    {
      type: "image",
      src: img("Safety profiles.png"),
      caption: "Safety profiles and safeguards",
    },
    {
      type: "image",
      src: img("rules n timing.png"),
      caption: "Rules and scheduling",
    },
    { type: "image", src: img("app data.png"), caption: "App data and storage" },
  ];

  const projectInfo = `const gremlins = {
  name: "Gremlins",
  type: "desktop + marketing-site",
  url: "https://gremlins.site",
  description:
    "Windows tray companion that applies playful, configurable chaos—hooks only for tricks you enable; JSON settings; panic and schedules.",
  stack: [
    "C#",
    ".NET 8",
    "WPF",
    "Win32",
    "React 19",
    "TypeScript",
    "Vite 7",
    "Cloudflare Workers",
    "xUnit",
  ],
  features: [
    "Tray-first dashboard",
    "Per-gremlin severity",
    "Quiet hours & panic",
    "Single-file self-contained release",
    "Store-ready MSIX pipeline",
  ],
};`;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const features = [
    "Tray-first desktop UX—dashboard opens from the notification area",
    "Multiple gremlin behaviors with Mischievous → Annoying → Unhinged severity",
    "Scheduling and guardrails: quiet hours, idle boost, pause during fullscreen",
    "Panic mode silences everything instantly",
    "Themes and optional UI sounds; dark-first UI aligned with Windows 11",
    "Optional local activity log",
    "Portable mode when configured",
    "Local-only processing—no uploads to Gremlins servers",
    "Win32 hooks only for user-enabled tricks",
    "Self-contained win-x64 publish (no separate .NET runtime for users)",
    "GitHub Releases ship Gremlins.exe plus Inno Setup installer",
    "Microsoft Store packaging (full-trust desktop bridge)",
    "Marketing site: React + Vite on Cloudflare Workers with SPA fallback",
  ];

  const techStack = [
    "C# · .NET 8 · WPF · WinForms interop",
    "CommunityToolkit.Mvvm · Hardcodet.NotifyIcon.Wpf · NAudio",
    "Newtonsoft.Json · Microsoft.Extensions.DependencyInjection",
    "Win32 P/Invoke (hooks, SendInput, cursor/window APIs)",
    "Inno Setup · MSIX / Microsoft Store pipeline",
    "React 19 · TypeScript · Vite 7 · Lucide React",
    "Cloudflare Workers · Wrangler (static SPA)",
    "xUnit · GitHub Actions release workflow",
  ];

  return (
    <div className="project-page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="project-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="project-header">
          <motion.img
            src={`${process.env.PUBLIC_URL}/logos/gremlin-icon.png`}
            alt="Gremlins logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> Gremlins
          </h1>
          <Terminal
            lines={[
              "dotnet publish -r win-x64 --self-contained",
              "tray: listening · hooks: opt-in only",
              "gremlin: TheTypist · severity: Annoying",
              "settings → %APPDATA%\\Gremlins\\",
              "panic: ALL SILENCED",
              "vite build && wrangler deploy",
              `url: '${GREMLINS_SITE_URL}'`,
            ]}
            prompt=">"
            typingSpeed={35}
            autoStart={true}
            className="project-terminal"
            title="project.js"
          />
        </div>

        <div className="project-content">
          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Project Information
            </h2>
            <CodeBlock
              code={projectInfo}
              language="javascript"
              showLineNumbers={true}
              copyable={false}
            />
            <a
              href={GREMLINS_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button"
              onClick={() => trackMediaClick("link", GREMLINS_SITE_URL, "gremlins.site header")}
            >
              Visit gremlins.site →
            </a>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Screenshots
            </h2>
            <p className="section-description">
              Desktop app UI (Windows)—gallery opens full size on click.
            </p>
            <div className="project-media">
              {media.map((item, index) => (
                <motion.div
                  key={item.src}
                  className="media-container"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.37 + index * 0.06 }}
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    trackMediaClick(item.type, item.src, item.caption);
                    setSelectedImage(item);
                  }}
                >
                  <img src={item.src} alt={item.caption} className="gallery-image" />
                  <p className="media-caption">{item.caption}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="project-section"
            aria-labelledby="gremlins-marketing-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="section-title" id="gremlins-marketing-heading">
              <span className="code-comment">//</span> Marketing site
            </h2>
            <p className="section-description">
              Download links and product details live on{" "}
              <strong>gremlins.site</strong>. The Windows tray app is the full experience; the
              embedded page below is the same marketing site for quick browsing without leaving the
              portfolio.
            </p>

            <div ref={embedWrapRef} className="gremlins-site-embed-card">
              <div className="gremlins-site-frame-wrap">
                {!shouldLoadIframe && (
                  <div className="gremlins-site-deferred-placeholder">
                    Scroll to load the site preview (deferred for performance).
                  </div>
                )}

                {shouldLoadIframe && (
                  <iframe
                    src={GREMLINS_SITE_URL}
                    title="Gremlins marketing site"
                    className="gremlins-site-iframe"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
              </div>
            </div>

            <a
              href={GREMLINS_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button external-link-button--secondary"
              onClick={() => trackMediaClick("link", GREMLINS_SITE_URL, "gremlins.site embed footer")}
            >
              Open gremlins.site in a new tab →
            </a>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Try it
            </h2>
            <p className="section-description">
              Gremlins is a <strong>Windows desktop app</strong>: install from{" "}
              <a
                href={GREMLINS_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-site-link"
                onClick={() => trackMediaClick("link", GREMLINS_SITE_URL, "gremlins.site try it")}
              >
                gremlins.site
              </a>
              , <strong>GitHub Releases</strong> (tagged builds ship the self-contained exe and Inno
              installer), or the <strong>Microsoft Store</strong> when your listing is live.
            </p>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Features
            </h2>
            <div className="features-list">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-keyword">✓</span>
                  <span className="feature-text">{feature}</span>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Tech Stack
            </h2>
            <div className="tech-stack-grid">
              {techStack.map((tech, index) => (
                <div key={index} className="tech-badge">
                  <span className="tech-icon">⚡</span>
                  <span className="tech-name">{tech}</span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {selectedImage && (
          <div className="modal" onClick={() => setSelectedImage(null)}>
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" className="modal-close" onClick={() => setSelectedImage(null)}>
                ×
              </button>
              <img src={selectedImage.src} alt={selectedImage.caption} className="modal-image" />
              <p className="modal-caption">{selectedImage.caption}</p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Gremlins;
