import React from 'react';
import { useTraffic } from '../TrafficContext';
import { ReferenceCodesList } from './ReferenceCodesList';

export function UrlGeneratorSection() {
  const {
    showUrlGenerator,
    setShowUrlGenerator,
    urlGeneratorData,
    urlGeneratorMode,
    setUrlGeneratorMode,
    handleUrlGeneratorChange,
    applyPreset,
    generatedUrl,
    generatedRefUrl,
    refUrlLoading,
    refUrlError,
    createRefLink,
    copyToClipboard,
    copiedUrl,
    resetUrlGenerator,
  } = useTraffic();

  const isRefMode = urlGeneratorMode === 'ref';
  const displayUrl = isRefMode ? generatedRefUrl : generatedUrl;

  return (
    <div className="url-generator-section">
      <div className="url-generator-header" onClick={() => setShowUrlGenerator(!showUrlGenerator)}>
        <h2>🔗 Campaign URL Generator</h2>
        <span className="toggle-icon">{showUrlGenerator ? '▼' : '▶'}</span>
      </div>

      {showUrlGenerator && (
        <div className="url-generator-content">
          <div className="url-mode-toggle">
            <button
              className={`mode-btn ${isRefMode ? 'active' : ''}`}
              onClick={() => setUrlGeneratorMode('ref')}
              title="Works with PDFs, emails - short URL with token"
            >
              📄 Ref Link (PDF-friendly)
            </button>
            <button
              className={`mode-btn ${!isRefMode ? 'active' : ''}`}
              onClick={() => setUrlGeneratorMode('utm')}
              title="Standard UTM parameters"
            >
              🔗 UTM Link
            </button>
          </div>

          <p className="url-generator-description">
            {isRefMode
              ? 'Ref links use a short token stored in the database. Works reliably from PDFs and persists attribution via cookies for returning visitors.'
              : 'UTM links embed parameters in the URL. Best for direct links (social, email).'}
          </p>

          <div className="url-presets">
            <h3>Quick Presets:</h3>
            <div className="preset-buttons">
              <button className="preset-btn linkedin" onClick={() => applyPreset('linkedin')}>LinkedIn</button>
              <button className="preset-btn discord" onClick={() => applyPreset('discord')}>Discord</button>
              <button className="preset-btn whatsapp" onClick={() => applyPreset('whatsapp')}>WhatsApp</button>
              <button className="preset-btn cv" onClick={() => applyPreset('cv')}>CV/Resume</button>
              <button className="preset-btn github" onClick={() => applyPreset('github')}>GitHub</button>
              <button className="preset-btn twitter" onClick={() => applyPreset('twitter')}>Twitter/X</button>
              <button className="preset-btn email" onClick={() => applyPreset('email')}>Email</button>
              <button className="preset-btn instagram" onClick={() => applyPreset('instagram')}>Instagram</button>
            </div>
          </div>

          <div className="url-generator-form">
            <div className="form-grid">
              <div className="form-field">
                <label>Base URL</label>
                <input
                  type="text"
                  value={urlGeneratorData.baseUrl}
                  onChange={(e) => handleUrlGeneratorChange('baseUrl', e.target.value)}
                  placeholder="https://yoursite.com"
                />
              </div>
              <div className="form-field required-field">
                <label>Source <span className="required-star">*</span></label>
                <input
                  type="text"
                  value={urlGeneratorData.source}
                  onChange={(e) => handleUrlGeneratorChange('source', e.target.value)}
                  placeholder="e.g., linkedin, discord, cv"
                />
                <span className="field-hint">Required - Where the traffic comes from</span>
              </div>
              <div className="form-field">
                <label>Medium</label>
                <input
                  type="text"
                  value={urlGeneratorData.medium}
                  onChange={(e) => handleUrlGeneratorChange('medium', e.target.value)}
                  placeholder="e.g., social, email, pdf"
                />
                <span className="field-hint">The type of link/medium</span>
              </div>
              <div className="form-field">
                <label>Campaign</label>
                <input
                  type="text"
                  value={urlGeneratorData.campaign}
                  onChange={(e) => handleUrlGeneratorChange('campaign', e.target.value)}
                  placeholder="e.g., job-search-2026"
                />
                <span className="field-hint">Campaign name or identifier</span>
              </div>
              {!isRefMode && (
                <>
                  <div className="form-field">
                    <label>Term</label>
                    <input
                      type="text"
                      value={urlGeneratorData.term}
                      onChange={(e) => handleUrlGeneratorChange('term', e.target.value)}
                      placeholder="Optional"
                    />
                    <span className="field-hint">Keywords (optional)</span>
                  </div>
                  <div className="form-field">
                    <label>Content</label>
                    <input
                      type="text"
                      value={urlGeneratorData.content}
                      onChange={(e) => handleUrlGeneratorChange('content', e.target.value)}
                      placeholder="Optional"
                    />
                    <span className="field-hint">Content identifier (optional)</span>
                  </div>
                </>
              )}
            </div>

            {isRefMode ? (
              <div className="ref-link-actions">
                <button
                  className="create-ref-btn"
                  onClick={createRefLink}
                  disabled={refUrlLoading || !urlGeneratorData.source?.trim()}
                >
                  {refUrlLoading ? 'Creating...' : 'Create Ref Link'}
                </button>
                {refUrlError && <span className="ref-url-error">{refUrlError}</span>}
              </div>
            ) : null}

            {isRefMode && (
              <div className="ref-codes-section">
                <ReferenceCodesList />
              </div>
            )}

            {displayUrl && (
              <div className="generated-url-section">
                <h3>Generated URL:</h3>
                <div className="generated-url-display">
                  <input type="text" value={displayUrl} readOnly className="generated-url-input" />
                  <button className="copy-btn" onClick={copyToClipboard}>
                    {copiedUrl ? '✓ Copied!' : '📋 Copy'}
                  </button>
                </div>
                <div className="url-actions">
                  <button className="reset-btn" onClick={resetUrlGenerator}>🔄 Reset</button>
                  <a href={displayUrl} target="_blank" rel="noopener noreferrer" className="test-btn">🔗 Test URL</a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
