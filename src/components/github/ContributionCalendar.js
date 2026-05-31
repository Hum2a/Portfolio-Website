import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { fetchGitHubDayBreakdown } from '../../services/githubService';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LABELS_VISIBLE = { 1: 'Mon', 3: 'Wed', 5: 'Fri' };

const LEVEL_COLORS_DARK = {
  NONE: '#161b22',
  FIRST_QUARTILE: '#0e4429',
  SECOND_QUARTILE: '#006d32',
  THIRD_QUARTILE: '#26a641',
  FOURTH_QUARTILE: '#39d353',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatContributionText(count) {
  if (count === 0) return 'No contributions';
  if (count === 1) return '1 contribution';
  return `${count} contributions`;
}

function formatTooltipDate(dateStr) {
  const date = new Date(`${dateStr}T12:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getCellColor(day) {
  if (!day) return 'var(--github-contrib-empty, #161b22)';
  if (day.color) return day.color;
  return LEVEL_COLORS_DARK[day.contributionLevel] || LEVEL_COLORS_DARK.NONE;
}

function buildMonthLabels(weeks) {
  const labels = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstDay = week.contributionDays?.[0];
    if (!firstDay?.date) return;

    const month = new Date(`${firstDay.date}T12:00:00`).getMonth();
    if (month !== lastMonth) {
      labels.push({ weekIndex, label: MONTHS[month] });
      lastMonth = month;
    }
  });

  return labels;
}

function buildWeekGrid(weeks) {
  return weeks.map((week) => {
    const cells = Array.from({ length: 7 }, () => null);
    for (const day of week.contributionDays || []) {
      const row = typeof day.weekday === 'number' ? day.weekday : null;
      if (row !== null && row >= 0 && row < 7) {
        cells[row] = day;
      }
    }
    return cells;
  });
}

function ContributionTooltip({ day, anchorRect, containerRect, breakdown, breakdownLoading }) {
  if (!day || !anchorRect || !containerRect) return null;

  const centerX = anchorRect.left - containerRect.left + anchorRect.width / 2;
  const top = anchorRect.top - containerRect.top;

  return (
    <div
      className="github-contribution-tooltip"
      role="tooltip"
      style={{
        left: `${centerX}px`,
        top: `${top}px`,
      }}
    >
      <strong>{formatContributionText(day.contributionCount)}</strong>
      <span className="github-contribution-tooltip-date">{formatTooltipDate(day.date)}</span>
      {breakdownLoading && day.contributionCount > 0 && (
        <span className="github-contribution-tooltip-level">Loading breakdown…</span>
      )}
      {breakdown?.length > 0 && (
        <ul className="github-contribution-tooltip-breakdown">
          {breakdown.map((item) => (
            <li key={item.label}>
              <span>{item.label}</span>
              <span>{item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ContributionCalendar({ calendar, loading, error, username }) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const containerRef = useRef(null);
  const [containerRect, setContainerRect] = useState(null);

  const weeks = calendar?.weeks ?? [];
  const weekGrid = useMemo(() => buildWeekGrid(weeks), [weeks]);
  const monthLabels = useMemo(() => buildMonthLabels(weeks), [weeks]);

  const updateContainerRect = useCallback(() => {
    if (containerRef.current) {
      setContainerRect(containerRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    updateContainerRect();
    window.addEventListener('resize', updateContainerRect);
    window.addEventListener('scroll', updateContainerRect, true);
    return () => {
      window.removeEventListener('resize', updateContainerRect);
      window.removeEventListener('scroll', updateContainerRect, true);
    };
  }, [updateContainerRect, calendar]);

  const handleCellEnter = useCallback((day, event) => {
    if (!day) return;
    setHoveredDay(day);
    setAnchorRect(event.currentTarget.getBoundingClientRect());
    updateContainerRect();
  }, [updateContainerRect]);

  const handleCellLeave = useCallback(() => {
    setHoveredDay(null);
    setAnchorRect(null);
    setBreakdown(null);
    setBreakdownLoading(false);
  }, []);

  useEffect(() => {
    if (!hoveredDay?.date || hoveredDay.contributionCount === 0) {
      setBreakdown(null);
      setBreakdownLoading(false);
      return undefined;
    }

    let cancelled = false;
    setBreakdownLoading(true);
    setBreakdown(null);

    fetchGitHubDayBreakdown(hoveredDay.date).then((items) => {
      if (!cancelled) {
        setBreakdown(items);
        setBreakdownLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [hoveredDay]);

  if (loading) {
    return (
      <div className="github-contribution-graph github-contribution-graph--loading">
        <p>Loading contribution activity…</p>
      </div>
    );
  }

  if (error || !calendar) {
    return (
      <div className="github-contribution-graph github-contribution-graph--error">
        <p>{error || 'Unable to load contribution graph.'}</p>
        {username && (
          <img
            src={`https://ghchart.rshah.org/${username}`}
            alt="GitHub contribution chart"
            className="github-contribution-chart-fallback"
          />
        )}
      </div>
    );
  }

  return (
    <div className="github-contribution-graph" ref={containerRef}>
      <p className="github-contribution-summary">
        <strong>{calendar.totalContributions.toLocaleString()}</strong>
        {' '}
        contributions in the last year
      </p>

      <div className="github-contribution-scroll">
        <div className="github-contribution-layout">
          <div
            className="github-contribution-months"
            aria-hidden="true"
            style={{ gridTemplateColumns: `repeat(${weekGrid.length}, var(--github-contrib-cell))` }}
          >
            {monthLabels.map(({ weekIndex, label }) => (
              <span
                key={`${label}-${weekIndex}`}
                className="github-contribution-month"
                style={{ gridColumnStart: weekIndex + 1 }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="github-contribution-day-labels" aria-hidden="true">
            {DAY_LABELS.map((label, row) => (
              <span key={label} className="github-contribution-day-label">
                {DAY_LABELS_VISIBLE[row] || ''}
              </span>
            ))}
          </div>

          <div
            className="github-contribution-grid"
            style={{ gridTemplateColumns: `repeat(${weekGrid.length}, 1fr)` }}
          >
            {weekGrid.map((cells, weekIndex) => (
              <div key={weekIndex} className="github-contribution-week">
                {cells.map((day, rowIndex) => (
                  <div
                    key={`${weekIndex}-${rowIndex}`}
                    className={`github-contribution-cell${day ? '' : ' github-contribution-cell--empty'}`}
                    style={day ? { backgroundColor: getCellColor(day) } : undefined}
                    onMouseEnter={day ? (e) => handleCellEnter(day, e) : undefined}
                    onMouseLeave={day ? handleCellLeave : undefined}
                    onFocus={day ? (e) => handleCellEnter(day, e) : undefined}
                    onBlur={day ? handleCellLeave : undefined}
                    tabIndex={day ? 0 : -1}
                    aria-label={
                      day
                        ? `${formatContributionText(day.contributionCount)} on ${formatTooltipDate(day.date)}`
                        : undefined
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="github-contribution-legend" aria-hidden="true">
        <span>Less</span>
        <div className="github-contribution-legend-cells">
          {Object.values(LEVEL_COLORS_DARK).map((color) => (
            <span key={color} className="github-contribution-legend-cell" style={{ backgroundColor: color }} />
          ))}
        </div>
        <span>More</span>
      </div>

      {hoveredDay && (
        <ContributionTooltip
          day={hoveredDay}
          anchorRect={anchorRect}
          containerRect={containerRect}
          breakdown={breakdown}
          breakdownLoading={breakdownLoading}
        />
      )}
    </div>
  );
}
