import React from 'react';
import { useTraffic } from '../TrafficContext';

export function RefCodeCompare({ tokens }) {
  const { getRefTokenAnalytics } = useTraffic();
  if (!tokens?.length || tokens.length < 2) return null;

  const [a, b] = tokens;
  const statsA = getRefTokenAnalytics(a.id, a)?.summary;
  const statsB = getRefTokenAnalytics(b.id, b)?.summary;

  return (
    <div className="ref-code-compare">
      <h4>Compare reference codes</h4>
      <div className="ref-code-compare-grid">
        <div className="ref-code-compare-col">
          <code>{a.id}</code>
          <p>
            {a.source} · {a.medium || '—'}
          </p>
          <ul>
            <li>Clicks: {statsA?.storedClicks ?? 0}</li>
            <li>Visitors: {statsA?.uniqueVisitors ?? 0}</li>
            <li>Sessions: {statsA?.trackedVisits ?? 0}</li>
          </ul>
        </div>
        <div className="ref-code-compare-col">
          <code>{b.id}</code>
          <p>
            {b.source} · {b.medium || '—'}
          </p>
          <ul>
            <li>Clicks: {statsB?.storedClicks ?? 0}</li>
            <li>Visitors: {statsB?.uniqueVisitors ?? 0}</li>
            <li>Sessions: {statsB?.trackedVisits ?? 0}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
