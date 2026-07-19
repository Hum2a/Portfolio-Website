import React, { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_NOTIFY_TO_EMAIL,
  RESEND_FROM_EMAIL,
} from '../../../constants/trafficNotify';
import {
  addNotifyRecipient,
  listExtraNotifyRecipients,
  removeNotifyRecipient,
} from '../../../services/trafficNotifyRecipientsService';
import { sendTestNotifyEmail } from '../../../services/trafficNotifyService';

export function NotifyRecipientsSection() {
  const [open, setOpen] = useState(false);
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setExtras(await listExtraNotifyRecipients());
    } catch (e) {
      setError(e?.message || 'Failed to load recipients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const next = await addNotifyRecipient(input);
      setExtras(next);
      setInput('');
    } catch (err) {
      setError(err?.message || 'Failed to add email');
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (email) => {
    setError('');
    setBusy(true);
    try {
      setExtras(await removeNotifyRecipient(email));
    } catch (err) {
      setError(err?.message || 'Failed to remove email');
    } finally {
      setBusy(false);
    }
  };

  const handleSendTest = async () => {
    setError('');
    setTestMessage('');
    setTestSending(true);
    try {
      const result = await sendTestNotifyEmail();
      const to = Array.isArray(result?.to) ? result.to.join(', ') : 'configured recipients';
      setTestMessage(`Test email sent to ${to}. Check the Emails tab for the log.`);
    } catch (err) {
      setError(err?.message || 'Failed to send test email');
    } finally {
      setTestSending(false);
    }
  };

  return (
    <div className="notify-recipients-section">
      <div className="notify-recipients-header" onClick={() => setOpen(!open)}>
        <h2>Email notifications</h2>
        <span className="toggle-icon">{open ? '▼' : '▶'}</span>
      </div>

      {open && (
        <div className="notify-recipients-content">
          <p className="notify-recipients-description">
            Traffic alerts (new visitors and ref-link hits) are sent from{' '}
            <code>{RESEND_FROM_EMAIL}</code>. Add extra addresses below; the default
            recipient cannot be removed.
          </p>

          <div className="notify-recipients-meta">
            <div className="notify-recipients-meta-row">
              <span className="notify-recipients-label">From</span>
              <code>{RESEND_FROM_EMAIL}</code>
            </div>
          </div>

          <ul className="notify-recipients-list">
            <li className="notify-recipients-item default">
              <span>{DEFAULT_NOTIFY_TO_EMAIL}</span>
              <span className="notify-recipients-badge">Default</span>
            </li>
            {loading ? (
              <li className="notify-recipients-item muted">Loading…</li>
            ) : (
              extras.map((email) => (
                <li key={email} className="notify-recipients-item">
                  <span>{email}</span>
                  <button
                    type="button"
                    className="notify-recipients-remove"
                    onClick={() => handleRemove(email)}
                    disabled={busy}
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>

          <form className="notify-recipients-form" onSubmit={handleAdd}>
            <input
              type="email"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add email address"
              disabled={busy || testSending}
              required
            />
            <button type="submit" disabled={busy || testSending || !input.trim()}>
              {busy ? 'Saving…' : 'Add'}
            </button>
          </form>

          <div className="notify-recipients-test">
            <button
              type="button"
              className="notify-recipients-test-btn"
              onClick={handleSendTest}
              disabled={busy || testSending}
            >
              {testSending ? 'Sending test…' : 'Send test email'}
            </button>
            <p className="notify-recipients-test-hint">
              Sends a sample alert to every recipient above (including the default).
            </p>
          </div>

          {testMessage && <p className="notify-recipients-success">{testMessage}</p>}
          {error && <p className="notify-recipients-error">{error}</p>}
        </div>
      )}
    </div>
  );
}
