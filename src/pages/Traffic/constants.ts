/**
 * Chart colors for Recharts (needs concrete hex/rgb).
 * Aligned with design tokens in globals.css — brand series + derived mixes.
 */
export const CHART_ACCENT = '#4a9eff'; // --accent
export const CHART_ACCENT_WARM = '#f0883e'; // --accent-warm
export const CHART_ACCENT_SOFT = '#7eb8ff'; // lighter accent for secondary series
export const CHART_GRID = 'rgba(255, 255, 255, 0.08)'; // --border-glass
export const CHART_TICK = '#8792a8'; // --text-tertiary
export const CHART_TOOLTIP_BG = 'rgba(14, 20, 48, 0.95)';
export const CHART_TOOLTIP_BORDER = 'rgba(255, 255, 255, 0.14)';

/** Multi-series palette: accent, warm, then color-mix-like derivatives */
export const COLORS = [
  CHART_ACCENT,
  CHART_ACCENT_WARM,
  '#6bb3ff',
  '#f0a66a',
  '#3d8ae6',
  '#10b981',
  '#ef4444',
];

export const chartAxisProps = {
  stroke: CHART_GRID,
  tick: { fill: CHART_TICK, fontSize: 12 },
};

export const chartGridProps = {
  stroke: CHART_GRID,
  strokeDasharray: '3 3',
};

export const chartTooltipStyle = {
  contentStyle: {
    background: CHART_TOOLTIP_BG,
    border: `1px solid ${CHART_TOOLTIP_BORDER}`,
    borderRadius: 8,
    color: '#e8eaf6',
  },
  labelStyle: { color: '#a8b0c4' },
};
