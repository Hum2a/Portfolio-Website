import React from 'react';
import { trafficSignalBadges } from '../../../utils/trafficSignals';

const formatBool = (v) => {
  if (v === null || v === undefined) return 'Unknown';
  return v ? 'Yes' : 'No';
};

export function TrafficSignalBadges({ signals, className = '' }) {
  const badges = trafficSignalBadges(signals);
  if (!badges.length) return null;
  return (
    <span className={`traffic-signal-badges ${className}`.trim()}>
      {badges.map((b) => (
        <span key={b.key} className={`traffic-signal-badge ${b.className}`}>
          {b.label}
        </span>
      ))}
    </span>
  );
}

export function TrafficSignalsPanel({ signals }) {
  if (!signals) {
    return <p className="no-data">No traffic signals recorded (older visits).</p>;
  }

  return (
    <div className="info-grid traffic-signals-panel">
      <div className="info-section">
        <h5>Automation / bot</h5>
        <div className="info-item">
          <span className="info-label">Likely bot:</span>
          <span className="info-value">{formatBool(signals.isLikelyBot)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Bot score:</span>
          <span className="info-value">{signals.botScore ?? 'N/A'} / 100</span>
        </div>
        <div className="info-item">
          <span className="info-label">Reasons:</span>
          <span className="info-value user-agent">
            {signals.botReasons?.length ? signals.botReasons.join(', ') : 'None'}
          </span>
        </div>
      </div>
      <div className="info-section">
        <h5>Network / privacy (IP-based)</h5>
        <div className="info-item">
          <span className="info-label">VPN (ipinfo):</span>
          <span className="info-value">{formatBool(signals.isVpn)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Proxy:</span>
          <span className="info-value">{formatBool(signals.isProxy)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Tor:</span>
          <span className="info-value">{formatBool(signals.isTor)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Hosting / datacenter:</span>
          <span className="info-value">{formatBool(signals.isHosting)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">iCloud relay / similar:</span>
          <span className="info-value">{formatBool(signals.isRelay)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Privacy service:</span>
          <span className="info-value">{signals.privacyService || 'N/A'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Timezone mismatch:</span>
          <span className="info-value">{formatBool(signals.timezoneMismatch)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">VPN hint:</span>
          <span className="info-value">{signals.vpnHint || 'None'}</span>
        </div>
      </div>
      <p className="traffic-signals-note">
        VPN/proxy detection needs ipinfo privacy fields (paid tier) or ISP heuristics. Bot detection
        uses user-agent and automation flags — crawlers without JavaScript may not appear here.
      </p>
    </div>
  );
}
