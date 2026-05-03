import React, { useRef } from "react";
import { useInView } from "framer-motion";
import "../styles/ProjectSiteEmbed.css";

/**
 * Lazy-loads a site in an iframe when the block scrolls into view.
 * @param {string} url - Full URL to embed
 * @param {string} iframeTitle - iframe title (a11y)
 * @param {boolean} [useSandbox=false] - If true, applies a permissive sandbox (some SPAs need false)
 * @param {string} [newTabLabel] - If set, show link under iframe; pass null to hide
 * @param {object} [secondaryLinkProps] - Extra props for the new-tab anchor (e.g. onClick tracking)
 */
const ProjectSiteEmbed = ({
  url,
  iframeTitle = "Live site",
  useSandbox = false,
  newTabLabel = "Open in new tab →",
  secondaryLinkProps = {},
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "120px", amount: 0.05 });
  const sandboxValue = useSandbox
    ? "allow-scripts allow-same-origin allow-forms allow-popups"
    : undefined;

  return (
    <>
      <div ref={ref} className="project-site-embed-card">
        <div className="project-site-embed-frame-wrap">
          {!inView && (
            <div className="project-site-embed-placeholder">
              Scroll to load the site preview (deferred for performance).
            </div>
          )}
          {inView && (
            <iframe
              src={url}
              title={iframeTitle}
              className="project-site-embed-iframe"
              loading="lazy"
              {...(sandboxValue ? { sandbox: sandboxValue } : {})}
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>
      </div>
      {newTabLabel ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="external-link-button external-link-button--secondary"
          {...secondaryLinkProps}
        >
          {newTabLabel}
        </a>
      ) : null}
    </>
  );
};

export default ProjectSiteEmbed;
