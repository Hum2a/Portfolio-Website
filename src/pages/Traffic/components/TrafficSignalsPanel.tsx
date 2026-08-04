import React from 'react';
import { trafficSignalBadges } from '../../../utils/trafficSignals';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const formatBool = (v) => {
  if (v === null || v === undefined) return 'Unknown';
  return v ? 'Yes' : 'No';
};

function signalVariant(className = '') {
  if (className.includes('bot') || className.includes('danger') || className.includes('high')) {
    return 'destructive';
  }
  if (className.includes('vpn') || className.includes('warn')) {
    return 'secondary';
  }
  return 'outline';
}

export function TrafficSignalBadges({ signals, className = '' }) {
  const badges = trafficSignalBadges(signals);
  if (!badges.length) return null;
  return (
    <span className={cn('traffic-signal-badges inline-flex flex-wrap gap-1', className)}>
      {badges.map((b) => (
        <Badge key={b.key} variant={signalVariant(b.className)} className="uppercase tracking-wide">
          {b.label}
        </Badge>
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
