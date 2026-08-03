import React from 'react';
import { cn } from '@/lib/utils';
import './Monogram.css';

export type MonogramProps = {
  size?: number;
  className?: string;
  /** Enable header hover shuffle animation */
  animated?: boolean;
};

/**
 * Stacked H monogram — reads as H, "=", and two stacked layers.
 * Spec: .cursor/REDESIGN-PROMPTS-2026.md §1.2
 */
const Monogram: React.FC<MonogramProps> = ({
  size = 32,
  className,
  animated = false,
}) => {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Humza Butt"
      className={cn('monogram', animated && 'monogram--animated', className)}
    >
      <rect
        className="hb-stem hb-stem-l"
        x="6"
        y="4.667"
        width="4"
        height="22.667"
        rx="1.333"
        fill="currentColor"
      />
      <rect
        className="hb-stem hb-stem-r"
        x="22"
        y="4.667"
        width="4"
        height="22.667"
        rx="1.333"
        fill="currentColor"
      />
      <rect
        className="hb-bar hb-bar-t"
        x="10"
        y="11.333"
        width="12"
        height="3.667"
        rx="1"
        fill="currentColor"
      />
      <rect
        className="hb-bar hb-bar-b"
        x="10"
        y="17"
        width="12"
        height="3.667"
        rx="1"
        fill="currentColor"
      />
    </svg>
  );
};

export default Monogram;
