import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTraffic } from '../TrafficContext';
import {
  COLORS,
  CHART_ACCENT,
  CHART_ACCENT_WARM,
  chartGridProps,
  chartAxisProps,
  chartTooltipStyle,
} from '../constants';
import { getLocationString } from '../utils';
import { EnvBadge } from './EnvBadge';
import { toJsDate } from '../refTokenAnalytics';

function formatSessionDate(timestamp) {
  const d = toJsDate(timestamp);
  if (!d) return '—';
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function RefCodeRowDetails({ token }) {
  const { getRefTokenAnalytics, openVisitorActivity, exportRefTokenCsv } = useTraffic();

  const analytics = useMemo(
    () => (token?.id ? getRefTokenAnalytics(token.id, token) : null),
    [token, getRefTokenAnalytics]
  );

  if (!analytics) return null;

  const { visitsOverTime, visitorsByCountry, visitorsByDevice, visitRows, summary } = analytics;
  const hasChartData = visitsOverTime.length > 0;
  const hasVisitors = visitRows.length > 0;

  return (
    <div className="ref-code-details">
      <div className="ref-code-details-toolbar">
        <button
          type="button"
          className="ref-code-export-btn"
          onClick={() => exportRefTokenCsv(token.id, token)}
          disabled={!hasVisitors}
        >
          Export CSV
        </button>
      </div>
      <div className="ref-code-details-summary">
        <div className="ref-code-stat">
          <span className="ref-code-stat-label">Stored clicks</span>
          <span className="ref-code-stat-value">{summary.storedClicks}</span>
        </div>
        <div className="ref-code-stat">
          <span className="ref-code-stat-label">Unique visitors</span>
          <span className="ref-code-stat-value">{summary.uniqueVisitors}</span>
        </div>
        <div className="ref-code-stat">
          <span className="ref-code-stat-label">Tracked sessions</span>
          <span className="ref-code-stat-value">{summary.trackedVisits}</span>
        </div>
      </div>

      <div className="ref-code-details-charts">
        <div className="ref-code-chart-card">
          <h4>Visits over time</h4>
          {hasChartData ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={visitsOverTime}>
                <CartesianGrid {...chartGridProps} />
                <XAxis dataKey="name" tick={{ ...chartAxisProps.tick, fontSize: 11 }} stroke={chartAxisProps.stroke} />
                <YAxis allowDecimals={false} tick={chartAxisProps.tick} stroke={chartAxisProps.stroke} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="visits" stroke={CHART_ACCENT} fill={CHART_ACCENT} fillOpacity={0.35} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="ref-code-chart-empty">No visit trend data yet for this link.</p>
          )}
        </div>

        <div className="ref-code-chart-card">
          <h4>Visitors by country</h4>
          {visitorsByCountry.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={visitorsByCountry.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    percent > 0.08 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                  }
                  outerRadius={72}
                  dataKey="value"
                >
                  {visitorsByCountry.slice(0, 8).map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="ref-code-chart-empty">No location data yet.</p>
          )}
        </div>

        <div className="ref-code-chart-card">
          <h4>Device types</h4>
          {visitorsByDevice.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={visitorsByDevice}>
                <CartesianGrid {...chartGridProps} />
                <XAxis dataKey="name" tick={{ ...chartAxisProps.tick, fontSize: 11 }} stroke={chartAxisProps.stroke} />
                <YAxis allowDecimals={false} tick={chartAxisProps.tick} stroke={chartAxisProps.stroke} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="value" fill={CHART_ACCENT_WARM} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="ref-code-chart-empty">No device data yet.</p>
          )}
        </div>
      </div>

      <div className="ref-code-visits-table-wrap">
        <h4>Visit history</h4>
        {!hasVisitors ? (
          <p className="ref-code-chart-empty">
            Visits appear here once someone opens this ref link and analytics saves a session.
          </p>
        ) : (
          <table className="ref-code-visits-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Visitor (IP)</th>
                <th>Location</th>
                <th>Device</th>
                <th>Environment</th>
                <th>Referrer</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visitRows.map((row) => (
                <tr key={row.id}>
                  <td className="ref-visit-time">{formatSessionDate(row.startTime)}</td>
                  <td>
                    <code>{row.anonymizedIP}</code>
                  </td>
                  <td>{getLocationString(row.location)}</td>
                  <td>
                    {row.deviceType || '—'}
                    {row.browser ? ` · ${row.browser}` : ''}
                  </td>
                  <td>
                    {row.environment ? <EnvBadge environment={row.environment} /> : "—"}
                  </td>
                  <td className="ref-visit-referrer" title={row.referrer || 'direct'}>
                    {row.referrer === 'direct' ? 'direct' : (row.referrer || '—').slice(0, 48)}
                    {(row.referrer || '').length > 48 ? '…' : ''}
                  </td>
                  <td>
                    {typeof openVisitorActivity === 'function' && (
                      <button
                        type="button"
                        className="ref-code-watch-btn"
                        onClick={() => openVisitorActivity(row.anonymizedIP)}
                        title="Watch this visitor"
                      >
                        Watch
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
