import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SITE_ORIGIN = 'https://humza-butt.space';
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/images/portfolio-preview.jpg`;
export const DEFAULT_DESCRIPTION =
  'Humza Butt - Software Engineer, Full Stack & Platform Configuration. Sutton, UK. Enterprise platform work for Shell, the BBC, the NHS and the Home Office. 29 shipped projects across web, mobile, desktop and extensions.';

function absoluteUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) return DEFAULT_OG_IMAGE;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_ORIGIN}${path}`;
}

function canonicalFromPath(path: string): string {
  if (!path || path === '/') return `${SITE_ORIGIN}/`;
  const normalised = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalised}`;
}

export type SeoProps = {
  title: string;
  description?: string;
  /** Route path e.g. `/projects` or `/bgr8` */
  path?: string;
  /** Absolute or site-relative OG image */
  image?: string;
  /** When true, sets robots noindex,nofollow */
  noindex?: boolean;
};

/**
 * Per-route document head. Titles are suffixed with the site name unless they
 * already include "Humza Butt".
 */
const Seo: React.FC<SeoProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image,
  noindex = false,
}) => {
  const fullTitle = title.includes('Humza Butt')
    ? title
    : `${title} | Humza Butt`;
  const url = canonicalFromPath(path);
  const ogImage = absoluteUrl(image);
  const robots = noindex ? 'noindex, nofollow' : 'index, follow';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Humza Butt Portfolio" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default Seo;
