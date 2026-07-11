import React, { useState } from 'react';
import { FaTrash, FaUserTag, FaRobot } from 'react-icons/fa';
import { useTraffic } from '../TrafficContext';

export function VisitorDataAdmin({ visitor, compact = false }) {
  const {
    ownerTags,
    tagVisitorAsOwner,
    untagVisitorAsOwner,
    deleteVisitorAnalytics,
    deleteAnalyticsLoading,
    getVisitorKey,
    isOwnerVisitor,
  } = useTraffic();

  const key = getVisitorKey(visitor);
  const tagged = isOwnerVisitor(key);
  const tag = ownerTags[key];
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await deleteVisitorAnalytics(key, { skipConfirm: true });
    setConfirmDelete(false);
  };

  if (compact) {
    return (
      <div className="visitor-admin-actions compact">
        {tagged && (
          <span
            className={`owner-tag-badge${tag?.label === 'Claude Cowork' ? ' claude-cowork' : ''}`}
            title={tag?.label === 'Claude Cowork' ? 'Tagged as a Claude Cowork visit' : 'Tagged as your device'}
          >
            {tag?.label || 'Mine'}
          </span>
        )}
        {!tagged && (
          <>
            <button
              type="button"
              className="visitor-admin-btn tag-btn"
              onClick={() => tagVisitorAsOwner(key)}
              title="Tag as your IP"
            >
              <FaUserTag />
            </button>
            <button
              type="button"
              className="visitor-admin-btn tag-btn claude-tag-btn"
              onClick={() => tagVisitorAsOwner(key, 'Claude Cowork')}
              title="Tag as a Claude Cowork visit"
            >
              <FaRobot />
            </button>
          </>
        )}
        <button
          type="button"
          className={`visitor-admin-btn delete-btn ${confirmDelete ? 'confirm' : ''}`}
          onClick={handleDelete}
          disabled={deleteAnalyticsLoading === key}
          title={confirmDelete ? 'Click again to confirm delete' : 'Delete all analytics for this IP'}
        >
          <FaTrash />
          {confirmDelete ? '?' : ''}
        </button>
      </div>
    );
  }

  return (
    <div className="visitor-admin-actions">
      {tagged ? (
        <>
          <span className={`owner-tag-badge${tag?.label === 'Claude Cowork' ? ' claude-cowork' : ''}`}>
            {tag?.label || 'Mine'}
          </span>
          <button type="button" className="visitor-admin-btn" onClick={() => untagVisitorAsOwner(key)}>
            Remove tag
          </button>
        </>
      ) : (
        <>
          <button type="button" className="visitor-admin-btn tag-btn" onClick={() => tagVisitorAsOwner(key)}>
            <FaUserTag /> Tag as mine
          </button>
          <button
            type="button"
            className="visitor-admin-btn tag-btn claude-tag-btn"
            onClick={() => tagVisitorAsOwner(key, 'Claude Cowork')}
          >
            <FaRobot /> Tag as Claude Cowork
          </button>
        </>
      )}
      <button
        type="button"
        className={`visitor-admin-btn delete-btn ${confirmDelete ? 'confirm' : ''}`}
        onClick={handleDelete}
        disabled={deleteAnalyticsLoading === key}
      >
        <FaTrash /> {confirmDelete ? 'Confirm delete all data' : 'Delete all data'}
      </button>
    </div>
  );
}

export function OwnerDevicesPanel() {
  const {
    ownerTags,
    browserAnonymizedIP,
    tagCurrentBrowser,
    deleteVisitorAnalytics,
    deleteAnalyticsLoading,
    untagVisitorAsOwner,
  } = useTraffic();

  const taggedList = Object.values(ownerTags || {});
  const browserTagged = browserAnonymizedIP && ownerTags[browserAnonymizedIP];

  return (
    <div className="owner-devices-panel">
      <div className="filter-header">
        <h3>Your devices</h3>
        <span className="filter-subtitle">Tag IPs you recognize as yours, then delete their analytics</span>
      </div>

      {browserAnonymizedIP ? (
        <p className="owner-browser-ip">
          This browser: <code>{browserAnonymizedIP}</code>
          {browserTagged && <span className="owner-tag-badge">{browserTagged.label || 'Mine'}</span>}
        </p>
      ) : (
        <p className="owner-browser-ip muted">Visit the public site once so this browser gets an analytics ID.</p>
      )}

      <div className="owner-devices-actions">
        <button
          type="button"
          className="visitor-admin-btn tag-btn"
          onClick={tagCurrentBrowser}
          disabled={!browserAnonymizedIP}
        >
          <FaUserTag /> Tag this browser as mine
        </button>
      </div>

      {taggedList.length > 0 && (
        <ul className="owner-tags-list">
          {taggedList.map((t) => (
            <li key={t.id}>
              <code>{t.id}</code>
              <span className={`owner-tag-badge${t.label === 'Claude Cowork' ? ' claude-cowork' : ''}`}>
                {t.label || 'Mine'}
              </span>
              <button
                type="button"
                className="visitor-admin-btn delete-btn"
                disabled={deleteAnalyticsLoading === t.id}
                onClick={() => deleteVisitorAnalytics(t.id)}
              >
                <FaTrash /> Delete all data
              </button>
              <button type="button" className="visitor-admin-btn" onClick={() => untagVisitorAsOwner(t.id)}>
                Untag
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
