import React, { useMemo, useState } from 'react';
import { FaTrash, FaUserTag, FaRobot, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useTraffic } from '../TrafficContext';
import {
  OWNER_TAG_CLAUDE_COWORK,
  OWNER_TAG_MINE,
  isClaudeCoworkLabel,
} from '../../../constants/ownerTags';

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
            className={`owner-tag-badge${isClaudeCoworkLabel(tag?.label) ? ' claude-cowork' : ''}`}
            title={
              isClaudeCoworkLabel(tag?.label)
                ? 'Tagged as a Claude Cowork visit'
                : 'Tagged as your device'
            }
          >
            {tag?.label || OWNER_TAG_MINE}
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
              onClick={() => tagVisitorAsOwner(key, OWNER_TAG_CLAUDE_COWORK)}
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
          <span className={`owner-tag-badge${isClaudeCoworkLabel(tag?.label) ? ' claude-cowork' : ''}`}>
            {tag?.label || OWNER_TAG_MINE}
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
            onClick={() => tagVisitorAsOwner(key, OWNER_TAG_CLAUDE_COWORK)}
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

function OwnerTagGroup({ label, items, deleteVisitorAnalytics, deleteAnalyticsLoading, untagVisitorAsOwner }) {
  const [expanded, setExpanded] = useState(false);
  const isClaude = isClaudeCoworkLabel(label);

  return (
    <div className="owner-tag-group">
      <button
        type="button"
        className={`owner-tag-group-toggle${isClaude ? ' claude-cowork' : ''}`}
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <span className="owner-tag-group-toggle-main">
          {expanded ? <FaChevronDown /> : <FaChevronRight />}
          <span className={`owner-tag-badge${isClaude ? ' claude-cowork' : ''}`}>{label}</span>
          <span className="owner-tag-group-count">{items.length}</span>
        </span>
        <span className="owner-tag-group-hint">{expanded ? 'Hide' : 'Show'}</span>
      </button>

      {expanded && (
        <ul className="owner-tags-list">
          {items.map((t) => (
            <li key={t.id}>
              <code>{t.id}</code>
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

export function OwnerDevicesPanel() {
  const {
    ownerTags,
    browserAnonymizedIP,
    tagCurrentBrowser,
    deleteVisitorAnalytics,
    deleteAnalyticsLoading,
    untagVisitorAsOwner,
  } = useTraffic();

  const taggedGroups = useMemo(() => {
    const map = new Map();
    Object.values(ownerTags || {}).forEach((t) => {
      const label = t.label || OWNER_TAG_MINE;
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(t);
    });

    // Prefer Claude Cowork first (usually the large group), then Mine, then others
    const order = [OWNER_TAG_CLAUDE_COWORK, OWNER_TAG_MINE];
    return [...map.entries()].sort(([a], [b]) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [ownerTags]);

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
          {browserTagged && (
            <span
              className={`owner-tag-badge${isClaudeCoworkLabel(browserTagged.label) ? ' claude-cowork' : ''}`}
            >
              {browserTagged.label || OWNER_TAG_MINE}
            </span>
          )}
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

      {taggedGroups.length > 0 && (
        <div className="owner-tag-groups">
          {taggedGroups.map(([label, items]) => (
            <OwnerTagGroup
              key={label}
              label={label}
              items={items}
              deleteVisitorAnalytics={deleteVisitorAnalytics}
              deleteAnalyticsLoading={deleteAnalyticsLoading}
              untagVisitorAsOwner={untagVisitorAsOwner}
            />
          ))}
        </div>
      )}
    </div>
  );
}
