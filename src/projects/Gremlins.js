import React, { useState } from "react";
import { motion } from "framer-motion";
import ProjectLayout from "../components/projects/ProjectLayout";
import useMediaTracking from "../hooks/useMediaTracking";
import "./Gremlins.css";

const GREMLINS_SITE_URL = "https://gremlins.site";

const img = (filename) =>
  `${process.env.PUBLIC_URL}/images/Gremlins/${encodeURIComponent(filename)}`;

const terminalLines = [
  "dotnet publish -r win-x64 --self-contained",
  "tray: listening · hooks: opt-in only",
  "gremlin: TheTypist · severity: Annoying",
  "settings → %APPDATA%\\Gremlins\\",
  "panic: ALL SILENCED",
  "vite build && wrangler deploy",
  `url: '${GREMLINS_SITE_URL}'`,
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

const media = [
  { type: "image", src: img("Gremlins 1.png"), caption: "Gremlins UI — primary view" },
  { type: "image", src: img("Gremlins 2.png"), caption: "Gremlins UI — secondary view" },
  { type: "image", src: img("Safety profiles.png"), caption: "Safety profiles and safeguards" },
  { type: "image", src: img("rules n timing.png"), caption: "Rules and scheduling" },
  { type: "image", src: img("app data.png"), caption: "App data and storage" },
];

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

const Gremlins = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const { trackMediaClick } = useMediaTracking();

  return (
    <ProjectLayout
      title="Gremlins"
      terminalLines={terminalLines}
      logo={`${process.env.PUBLIC_URL}/logos/gremlin-icon.png`}
      codeSnippet={projectInfo}
      embedUrl={GREMLINS_SITE_URL}
      embedTitle="Gremlins marketing site"
      embedSandbox
      embedNewTabLabel="Open gremlins.site in a new tab →"
      embedSecondaryLinkProps={{
        onClick: () =>
          trackMediaClick("link", GREMLINS_SITE_URL, "gremlins.site embed footer"),
      }}
      features={features}
      techStack={techStack}
    >
      <div>
        <a
          href={GREMLINS_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="external-link-button"
          onClick={() => trackMediaClick("link", GREMLINS_SITE_URL, "gremlins.site header")}
        >
          Visit gremlins.site →
        </a>
      </div>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Screenshots
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
      </section>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Try it
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
      </section>

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
    </ProjectLayout>
  );
};

export default Gremlins;
