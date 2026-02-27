import React from 'react';
import { useTraffic } from '../TrafficContext';
import { getLocationString } from '../utils';

function formatSessionDate(timestamp) {
  if (!timestamp) return '—';
  let d;
  if (typeof timestamp?.toDate === 'function') d = timestamp.toDate();
  else if (timestamp instanceof Date) d = timestamp;
  else d = new Date(timestamp);
  return isNaN(d.getTime()) ? '—' : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function ClicksDrillThrough({ token, onClose }) {
  const { getRefTokenDrillThrough, openVisitorActivity } = useTraffic();
  const drillData = getRefTokenDrillThrough(token?.id) || [];

  const totalSessions = drillData.reduce((sum, v) => sum + (v.matchingSessions?.length || 0), 0);

  return (
    <div className="drill-through-overlay" onClick={onClose}>
      <div className="drill-through-modal" onClick={(e) => e.stopPropagation()}>
        <div className="drill-through-header">
          <h3>Clicks drill-through: ref={token?.id}</h3>
          <button type="button" className="drill-through-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="drill-through-summary">
          <span className="drill-summary-label">
            {token?.source && <strong>{token.source}</strong>}
            {token?.medium && ` · ${token.medium}`}
            {token?.campaign && ` · ${token.campaign}`}
          </span>
          <span className="drill-summary-count">
            {drillData.length} visitor{drillData.length !== 1 ? 's' : ''} · {totalSessions} session{totalSessions !== 1 ? 's' : ''}
          </span>
        </div>
        {drillData.length === 0 ? (
          <div className="drill-through-empty">
            <p>
              No session data yet. Drill-through shows visitors whose sessions used this ref link.
              <br />
              <small>If you just created this link or the click was very recent, refresh the Traffic page to load the latest visitor data.</small>
            </p>
          </div>
        ) : (
          <div className="drill-through-list">
            {drillData.map((visitor) => (
              <div key={visitor.id} className="drill-visitor-card">
                <div className="drill-visitor-header">
                  <div className="drill-visitor-ip">
                    <code>{visitor.anonymizedIP || visitor.id}</code>
                    <span className="drill-visitor-env">
                      {visitor.environment && (
                        <span className={`env-badge ${visitor.environment}`}>{visitor.environment}</span>
                      )}
                    </span>
                  </div>
                  <div className="drill-visitor-meta">
                    <span className="drill-location">{getLocationString(visitor.location)}</span>
                    <span className="drill-session-count">
                      {visitor.matchingSessions?.length || 0} session{(visitor.matchingSessions?.length || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {typeof openVisitorActivity === 'function' && (
                    <button
                      type="button"
                      className="drill-watch-btn"
                      onClick={() => {
                        openVisitorActivity(visitor.anonymizedIP || visitor.id);
                        onClose();
                      }}
                      title="Watch this visitor"
                    >
                      👁 Watch
                    </button>
                  )}
                </div>
                <div className="drill-sessions">
                  {(visitor.matchingSessions || []).map((session, idx) => (
                    <div key={session.sessionId || idx} className="drill-session-row">
                      <span className="drill-session-time">{formatSessionDate(session.startTime)}</span>
                      <span className="drill-session-env">
                        {session.environment && (
                          <span className={`env-badge ${session.environment}`}>{session.environment}</span>
                        )}
                      </span>
                      <span className="drill-session-referrer" title={session.referrer || 'direct'}>
                        Ref: {session.referrer === 'direct' ? 'direct' : (session.referrer || '—').slice(0, 40)}
                        {(session.referrer || '').length > 40 ? '…' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
