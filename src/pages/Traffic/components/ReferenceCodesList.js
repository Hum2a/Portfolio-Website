import React, { useState } from 'react';
import { useTraffic } from '../TrafficContext';
import { ClicksDrillThrough } from './ClicksDrillThrough';

function formatTokenDate(timestamp) {
  if (!timestamp) return '—';
  let d;
  if (typeof timestamp?.toDate === 'function') d = timestamp.toDate();
  else if (timestamp instanceof Date) d = timestamp;
  else d = new Date(timestamp);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString(undefined, { dateStyle: 'medium' });
}

export function ReferenceCodesList() {
  const {
    trackingTokens,
    trackingTokensLoading,
    trackingTokensError,
    loadTrackingTokens,
    updateTrackingToken,
    deleteTrackingToken,
  } = useTraffic();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ source: '', medium: '', campaign: '', label: '' });
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [drillToken, setDrillToken] = useState(null);
  const [deleteConfirmToken, setDeleteConfirmToken] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const startEdit = (token) => {
    setEditingId(token.id);
    setEditForm({
      source: token.source || '',
      medium: token.medium || '',
      campaign: token.campaign || '',
      label: token.label || '',
    });
    setSaveError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ source: '', medium: '', campaign: '', label: '' });
    setSaveError('');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaveError('');
    setSaving(true);
    try {
      await updateTrackingToken(editingId, {
        source: editForm.source.trim() || null,
        medium: editForm.medium.trim() || null,
        campaign: editForm.campaign.trim() || null,
        label: editForm.label.trim() || null,
      });
      cancelEdit();
    } catch (err) {
      setSaveError(err?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirm = (token) => {
    setDeleteConfirmToken(token);
    setDeleteError('');
  };

  const closeDeleteConfirm = () => {
    if (!deletingId) {
      setDeleteConfirmToken(null);
      setDeleteError('');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmToken) return;
    setDeletingId(deleteConfirmToken.id);
    setDeleteError('');
    try {
      await deleteTrackingToken(deleteConfirmToken.id);
      setDeleteConfirmToken(null);
    } catch (err) {
      setDeleteError(err?.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const copyRefUrl = (token) => {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${base.replace(/\/$/, '')}/?ref=${token.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(token.id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(console.error);
  };

  if (trackingTokensLoading) {
    return (
      <div className="ref-codes-list ref-codes-loading">
        <span>Loading reference codes...</span>
      </div>
    );
  }

  if (trackingTokensError) {
    return (
      <div className="ref-codes-list ref-codes-error">
        <p>{trackingTokensError}</p>
        <button type="button" className="ref-codes-retry-btn" onClick={loadTrackingTokens}>
          Retry
        </button>
      </div>
    );
  }

  if (!trackingTokens?.length) {
    return (
      <div className="ref-codes-list ref-codes-empty">
        <p>No reference codes yet. Create one above.</p>
      </div>
    );
  }

  return (
    <div className="ref-codes-list">
      <div className="ref-codes-header">
        <h3>Active Reference Codes</h3>
        <button type="button" className="ref-codes-refresh-btn" onClick={loadTrackingTokens}>
          ↻ Refresh
        </button>
      </div>
      <div className="ref-codes-table-wrap">
        <table className="ref-codes-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Source</th>
              <th>Medium</th>
              <th>Campaign</th>
              <th>Label</th>
              <th>Clicks</th>
              <th>Created</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trackingTokens.map((token) => (
              <tr key={token.id} className={editingId === token.id ? 'editing' : ''}>
                <td className="token-cell">
                  <code>{token.id}</code>
                </td>
                {editingId === token.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editForm.source}
                        onChange={(e) => setEditForm((f) => ({ ...f, source: e.target.value }))}
                        placeholder="Source"
                        className="ref-codes-edit-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editForm.medium}
                        onChange={(e) => setEditForm((f) => ({ ...f, medium: e.target.value }))}
                        placeholder="Medium"
                        className="ref-codes-edit-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editForm.campaign}
                        onChange={(e) => setEditForm((f) => ({ ...f, campaign: e.target.value }))}
                        placeholder="Campaign"
                        className="ref-codes-edit-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editForm.label}
                        onChange={(e) => setEditForm((f) => ({ ...f, label: e.target.value }))}
                        placeholder="Label"
                        className="ref-codes-edit-input"
                      />
                    </td>
                    <td colSpan="4" className="edit-actions-cell">
                      {saveError && <span className="ref-codes-save-error">{saveError}</span>}
                      <button
                        type="button"
                        className="ref-codes-save-btn"
                        onClick={saveEdit}
                        disabled={saving || !editForm.source?.trim()}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button type="button" className="ref-codes-cancel-btn" onClick={cancelEdit} disabled={saving}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{token.source || '—'}</td>
                    <td>{token.medium || '—'}</td>
                    <td>{token.campaign || '—'}</td>
                    <td>{token.label || '—'}</td>
                    <td className="clicks-cell">
                      <button
                        type="button"
                        className="ref-codes-clicks-btn"
                        onClick={() => setDrillToken(token)}
                        title="View IP addresses and sessions for this link"
                      >
                        {token.clicks ?? 0}
                      </button>
                    </td>
                    <td className="date-cell">{formatTokenDate(token.createdAt)}</td>
                    <td className="link-cell">
                      <button
                        type="button"
                        className="ref-codes-copy-link-btn"
                        onClick={() => copyRefUrl(token)}
                        title="Copy link"
                      >
                        {copiedId === token.id ? '✓ Copied!' : '📋 Copy'}
                      </button>
                    </td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="ref-codes-edit-btn"
                        onClick={() => startEdit(token)}
                        title="Edit attributes"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="ref-codes-delete-btn"
                        onClick={() => openDeleteConfirm(token)}
                        disabled={deletingId === token.id}
                        title="Delete (links will break)"
                      >
                        {deletingId === token.id ? '...' : '🗑️ Delete'}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {drillToken && (
        <ClicksDrillThrough token={drillToken} onClose={() => setDrillToken(null)} />
      )}
      {deleteConfirmToken && (
        <div className="delete-confirm-overlay" onClick={closeDeleteConfirm}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-header">
              <h3>Delete reference code?</h3>
              <button type="button" className="delete-confirm-close" onClick={closeDeleteConfirm} aria-label="Close" disabled={!!deletingId}>×</button>
            </div>
            <div className="delete-confirm-body">
              <p>
                Delete <code>{deleteConfirmToken.id}</code> (source: <strong>{deleteConfirmToken.source}</strong>)?
              </p>
              <p className="delete-confirm-warning">
                Links using this code will stop working.
              </p>
              {deleteError && <p className="delete-confirm-error">{deleteError}</p>}
            </div>
            <div className="delete-confirm-actions">
              <button
                type="button"
                className="delete-confirm-cancel"
                onClick={closeDeleteConfirm}
                disabled={!!deletingId}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-confirm-delete"
                onClick={confirmDelete}
                disabled={!!deletingId}
              >
                {deletingId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
