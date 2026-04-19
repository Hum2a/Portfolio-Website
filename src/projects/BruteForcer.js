import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import Terminal from "../components/animations/Terminal";
import CodeBlock from "../components/animations/CodeBlock";
import "../styles/project-shared.css";
import "../styles/BruteForcer.css";

const BRUTE_FORCER_APP_URL = "https://brute-forcer.site";
const LOAD_TIMEOUT_MS = 28000;

const BruteForcer = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const embedWrapRef = useRef(null);
  const shouldLoadIframe = useInView(embedWrapRef, {
    once: true,
    margin: "120px",
    amount: 0.05,
  });

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const projectInfo = `const bruteForcer = {
  name: "Brute-forcer",
  type: "Privacy-focused web tool",
  description: "Entropy, search space, and crack-time estimates from password length + charset pools — no real brute forcing",
  stack: [
    "Next.js 16 (App Router)",
    "React 19",
    "TypeScript",
    "Tailwind CSS 4",
    "shadcn/ui (Base UI)",
    "Cloudflare Workers (OpenNext)"
  ],
  features: [
    "Client-side math only — no password storage",
    "Configurable guesses/sec",
    "Strength labels and plain-language explanations"
  ]
};`;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true);
    setLoadTimedOut(false);
    setIframeError(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setIframeError(true);
    setIframeLoaded(false);
  }, []);

  useEffect(() => {
    if (!shouldLoadIframe || iframeError) return undefined;
    if (iframeLoaded) return undefined;

    const t = window.setTimeout(() => {
      setLoadTimedOut(true);
    }, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [shouldLoadIframe, iframeLoaded, iframeError, retryKey]);

  const handleRetry = () => {
    setIframeError(false);
    setIframeLoaded(false);
    setLoadTimedOut(false);
    setRetryKey((k) => k + 1);
  };

  const showBlockingError = iframeError;
  const showOverlayWhileLoading =
    shouldLoadIframe && !iframeError && !iframeLoaded;
  const showSlowLoadHint = showOverlayWhileLoading && loadTimedOut;

  const iframeSrc =
    retryKey > 0
      ? `${BRUTE_FORCER_APP_URL}/?embed=1&v=${retryKey}`
      : `${BRUTE_FORCER_APP_URL}/?embed=1`;

  const techStack = [
    "Next.js 16 (App Router)",
    "React 19",
    "TypeScript",
    "Tailwind CSS 4",
    "shadcn/ui (Base UI)",
    "Cloudflare Workers (OpenNext)",
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
            src={`${process.env.PUBLIC_URL}/logos/BruteForcer.svg`}
            alt=""
            role="presentation"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> Brute-forcer
          </h1>
          <Terminal
            lines={[
              "const bruteForcer = {",
              "  name: 'Brute-forcer',",
              "  type: 'Privacy-focused web tool',",
              "  url: 'https://brute-forcer.site',",
              "  note: 'Estimates only — calculations run in your browser',",
              "};",
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
            transition={{ delay: 0.25 }}
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
              href={BRUTE_FORCER_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button"
            >
              Open brute-forcer.site →
            </a>
          </motion.section>

          <motion.section
            className="project-section"
            aria-labelledby="brute-forcer-live-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            <h2 className="section-title" id="brute-forcer-live-heading">
              <span className="code-comment">//</span> Live demo
            </h2>
            <p className="section-description">
              The full tool runs below in a cross-origin frame. Calculations are
              performed in your browser inside the embedded app; this portfolio
              page does not receive your password. For high-value secrets, prefer
              offline checks and verify the published source of any tool before
              you trust it in an embedded context.
            </p>

            <div
              ref={embedWrapRef}
              className="brute-forcer-embed-card"
              data-embed-ready={shouldLoadIframe ? "true" : "false"}
            >
              <div className="brute-forcer-embed-frame-wrap">
                {!shouldLoadIframe && (
                  <div className="brute-forcer-deferred-placeholder">
                    Scroll to load the demo (deferred for performance).
                  </div>
                )}

                {shouldLoadIframe && !showBlockingError && (
                  <>
                    <iframe
                      key={retryKey}
                      src={iframeSrc}
                      title="Brute-forcer: password strength and entropy analyzer"
                      className="brute-forcer-iframe"
                      loading="lazy"
                      onLoad={handleIframeLoad}
                      onError={handleIframeError}
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                    {showOverlayWhileLoading && (
                      <div
                        className="brute-forcer-embed-loading"
                        aria-live="polite"
                        aria-busy="true"
                      >
                        {!showSlowLoadHint ? (
                          <>
                            <div className="brute-forcer-spinner" aria-hidden />
                            <span>Loading Brute-forcer…</span>
                          </>
                        ) : (
                          <span>
                            Still loading… If the frame stays empty, the
                            deployment may block embedding (
                            <code className="code-comment">frame-ancestors</code>
                            ). Open the site in a new tab or adjust headers on the
                            Brute-forcer Worker for{" "}
                            <code>https://humza-butt.space</code>.
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}

                {showBlockingError && (
                  <div
                    className="brute-forcer-embed-error"
                    role="alert"
                    id="brute-forcer-embed-error"
                  >
                    <p className="brute-forcer-error-title">
                      Could not load the embedded app
                    </p>
                    <p className="brute-forcer-error-text">
                      The iframe failed to load. Open the tool in a new tab, or
                      if the frame is blank (not an error), the Worker may need
                      a Content-Security-Policy{" "}
                      <code>frame-ancestors &apos;self&apos; https://humza-butt.space</code>{" "}
                      so it can be embedded only from your portfolio (and localhost
                      in development).
                    </p>
                    <a
                      href={BRUTE_FORCER_APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="external-link-button"
                    >
                      Open brute-forcer.site →
                    </a>
                    <button
                      type="button"
                      className="external-link-button external-link-button--secondary"
                      onClick={handleRetry}
                    >
                      Retry embed
                    </button>
                  </div>
                )}
              </div>
            </div>

            <a
              href={BRUTE_FORCER_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button external-link-button--secondary"
            >
              Open in new tab →
            </a>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Tech Stack
            </h2>
            <div className="tech-stack-grid">
              {techStack.map((tech, index) => (
                <div key={index} className="tech-badge">
                  <span className="tech-name">{tech}</span>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default BruteForcer;
