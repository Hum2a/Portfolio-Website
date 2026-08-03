import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useTraffic } from '../TrafficContext';
import {
  CHART_ACCENT,
  CHART_ACCENT_SOFT,
  CHART_GRID,
  chartGridProps,
  chartAxisProps,
  chartTooltipStyle,
} from '../constants';
import { Badge } from '@/components/ui/badge';

function momentumClass(v) {
  if (v > 5) return 'trend-pos';
  if (v < -5) return 'trend-neg';
  return 'trend-flat';
}

function TrendLabelBadge({ label }: { label: string }) {
  const variant =
    label === 'hot' || label === 'new'
      ? 'default'
      : label === 'cooling'
        ? 'secondary'
        : 'outline';
  return (
    <Badge variant={variant} className="capitalize">
      {label}
    </Badge>
  );
}

export function TrafficTrendsContent() {
  const { trafficTrends, environmentFilter, filteredStats } = useTraffic();
  const t = trafficTrends;
  if (!t) return null;

  const { summary, pathTrends, eventTrends, dailyPageViews30, topRefLinks, insights, winners, losers, engagementLeaders } = t;

  return (
    <div className="traffic-tab-content traffic-trends">
      <p className="trends-scope-note">
        Trends use <strong>all loaded analytics records</strong> (not the visitor table date filter), filtered by{' '}
        <strong>{environmentFilter === 'all' ? 'all environments' : environmentFilter}</strong>. Week compares last 7 days
        vs previous 7 days.
      </p>

      <div className="trends-kpi-grid">
        <div className="trends-kpi">
          <span className="trends-kpi-label">Views WoW</span>
          <span className={`trends-kpi-value ${momentumClass(summary.viewMomentum)}`}>
            {summary.viewMomentum > 0 ? '+' : ''}
            {summary.viewMomentum}%
          </span>
          <span className="trends-kpi-sub">
            {summary.recentViews} vs {summary.prevViews}
          </span>
        </div>
        <div className="trends-kpi">
          <span className="trends-kpi-label">Visitors WoW</span>
          <span className={`trends-kpi-value ${momentumClass(summary.visitorMomentum)}`}>
            {summary.visitorMomentum > 0 ? '+' : ''}
            {summary.visitorMomentum}%
          </span>
          <span className="trends-kpi-sub">
            {summary.uvRecent} vs {summary.uvPrev} unique IPs
          </span>
        </div>
        <div className="trends-kpi">
          <span className="trends-kpi-label">Enquiries WoW</span>
          <span className={`trends-kpi-value ${momentumClass(summary.enquiryMomentum)}`}>
            {summary.enquiryMomentum > 0 ? '+' : ''}
            {summary.enquiryMomentum}%
          </span>
          <span className="trends-kpi-sub">
            {summary.eqRecent} vs {summary.eqPrev}
          </span>
        </div>
        <div className="trends-kpi">
          <span className="trends-kpi-label">30d depth</span>
          <span className="trends-kpi-value">{summary.viewsPerVisitor}</span>
          <span className="trends-kpi-sub">
            views / visitor; enquiry rate {summary.enquiryRate}%
          </span>
        </div>
      </div>

      <div className="trends-insights">
        <h3>Interpretation</h3>
        <ul>
          {insights.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        {filteredStats?.dataTruncated && (
          <p className="trends-load-warning">
            Loaded dataset may be capped — refresh or use rollup headline stats for fuller totals.
          </p>
        )}
      </div>

      <div className="charts-grid">
        <div className="chart-card full-width">
          <h3>Daily page views (30 days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyPageViews30}>
              <CartesianGrid {...chartGridProps} />
              <XAxis dataKey="name" tick={{ ...chartAxisProps.tick, fontSize: 10 }} stroke={chartAxisProps.stroke} />
              <YAxis allowDecimals={false} tick={chartAxisProps.tick} stroke={chartAxisProps.stroke} />
              <Tooltip {...chartTooltipStyle} />
              <ReferenceLine y={0} stroke={CHART_GRID} />
              <Area type="monotone" dataKey="views" stroke={CHART_ACCENT} fill={CHART_ACCENT} fillOpacity={0.25} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="trends-split">
        <div className="chart-card trends-table-card">
          <h3>Route popularity and momentum</h3>
          <p className="trends-table-hint">Hot / new / cooling: last 7 days vs prior 7 days.</p>
          <div className="trends-table-wrap">
            <table className="trends-table">
              <thead>
                <tr>
                  <th>Path</th>
                  <th>7d views</th>
                  <th>Prev 7d</th>
                  <th>Change</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {pathTrends.slice(0, 25).map((row) => (
                  <tr key={row.path}>
                    <td className="trends-path">{row.pathLabel || row.path}</td>
                    <td>{row.recent}</td>
                    <td>{row.previous}</td>
                    <td className={momentumClass(row.deltaPct)}>
                      {row.deltaPct > 0 ? '+' : ''}
                      {row.deltaPct}%
                    </td>
                    <td>
                      <TrendLabelBadge label={row.label} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-card trends-side">
          <h3>Rising vs cooling</h3>
          <h4 className="trends-subh">Momentum winners</h4>
          <ul className="trends-mini-list">
            {winners.length ? winners.map((w) => <li key={w.path}>{w.pathLabel || w.path}</li>) : <li>None flagged</li>}
          </ul>
          <h4 className="trends-subh">Cooling (was steady)</h4>
          <ul className="trends-mini-list">
            {losers.length ? losers.map((w) => <li key={w.path}>{w.pathLabel || w.path}</li>) : <li>None flagged</li>}
          </ul>

          <h3 className="trends-mt">Event categories</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={eventTrends.slice(0, 10)}>
              <CartesianGrid {...chartGridProps} />
              <XAxis dataKey="name" tick={{ ...chartAxisProps.tick, fontSize: 10 }} stroke={chartAxisProps.stroke} />
              <YAxis allowDecimals={false} tick={chartAxisProps.tick} stroke={chartAxisProps.stroke} />
              <Tooltip {...chartTooltipStyle} />
              <Legend />
              <Bar dataKey="recent" name="Last 7d" fill={CHART_ACCENT} />
              <Bar dataKey="previous" name="Prior 7d" fill={CHART_ACCENT_SOFT} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3>Engagement and traffic</h3>
        <p className="trends-table-hint">Top routes by 7-day views with average time on page (recent week).</p>
        <div className="trends-table-wrap">
          <table className="trends-table">
            <thead>
              <tr>
                <th>Path</th>
                <th>7d views</th>
                <th>Avg time</th>
              </tr>
            </thead>
            <tbody>
              {engagementLeaders.slice(0, 15).map((row) => (
                <tr key={row.path}>
                  <td className="trends-path">{row.pathLabel || row.path}</td>
                  <td>{row.recent}</td>
                  <td>{row.avgTimeRecent != null ? `${Math.round(row.avgTimeRecent)}s` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {topRefLinks.length > 0 && (
        <div className="chart-card">
          <h3>Reference link performance</h3>
          <div className="ref-trends-list">
            {topRefLinks.map((r) => (
              <div key={r.id} className="ref-trend-chip">
                <code>{r.id}</code>
                <span>{r.label}</span>
                <strong>{r.clicks} clicks</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
