import React, { useState } from 'react';
import imageManifest from '../../data/imageManifest.json';
import './Img.css';

export type ImageManifestEntry = {
  src: string;
  webp: string;
  avif: string;
  blur: string;
  width: number;
  height: number;
  dominantColor: string;
};

type ManifestMap = Record<string, ImageManifestEntry>;

const manifest = imageManifest as ManifestMap;

/**
 * Encode a public path for use in src/href while preserving `/` separators.
 * Handles spaces and other special characters in filenames.
 */
export function encodePublicPath(path: string): string {
  if (!path) return path;
  return path
    .split('/')
    .map((segment) => (segment ? encodeURIComponent(segment) : ''))
    .join('/');
}

function normalizeSrc(src: string): string {
  if (!src) return src;
  try {
    // Decode in case a caller already encoded; lookup keys are unencoded.
    const decoded = decodeURIComponent(src);
    return decoded.startsWith('/') ? decoded : `/${decoded}`;
  } catch {
    return src.startsWith('/') ? src : `/${src}`;
  }
}

export type ImgProps = {
  src: string;
  alt: string;
  className?: string;
  /** Above-the-fold: eager load + high fetch priority */
  priority?: boolean;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
  style?: React.CSSProperties;
};

/**
 * Multi-format image with blur-up placeholder from the image manifest.
 * Falls back to a plain <img> when the source is not in the manifest.
 */
const Img: React.FC<ImgProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  onClick,
  style,
}) => {
  const [loaded, setLoaded] = useState(false);
  const key = normalizeSrc(src);
  const entry = manifest[key];

  const loading = priority ? 'eager' : 'lazy';
  const fetchPriority = priority ? 'high' : 'auto';

  if (!entry) {
    return (
        <img
          src={encodePublicPath(key)}
          alt={alt}
          className={className}
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          onClick={onClick}
          style={style}
        />
      );
    }

    const blurUrl = encodePublicPath(entry.blur);
    const wrapperClass = [
      'media-img',
      loaded ? 'media-img--loaded' : 'media-img--loading',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span
        className={wrapperClass}
        style={{
          backgroundColor: entry.dominantColor,
          backgroundImage: loaded ? undefined : `url("${blurUrl}")`,
          ...style,
        }}
      >
        <picture>
          <source srcSet={encodePublicPath(entry.avif)} type="image/avif" />
          <source srcSet={encodePublicPath(entry.webp)} type="image/webp" />
          <img
            src={encodePublicPath(entry.src)}
            alt={alt}
            width={entry.width}
            height={entry.height}
            loading={loading}
            decoding="async"
            fetchPriority={fetchPriority}
            onLoad={() => setLoaded(true)}
            onClick={onClick}
            className="media-img__img"
          />
        </picture>
      </span>
    );
  };

export default Img;
