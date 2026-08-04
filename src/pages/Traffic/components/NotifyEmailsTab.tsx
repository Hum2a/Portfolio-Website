import React, { useMemo, useState } from 'react';
import { useTraffic } from '../TrafficContext';
import { formatDate } from '../utils';
import { sendTestNotifyEmail } from '../../../services/trafficNotifyService';
import { Button } from '@/components/ui/button';

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === 'function') {
    try {
      return value.toDate();
    } catch {
      return null;
    }
  }
  if (value instanceof Date) return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function sortIndicator(active, direction) {
  if (!active) return '';
  return direction === 'asc' ? ' ↑' : ' ↓';
}

function typeLabel(type) {
  if (type === 'ref_hit') return 'Ref hit';
  if (type === 'test') return 'Test';
  return 'New visitor';
}

export function NotifyEmailsTab() {
  const { emailLogs, loadData } = useTraffic();
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [testSending, setTestSending] = useState(false);
  const [testFeedback, setTestFeedback] = useState(null);

  const setSort = (field) => {
    if (sortBy === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortBy(field);
    setSortDirection(field === 'createdAt' || field === 'sentAt' ? 'desc' : 'asc');
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (emailLogs || []).filter((row) => {
      if (typeFilter !== 'all' && row.type !== typeFilter) return false;
      if (statusFilter !== 'all' && (row.status || 'sending') !== statusFilter) return false;
      if (!q) return true;

      const haystack = [
        row.subject,
        row.type,
        row.status,
        row.from,
        row.resendId,
        row.error,
        ...(Array.isArray(row.recipients) ? row.recipients : []),
        row.summary?.city,
        row.summary?.country,
        row.summary?.region,
        row.summary?.anonymizedIP,
        row.summary?.code,
        row.summary?.visitorId,
        row.summary?.source,
        row.summary?.refToken,
        row.summary?.landingPath,
        row.summary?.browser,
        row.summary?.os,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [emailLogs, typeFilter, statusFilter, query]);

  const sorted = useMemo(() => {
    const dir = sortDirection === 'asc' ? 1 : -1;
    const list = [...filtered];
    list.sort((a, b) => {
      let av;
      let bv;
      switch (sortBy) {
        case 'type':
          av = a.type || '';
          bv = b.type || '';
          return av.localeCompare(bv) * dir;
        case 'status':
          av = a.status || '';
          bv = b.status || '';
          return av.localeCompare(bv) * dir;
        case 'subject':
          av = a.subject || '';
          bv = b.subject || '';
          return av.localeCompare(bv) * dir;
        case 'country':
          av = a.summary?.country || '';
          bv = b.summary?.country || '';
          return av.localeCompare(bv) * dir;
        case 'sentAt': {
          const ad = toDate(a.sentAt)?.getTime() || 0;
          const bd = toDate(b.sentAt)?.getTime() || 0;
          return (ad - bd) * dir;
        }
        case 'createdAt':
        default: {
          const ad = toDate(a.createdAt)?.getTime() || 0;
          const bd = toDate(b.createdAt)?.getTime() || 0;
          return (ad - bd) * dir;
        }
      }
    });
    return list;
  }, [filtered, sortBy, sortDirection]);

  const counts = useMemo(() => {
    const all = emailLogs || [];
    return {
      total: all.length,
      shown: sorted.length,
      sent: all.filter((e) => e.status === 'sent').length,
      failed: all.filter((e) => e.status === 'failed').length,
      newVisitor: all.filter((e) => e.type === 'new_visitor').length,
      refHit: all.filter((e) => e.type === 'ref_hit').length,
      test: all.filter((e) => e.type === 'test').length,
    };
  }, [emailLogs, sorted.length]);

  const handleSendTest = async () => {
    setTestFeedback(null);
    setTestSending(true);
    try {
      const result = await sendTestNotifyEmail();
      const to = Array.isArray(result?.to) ? result.to.join(', ') : 'recipients';
      setTestFeedback({ ok: true, message: `Test email sent to ${to}.` });
      if (typeof loadData === 'function') {
        await loadData();
      }
    } catch (err) {
      setTestFeedback({ ok: false, message: err?.message || 'Failed to send test email' });
    } finally {
      setTestSending(false);
    }
  };

  return (
    <div className="traffic-tab-content">
      <div className="notify-emails-section">
        <div className="notify-emails-header-row">
          <div className="notify-emails-header-main">
            <h3>Sent traffic emails</h3>
            <p className="notify-emails-counts">
              Showing {counts.shown} of {counts.total}
              {' · '}
              {counts.sent} sent
              {' · '}
              {counts.failed} failed
              {' · '}
              {counts.newVisitor} new visitor
              {' · '}
              {counts.refHit} ref hit
              {' · '}
              {counts.test} test
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSendTest}
            disabled={testSending}
          >
            {testSending ? 'Sending test…' : 'Send test email'}
          </Button>
        </div>

        {testFeedback && (
          <p className={`notify-emails-test-feedback ${testFeedback.ok ? 'ok' : 'error'}`}>
            {testFeedback.message}
          </p>
        )}

        <div className="notify-emails-filters">
          <label className="notify-emails-filter">
            <span>Search</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Subject, IP, country, recipient, token…"
            />
          </label>
          <label className="notify-emails-filter">
            <span>Type</span>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All types</option>
              <option value="new_visitor">New visitor</option>
              <option value="ref_hit">Ref hit</option>
              <option value="test">Test</option>
            </select>
          </label>
          <label className="notify-emails-filter">
            <span>Status</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
              <option value="sending">Sending</option>
            </select>
          </label>
        </div>

        <div className="notify-emails-sort-bar">
          <span className="notify-emails-sort-label">Sort by:</span>
          {[
            ['createdAt', 'Created'],
            ['sentAt', 'Sent'],
            ['type', 'Type'],
            ['status', 'Status'],
            ['subject', 'Subject'],
            ['country', 'Country'],
          ].map(([field, label]) => (
            <button
              key={field}
              type="button"
              className={`notify-emails-sort-btn ${sortBy === field ? 'active' : ''}`}
              onClick={() => setSort(field)}
            >
              {label}
              {sortIndicator(sortBy === field, sortDirection)}
            </button>
          ))}
        </div>

        {sorted.length === 0 ? (
          <div className="no-data-message">
            <p>
              {(emailLogs || []).length === 0
                ? 'No traffic emails logged yet. They appear here after a new visitor, ref-link, or test notification is sent.'
                : 'No emails match the current filters.'}
            </p>
          </div>
        ) : (
          <div className="notify-emails-list">
            {sorted.map((row) => {
              const expanded = expandedId === row.id;
              const status = row.status || 'sending';
              const locationBits = [row.summary?.city, row.summary?.region, row.summary?.country]
                .filter(Boolean)
                .join(', ');

              return (
                <article key={row.id} className={`notify-email-card status-${status}`}>
                  <button
                    type="button"
                    className="notify-email-card-header"
                    onClick={() => setExpandedId(expanded ? null : row.id)}
                  >
                    <div className="notify-email-card-main">
                      <div className="notify-email-badges">
                        <span className={`notify-email-type type-${row.type || 'new_visitor'}`}>
                          {typeLabel(row.type)}
                        </span>
                        <span className={`notify-email-status status-${status}`}>{status}</span>
                      </div>
                      <h4 className="notify-email-subject">{row.subject || '(no subject)'}</h4>
                      <div className="notify-email-meta">
                        <span>{formatDate(row.createdAt)}</span>
                        {locationBits && <span>{locationBits}</span>}
                        {row.summary?.anonymizedIP && <span>{row.summary.anonymizedIP}</span>}
                        {row.summary?.source && <span>source: {row.summary.source}</span>}
                      </div>
                    </div>
                    <span className="notify-email-expand">{expanded ? '▼' : '▶'}</span>
                  </button>

                  {expanded && (
                    <div className="notify-email-card-body">
                      <div className="notify-email-fields">
                        <div className="notify-email-field">
                          <label>From</label>
                          <span>{row.from || '—'}</span>
                        </div>
                        <div className="notify-email-field">
                          <label>To</label>
                          <span>
                            {Array.isArray(row.recipients) && row.recipients.length
                              ? row.recipients.join(', ')
                              : '—'}
                          </span>
                        </div>
                        <div className="notify-email-field">
                          <label>Sent at</label>
                          <span>{row.sentAt ? formatDate(row.sentAt) : '—'}</span>
                        </div>
                        <div className="notify-email-field">
                          <label>Resend ID</label>
                          <span className="mono">{row.resendId || '—'}</span>
                        </div>
                        {row.error && (
                          <div className="notify-email-field error">
                            <label>Error</label>
                            <span>{row.error}</span>
                          </div>
                        )}
                        {row.summary?.landingPath && (
                          <div className="notify-email-field">
                            <label>Landing</label>
                            <span className="mono">{row.summary.landingPath}</span>
                          </div>
                        )}
                        {row.summary?.refToken && (
                          <div className="notify-email-field">
                            <label>Ref token</label>
                            <span className="mono">{row.summary.refToken}</span>
                          </div>
                        )}
                        {(row.summary?.browser || row.summary?.os) && (
                          <div className="notify-email-field">
                            <label>Device</label>
                            <span>
                              {[row.summary.browser, row.summary.os, row.summary.deviceType]
                                .filter(Boolean)
                                .join(' · ')}
                            </span>
                          </div>
                        )}
                      </div>

                      <details className="notify-email-payload">
                        <summary>Full payload (JSON)</summary>
                        <pre>{JSON.stringify(row.payload ?? row.summary ?? {}, null, 2)}</pre>
                      </details>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
