import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import Img from '../media/Img';
import './ProjectSiteEmbed.css';

const EMBED_TIMEOUT_MS = 3000;

export type ProjectSiteEmbedProps = {
  url?: string | null;
  iframeTitle?: string;
  useSandbox?: boolean;
  newTabLabel?: string | null;
  secondaryLinkProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  /** When false/undefined, never mount an iframe — screenshot CTA only */
  embeddable?: boolean;
  /** Fallback / primary preview image */
  previewSrc?: string | null;
  previewAlt?: string;
};

/**
 * Live-site preview. Never ships a failing iframe:
 * - embeddable !== true → screenshot + Visit live site overlay
 * - embeddable → iframe with load-timeout / onError fallback to the same overlay
 */
const ProjectSiteEmbed: React.FC<ProjectSiteEmbedProps> = ({
  url,
  iframeTitle = 'Live site',
  useSandbox = false,
  newTabLabel = 'Visit live site →',
  secondaryLinkProps = {},
  embeddable = false,
  previewSrc,
  previewAlt = 'Project preview',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '120px', amount: 0.05 });
  const [iframeFailed, setIframeFailed] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const canEmbed = Boolean(embeddable && url);
  const showIframe = canEmbed && inView && !iframeFailed;

  useEffect(() => {
    if (!showIframe || iframeLoaded) return;
    const t = window.setTimeout(() => {
      setIframeFailed(true);
    }, EMBED_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [showIframe, iframeLoaded]);

  const sandboxValue = useSandbox
    ? 'allow-scripts allow-same-origin allow-forms allow-popups'
    : undefined;

  const overlay = url ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-site-embed-overlay"
      {...secondaryLinkProps}
    >
      <span className="project-site-embed-overlay-label">
        {newTabLabel || 'Visit live site →'}
      </span>
    </a>
  ) : null;

  const screenshotBlock = (
    <div className="project-site-embed-shot">
      {previewSrc ? (
        <Img
          src={previewSrc}
          alt={previewAlt}
          className="project-site-embed-shot-img"
        />
      ) : (
        <div className="project-site-embed-shot-fallback" aria-hidden="true" />
      )}
      {overlay}
    </div>
  );

  return (
    <>
      <div ref={ref} className="project-site-embed-card">
        <div className="project-site-embed-frame-wrap">
          {!canEmbed && screenshotBlock}

          {canEmbed && !inView && (
            <div className="project-site-embed-placeholder">
              Scroll to load the site preview (deferred for performance).
            </div>
          )}

          {showIframe && (
            <iframe
              src={url!}
              title={iframeTitle}
              className="project-site-embed-iframe"
              loading="lazy"
              {...(sandboxValue ? { sandbox: sandboxValue } : {})}
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIframeLoaded(true)}
              onError={() => setIframeFailed(true)}
            />
          )}

          {canEmbed && inView && iframeFailed && screenshotBlock}
        </div>
      </div>
      {url && newTabLabel && canEmbed && !iframeFailed ? (
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
