import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FaMapMarkerAlt, FaChevronDown, FaChevronUp, FaGlobe, FaEye } from 'react-icons/fa';
import { useTraffic } from './TrafficContext';
import { COLORS } from './constants';
import { getLocationString, hasValidCoordinates, getGoogleMapsUrl } from './utils';

export function TrafficTabContent() {
  const {
    activeTab,
    sortedVisitors,
    visitorSortBy,
    visitorSortDirection,
    setVisitorSort,
    filteredPageViews,
    sortedPageViews,
    pageViewSortBy,
    pageViewSortDirection,
    setPageViewSort,
    filteredEvents,
    sortedEvents,
    eventSortBy,
    eventSortDirection,
    setEventSort,
    filteredPageTimes,
    sortedPageTimes,
    pageTimeSortBy,
    pageTimeSortDirection,
    setPageTimeSort,
    filteredMediaClicks,
    sortedMediaClicks,
    mediaClickSortBy,
    mediaClickSortDirection,
    setMediaClickSort,
    enquiries,
    sortedEnquiries,
    enquirySortBy,
    enquirySortDirection,
    setEnquirySort,
    visitorsByCountry,
    visitorsByDevice,
    visitsOverTime,
    pageViewsOverTime,
    pageViewsByPath,
    eventsByCategory,
    averageTimeByPath,
    pageTimeSummary,
    timeSpentOverTime,
    mediaClicksByType,
    mediaClicksByProject,
    mediaClicksOverTime,
    topMediaClicks,
    visitorsForActivitySelector,
    visitorActivityTimeline,
    expandedVisitors,
    visitorActiveTabs,
    selectedLocation,
    setSelectedLocation,
    environmentFilter,
    selectedVisitorAnonymizedIP,
    setSelectedVisitorAnonymizedIP,
    formatDate,
    formatDuration,
    toggleVisitorExpansion,
    setVisitorTab,
    getVisitorTab,
    openVisitorActivity,
  } = useTraffic();

  return (
    <>
      {activeTab === 'visitors' && (
        <div className="traffic-tab-content">
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Visitors by Country</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={visitorsByCountry.slice(0, 10)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {visitorsByCountry.slice(0, 10).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>Visitors by Device Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={visitorsByDevice}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card full-width">
              <h3>Visits Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={visitsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="value" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {selectedLocation && (
            <div className="map-container">
              <h3>Location Map - {getLocationString(selectedLocation)}</h3>
              <div className="map-iframe-container">
                {hasValidCoordinates(selectedLocation) ? (
                  <iframe
                    title="Location Map"
                    width="100%"
                    height="400"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${selectedLocation.coordinates[0]},${selectedLocation.coordinates[1]}&output=embed`}
                    allowFullScreen
                  />
                ) : (
                  <iframe
                    title="Location Map"
                    width="100%"
                    height="400"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(getLocationString(selectedLocation))}&output=embed`}
                    allowFullScreen
                  />
                )}
              </div>
              <div className="map-actions">
                <a
                  href={getGoogleMapsUrl(selectedLocation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link-btn"
                >
                  <FaGlobe /> Open in Google Maps
                </a>
                <button className="close-map-btn" onClick={() => setSelectedLocation(null)}>
                  Close Map
                </button>
              </div>
            </div>
          )}

          <div className="traffic-table-container">
            <table className="traffic-table">
              <thead>
                <tr>
                  <th></th>
                  <th
                    className={`sortable ${visitorSortBy === 'ip' ? 'active ' + visitorSortDirection : ''}`}
                    onClick={() => setVisitorSort('ip')}
                    title="Sort by IP"
                  >
                    IP Address {visitorSortBy === 'ip' && (visitorSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${visitorSortBy === 'visits' ? 'active ' + visitorSortDirection : ''}`}
                    onClick={() => setVisitorSort('visits')}
                    title="Sort by visit count"
                  >
                    Visits {visitorSortBy === 'visits' && (visitorSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${visitorSortBy === 'deviceType' ? 'active ' + visitorSortDirection : ''}`}
                    onClick={() => setVisitorSort('deviceType')}
                    title="Sort by device type"
                  >
                    Device Type {visitorSortBy === 'deviceType' && (visitorSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${visitorSortBy === 'browser' ? 'active ' + visitorSortDirection : ''}`}
                    onClick={() => setVisitorSort('browser')}
                    title="Sort by browser"
                  >
                    Browser {visitorSortBy === 'browser' && (visitorSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${visitorSortBy === 'os' ? 'active ' + visitorSortDirection : ''}`}
                    onClick={() => setVisitorSort('os')}
                    title="Sort by OS"
                  >
                    OS {visitorSortBy === 'os' && (visitorSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${visitorSortBy === 'location' ? 'active ' + visitorSortDirection : ''}`}
                    onClick={() => setVisitorSort('location')}
                    title="Sort by location"
                  >
                    Location {visitorSortBy === 'location' && (visitorSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${visitorSortBy === 'firstVisit' ? 'active ' + visitorSortDirection : ''}`}
                    onClick={() => setVisitorSort('firstVisit')}
                    title="Sort by first visit"
                  >
                    First Visit {visitorSortBy === 'firstVisit' && (visitorSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${visitorSortBy === 'lastVisit' ? 'active ' + visitorSortDirection : ''}`}
                    onClick={() => setVisitorSort('lastVisit')}
                    title="Sort by last visit"
                  >
                    Last Visit {visitorSortBy === 'lastVisit' && (visitorSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedVisitors.map((visitor) => (
                  <React.Fragment key={visitor.id}>
                    <tr>
                      <td>
                        <button
                          className="expand-btn"
                          onClick={() => toggleVisitorExpansion(visitor.id)}
                        >
                          {expandedVisitors.has(visitor.id) ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                      </td>
                      <td>
                        <div className="ip-cell">
                          {visitor.anonymizedIP || visitor.id}
                          <span className={`env-badge ${visitor.environment === 'localhost' ? 'localhost' : 'production'}`}>
                            {visitor.environment || 'unknown'}
                          </span>
                        </div>
                      </td>
                      <td>{visitor.visits || 0}</td>
                      <td>{visitor.deviceInfo?.deviceType || 'N/A'}</td>
                      <td>{visitor.deviceInfo?.browser || 'N/A'}</td>
                      <td>{visitor.deviceInfo?.os || 'N/A'}</td>
                      <td>{getLocationString(visitor.location)}</td>
                      <td>{formatDate(visitor.firstVisit)}</td>
                      <td>{formatDate(visitor.lastVisit)}</td>
                      <td>
                        <div className="visitor-actions-cell">
                          <button
                            className="watch-btn"
                            onClick={() => openVisitorActivity(visitor)}
                            title="Watch this visitor's activity"
                          >
                            <FaEye /> Watch
                          </button>
                          {hasValidCoordinates(visitor.location) && (
                            <button
                              className="map-btn"
                              onClick={() => setSelectedLocation(visitor.location)}
                              title="View on map"
                            >
                              <FaMapMarkerAlt />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedVisitors.has(visitor.id) && (
                      <tr className="expanded-row">
                        <td colSpan="10">
                          <div className="expanded-content">
                            <div className="expanded-tabs">
                              <button
                                className={`expanded-tab ${getVisitorTab(visitor.id) === 'visits' ? 'active' : ''}`}
                                onClick={() => setVisitorTab(visitor.id, 'visits')}
                              >
                                Visit History
                              </button>
                              <button
                                className={`expanded-tab ${getVisitorTab(visitor.id) === 'device' ? 'active' : ''}`}
                                onClick={() => setVisitorTab(visitor.id, 'device')}
                              >
                                Device Info
                              </button>
                              <button
                                className={`expanded-tab ${getVisitorTab(visitor.id) === 'location' ? 'active' : ''}`}
                                onClick={() => setVisitorTab(visitor.id, 'location')}
                              >
                                Location
                              </button>
                              <button
                                className={`expanded-tab ${getVisitorTab(visitor.id) === 'summary' ? 'active' : ''}`}
                                onClick={() => setVisitorTab(visitor.id, 'summary')}
                              >
                                Summary
                              </button>
                            </div>

                            <div className={`expanded-panel panel-visits ${getVisitorTab(visitor.id) === 'visits' ? 'active' : ''}`}>
                              <h4>Visit History ({visitor.sessions && Array.isArray(visitor.sessions) ? visitor.sessions.length : 0} sessions)</h4>
                              {visitor.sessions && Array.isArray(visitor.sessions) && visitor.sessions.length > 0 ? (
                                <div className="sessions-container">
                                  {visitor.sessions
                                    .filter((session) => {
                                      if (environmentFilter === 'all') return true;
                                      return (session.environment || visitor.environment) === environmentFilter;
                                    })
                                    .map((session, idx) => (
                                      <div key={idx} className="session-card">
                                        <div className="session-header">
                                          <span className="session-number">Session #{idx + 1}</span>
                                          <span className="session-id">{session.sessionId || 'N/A'}</span>
                                          {(session.environment || visitor.environment) && (
                                            <span className={`env-badge ${(session.environment || visitor.environment) === 'localhost' ? 'localhost' : 'production'}`}>
                                              {session.environment || visitor.environment}
                                            </span>
                                          )}
                                        </div>
                                        <div className="session-details">
                                          <div className="detail-row">
                                            <span className="detail-label">Start Time:</span>
                                            <span className="detail-value">{formatDate(session.startTime)}</span>
                                          </div>
                                          <div className="detail-row">
                                            <span className="detail-label">Referrer:</span>
                                            <span className="detail-value">{session.referrer || 'Direct'}</span>
                                          </div>
                                          {session.campaign && (
                                            <>
                                              <div className="detail-row campaign-row">
                                                <span className="detail-label">Campaign Source:</span>
                                                <span className="detail-value campaign-badge source-badge">{session.campaign.source}</span>
                                              </div>
                                              {session.campaign.medium && (
                                                <div className="detail-row">
                                                  <span className="detail-label">Medium:</span>
                                                  <span className="detail-value">{session.campaign.medium}</span>
                                                </div>
                                              )}
                                              {session.campaign.campaign && (
                                                <div className="detail-row">
                                                  <span className="detail-label">Campaign:</span>
                                                  <span className="detail-value">{session.campaign.campaign}</span>
                                                </div>
                                              )}
                                              {session.campaign.landingPage && (
                                                <div className="detail-row">
                                                  <span className="detail-label">Landing Page:</span>
                                                  <span className="detail-value landing-page">{session.campaign.landingPage}</span>
                                                </div>
                                              )}
                                            </>
                                          )}
                                          {(session.environment || visitor.environment) && (
                                            <div className="detail-row">
                                              <span className="detail-label">Environment:</span>
                                              <span className={`detail-value env-badge ${(session.environment || visitor.environment) === 'localhost' ? 'localhost' : 'production'}`}>
                                                {session.environment || visitor.environment}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <p className="no-data">No visit history available</p>
                              )}
                            </div>

                            <div className={`expanded-panel panel-device ${getVisitorTab(visitor.id) === 'device' ? 'active' : ''}`}>
                              <h4>Device Information</h4>
                              {visitor.deviceInfo ? (
                                <div className="info-grid">
                                  <div className="info-section">
                                    <h5>Browser</h5>
                                    <div className="info-item">
                                      <span className="info-label">Browser:</span>
                                      <span className="info-value">{visitor.deviceInfo.browser || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">Browser Version:</span>
                                      <span className="info-value">{visitor.deviceInfo.browserVersion || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">User Agent:</span>
                                      <span className="info-value user-agent">{visitor.deviceInfo.userAgent || 'N/A'}</span>
                                    </div>
                                  </div>
                                  <div className="info-section">
                                    <h5>Operating System</h5>
                                    <div className="info-item">
                                      <span className="info-label">OS:</span>
                                      <span className="info-value">{visitor.deviceInfo.os || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">OS Version:</span>
                                      <span className="info-value">{visitor.deviceInfo.osVersion || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">Device Type:</span>
                                      <span className="info-value">{visitor.deviceInfo.deviceType || 'N/A'}</span>
                                    </div>
                                  </div>
                                  <div className="info-section">
                                    <h5>Display</h5>
                                    <div className="info-item">
                                      <span className="info-label">Screen Size:</span>
                                      <span className="info-value">{visitor.deviceInfo.screenSize || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">Screen Resolution:</span>
                                      <span className="info-value">{visitor.deviceInfo.screenResolution || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">Color Depth:</span>
                                      <span className="info-value">{visitor.deviceInfo.colorDepth || 'N/A'} bits</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">Pixel Ratio:</span>
                                      <span className="info-value">{visitor.deviceInfo.pixelRatio || 'N/A'}</span>
                                    </div>
                                  </div>
                                  <div className="info-section">
                                    <h5>Network & Settings</h5>
                                    <div className="info-item">
                                      <span className="info-label">Connection Type:</span>
                                      <span className="info-value">{visitor.deviceInfo.connectionType || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">Effective Connection:</span>
                                      <span className="info-value">{visitor.deviceInfo.effectiveConnectionType || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">Language:</span>
                                      <span className="info-value">{visitor.deviceInfo.language || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">Timezone:</span>
                                      <span className="info-value">{visitor.deviceInfo.timezone || 'N/A'}</span>
                                    </div>
                                  </div>
                                  <div className="info-section">
                                    <h5>Privacy & Status</h5>
                                    <div className="info-item">
                                      <span className="info-label">Cookies Enabled:</span>
                                      <span className="info-value">{visitor.deviceInfo.cookiesEnabled ? 'Yes' : 'No'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">Do Not Track:</span>
                                      <span className="info-value">{visitor.deviceInfo.doNotTrack || '0'}</span>
                                    </div>
                                    <div className="info-item">
                                      <span className="info-label">Online Status:</span>
                                      <span className="info-value">{visitor.deviceInfo.online ? 'Online' : 'Offline'}</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p className="no-data">No device information available</p>
                              )}
                            </div>

                            <div className={`expanded-panel panel-location ${getVisitorTab(visitor.id) === 'location' ? 'active' : ''}`}>
                              <h4>Location Information</h4>
                              {visitor.location ? (
                                <div className="location-grid">
                                  <div className="location-card">
                                    <h5>Geographic Location</h5>
                                    <div className="location-detail-item">
                                      <span className="location-label">City:</span>
                                      <span className="location-value">{visitor.location.city || 'Unknown'}</span>
                                    </div>
                                    <div className="location-detail-item">
                                      <span className="location-label">Region:</span>
                                      <span className="location-value">{visitor.location.region || 'Unknown'}</span>
                                    </div>
                                    <div className="location-detail-item">
                                      <span className="location-label">Country:</span>
                                      <span className="location-value">{visitor.location.country || 'Unknown'}</span>
                                    </div>
                                    <div className="location-detail-item">
                                      <span className="location-label">Timezone:</span>
                                      <span className="location-value">{visitor.location.timezone || 'N/A'}</span>
                                    </div>
                                    {hasValidCoordinates(visitor.location) ? (
                                      <div className="location-detail-item">
                                        <span className="location-label">Coordinates:</span>
                                        <span className="location-value">
                                          {visitor.location.coordinates[0]}, {visitor.location.coordinates[1]}
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="location-detail-item">
                                        <span className="location-label">Coordinates:</span>
                                        <span className="location-value unavailable">Not available</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="location-card">
                                    <h5>Network Information</h5>
                                    <div className="location-detail-item">
                                      <span className="location-label">ISP:</span>
                                      <span className="location-value">{visitor.location.isp || 'Unknown'}</span>
                                    </div>
                                  </div>
                                  {hasValidCoordinates(visitor.location) && (
                                    <div className="location-card map-action-card">
                                      <h5>Map Actions</h5>
                                      <button className="map-action-btn" onClick={() => setSelectedLocation(visitor.location)}>
                                        <FaMapMarkerAlt /> View on Embedded Map
                                      </button>
                                      <a
                                        href={getGoogleMapsUrl(visitor.location)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="map-action-link"
                                      >
                                        <FaGlobe /> Open in Google Maps
                                      </a>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="no-data">No location information available</p>
                              )}
                            </div>

                            <div className={`expanded-panel panel-summary ${getVisitorTab(visitor.id) === 'summary' ? 'active' : ''}`}>
                              <h4>Visitor Summary</h4>
                              <div className="summary-grid">
                                <div className="summary-card">
                                  <h5>Identification</h5>
                                  <div className="summary-item">
                                    <span className="summary-label">Visitor ID:</span>
                                    <span className="summary-value">{visitor.visitorId || 'N/A'}</span>
                                  </div>
                                  <div className="summary-item">
                                    <span className="summary-label">IP Address:</span>
                                    <span className="summary-value">{visitor.code || visitor.anonymizedIP || 'N/A'}</span>
                                  </div>
                                  <div className="summary-item">
                                    <span className="summary-label">Anonymized IP:</span>
                                    <span className="summary-value">{visitor.anonymizedIP || visitor.id}</span>
                                  </div>
                                  <div className="summary-item">
                                    <span className="summary-label">Environment:</span>
                                    <span className={`summary-value env-badge ${visitor.environment === 'localhost' ? 'localhost' : 'production'}`}>
                                      {visitor.environment || 'unknown'}
                                    </span>
                                  </div>
                                  <div className="summary-item">
                                    <span className="summary-label">Total Visits:</span>
                                    <span className="summary-value">{visitor.visits || 0}</span>
                                  </div>
                                </div>
                                <div className="summary-card">
                                  <h5>Visit Timeline</h5>
                                  <div className="summary-item">
                                    <span className="summary-label">First Visit:</span>
                                    <span className="summary-value">{formatDate(visitor.firstVisit)}</span>
                                  </div>
                                  <div className="summary-item">
                                    <span className="summary-label">Last Visit:</span>
                                    <span className="summary-value">{formatDate(visitor.lastVisit)}</span>
                                  </div>
                                  <div className="summary-item">
                                    <span className="summary-label">Sessions:</span>
                                    <span className="summary-value">
                                      {visitor.sessions && Array.isArray(visitor.sessions) ? visitor.sessions.length : 0}
                                    </span>
                                  </div>
                                </div>
                                <div className="summary-card">
                                  <h5>Quick Stats</h5>
                                  <div className="summary-item">
                                    <span className="summary-label">Device:</span>
                                    <span className="summary-value">{visitor.deviceInfo?.deviceType || 'N/A'}</span>
                                  </div>
                                  <div className="summary-item">
                                    <span className="summary-label">Browser:</span>
                                    <span className="summary-value">{visitor.deviceInfo?.browser || 'N/A'}</span>
                                  </div>
                                  <div className="summary-item">
                                    <span className="summary-label">OS:</span>
                                    <span className="summary-value">{visitor.deviceInfo?.os || 'N/A'}</span>
                                  </div>
                                  <div className="summary-item">
                                    <span className="summary-label">Location:</span>
                                    <span className="summary-value">{getLocationString(visitor.location)}</span>
                                  </div>
                                </div>
                              </div>
                              <details className="raw-data-details">
                                <summary>View Raw JSON Data</summary>
                                <pre className="raw-json">{JSON.stringify(visitor, null, 2)}</pre>
                              </details>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pageviews' && (
        <div className="traffic-tab-content">
          <div className="charts-grid">
            <div className="chart-card full-width">
              <h3>Page Views Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pageViewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#764ba2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card full-width">
              <h3>Top 10 Pages</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pageViewsByPath} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={200} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#f093fb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="traffic-table-container">
            <table className="traffic-table">
              <thead>
                <tr>
                  <th
                    className={`sortable ${pageViewSortBy === 'path' ? 'active ' + pageViewSortDirection : ''}`}
                    onClick={() => setPageViewSort('path')}
                    title="Sort by path"
                  >
                    Path {pageViewSortBy === 'path' && (pageViewSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${pageViewSortBy === 'title' ? 'active ' + pageViewSortDirection : ''}`}
                    onClick={() => setPageViewSort('title')}
                    title="Sort by title"
                  >
                    Title {pageViewSortBy === 'title' && (pageViewSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${pageViewSortBy === 'referrer' ? 'active ' + pageViewSortDirection : ''}`}
                    onClick={() => setPageViewSort('referrer')}
                    title="Sort by referrer"
                  >
                    Referrer {pageViewSortBy === 'referrer' && (pageViewSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${pageViewSortBy === 'timestamp' ? 'active ' + pageViewSortDirection : ''}`}
                    onClick={() => setPageViewSort('timestamp')}
                    title="Sort by timestamp"
                  >
                    Timestamp {pageViewSortBy === 'timestamp' && (pageViewSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPageViews.map((pageView) => (
                  <tr key={pageView.id}>
                    <td>
                      <div className="path-cell">
                        {pageView.path || 'N/A'}
                        <span className={`env-badge ${pageView.environment === 'localhost' ? 'localhost' : 'production'}`}>
                          {pageView.environment || 'unknown'}
                        </span>
                      </div>
                    </td>
                    <td>{pageView.title || 'N/A'}</td>
                    <td>{pageView.referrer || 'Direct'}</td>
                    <td>{formatDate(pageView.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="traffic-tab-content">
          <div className="charts-grid">
            <div className="chart-card full-width">
              <h3>Events by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#4facfe" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="traffic-table-container">
            <table className="traffic-table">
              <thead>
                <tr>
                  <th
                    className={`sortable ${eventSortBy === 'category' ? 'active ' + eventSortDirection : ''}`}
                    onClick={() => setEventSort('category')}
                    title="Sort by category"
                  >
                    Category {eventSortBy === 'category' && (eventSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${eventSortBy === 'action' ? 'active ' + eventSortDirection : ''}`}
                    onClick={() => setEventSort('action')}
                    title="Sort by action"
                  >
                    Action {eventSortBy === 'action' && (eventSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${eventSortBy === 'label' ? 'active ' + eventSortDirection : ''}`}
                    onClick={() => setEventSort('label')}
                    title="Sort by label"
                  >
                    Label {eventSortBy === 'label' && (eventSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${eventSortBy === 'path' ? 'active ' + eventSortDirection : ''}`}
                    onClick={() => setEventSort('path')}
                    title="Sort by path"
                  >
                    Path {eventSortBy === 'path' && (eventSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${eventSortBy === 'timestamp' ? 'active ' + eventSortDirection : ''}`}
                    onClick={() => setEventSort('timestamp')}
                    title="Sort by timestamp"
                  >
                    Timestamp {eventSortBy === 'timestamp' && (eventSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedEvents.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <div className="category-cell">
                        {event.category || 'N/A'}
                        <span className={`env-badge ${event.environment === 'localhost' ? 'localhost' : 'production'}`}>
                          {event.environment || 'unknown'}
                        </span>
                      </div>
                    </td>
                    <td>{event.action || 'N/A'}</td>
                    <td>{event.label || 'N/A'}</td>
                    <td>{event.path || 'N/A'}</td>
                    <td>{formatDate(event.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pagetimes' && (
        <div className="traffic-tab-content time-on-page-tab">
          <p className="time-on-page-intro">
            Time users spent on each page (recorded when they leave or navigate away). Each row is one visit to a page.
          </p>
          <div className="time-summary-cards">
            <div className="time-summary-card">
              <span className="time-summary-label">Total time on site</span>
              <span className="time-summary-value time-total">{formatDuration(pageTimeSummary.totalSeconds)}</span>
            </div>
            <div className="time-summary-card">
              <span className="time-summary-label">Page visits (sessions)</span>
              <span className="time-summary-value">{pageTimeSummary.sessions.toLocaleString()}</span>
            </div>
            <div className="time-summary-card">
              <span className="time-summary-label">Avg per visit</span>
              <span className="time-summary-value">{formatDuration(pageTimeSummary.avgPerSession)}</span>
            </div>
          </div>
          <div className="time-by-page-section">
            <h3>Time by page</h3>
            {averageTimeByPath.length === 0 ? (
              <p className="no-data-inline">No page time data yet.</p>
            ) : (
              <div className="time-by-page-table-wrapper">
                <table className="traffic-table time-by-page-table">
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th className="num">Total time</th>
                      <th className="num">Avg per visit</th>
                      <th className="num">Visits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {averageTimeByPath.map((row, idx) => (
                      <tr key={idx}>
                        <td className="path-cell">
                          <code>{row.name}</code>
                        </td>
                        <td className="num duration-cell">{formatDuration(row.total)}</td>
                        <td className="num duration-cell">{formatDuration(row.average)}</td>
                        <td className="num">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="charts-grid">
            <div className="chart-card full-width">
              <h3>Total time spent by page (top 15)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={averageTimeByPath.slice(0, 15)} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v) => formatDuration(v)} />
                  <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [formatDuration(value), 'Total time']} />
                  <Bar dataKey="total" name="Total time" fill="#43e97b">
                    {averageTimeByPath.slice(0, 15).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card full-width">
              <h3>Average time per visit by page (top 15)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={averageTimeByPath.slice(0, 15)} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v) => formatDuration(v)} />
                  <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [formatDuration(value), 'Average']} />
                  <Bar dataKey="average" name="Average per visit" fill="#38f9d7">
                    {averageTimeByPath.slice(0, 15).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card full-width">
              <h3>Time spent over time (last 30 days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSpentOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis tickFormatter={(v) => formatDuration(v)} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'average') return [formatDuration(value), 'Avg per day'];
                      if (name === 'total') return [formatDuration(value), 'Total that day'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="average" stroke="#43e97b" fill="#43e97b" fillOpacity={0.6} name="Avg per day" />
                  <Area type="monotone" dataKey="total" stroke="#38f9d7" fill="#38f9d7" fillOpacity={0.4} name="Total per day" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="traffic-table-container">
            <h3>Individual page visits (raw data)</h3>
            <table className="traffic-table">
              <thead>
                <tr>
                  <th
                    className={`sortable ${pageTimeSortBy === 'path' ? 'active ' + pageTimeSortDirection : ''}`}
                    onClick={() => setPageTimeSort('path')}
                    title="Sort by path"
                  >
                    Path {pageTimeSortBy === 'path' && (pageTimeSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${pageTimeSortBy === 'duration' ? 'active ' + pageTimeSortDirection : ''}`}
                    onClick={() => setPageTimeSort('duration')}
                    title="Sort by duration"
                  >
                    Duration {pageTimeSortBy === 'duration' && (pageTimeSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${pageTimeSortBy === 'startTime' ? 'active ' + pageTimeSortDirection : ''}`}
                    onClick={() => setPageTimeSort('startTime')}
                    title="Sort by start time"
                  >
                    Start {pageTimeSortBy === 'startTime' && (pageTimeSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${pageTimeSortBy === 'endTime' ? 'active ' + pageTimeSortDirection : ''}`}
                    onClick={() => setPageTimeSort('endTime')}
                    title="Sort by end time"
                  >
                    End {pageTimeSortBy === 'endTime' && (pageTimeSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${pageTimeSortBy === 'visitor' ? 'active ' + pageTimeSortDirection : ''}`}
                    onClick={() => setPageTimeSort('visitor')}
                    title="Sort by visitor"
                  >
                    Visitor (IP) {pageTimeSortBy === 'visitor' && (pageTimeSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${pageTimeSortBy === 'environment' ? 'active ' + pageTimeSortDirection : ''}`}
                    onClick={() => setPageTimeSort('environment')}
                    title="Sort by environment"
                  >
                    Env {pageTimeSortBy === 'environment' && (pageTimeSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPageTimes.map((pageTime) => (
                  <tr key={pageTime.id}>
                    <td><code className="path-inline">{pageTime.path || 'N/A'}</code></td>
                    <td>
                      <span className="time-badge duration-badge">{formatDuration(pageTime.timeSpent || 0)}</span>
                    </td>
                    <td className="date-cell">{formatDate(pageTime.startTime)}</td>
                    <td className="date-cell">{formatDate(pageTime.endTime)}</td>
                    <td className="visitor-id-cell">{(pageTime.anonymizedIP || pageTime.visitorId || 'N/A').slice(0, 12)}…</td>
                    <td>
                      <span className={`env-badge ${pageTime.environment === 'localhost' ? 'localhost' : 'production'}`}>
                        {pageTime.environment || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'mediaclicks' && (
        <div className="traffic-tab-content media-clicks-tab">
          <p className="media-clicks-intro">
            Engagement when users open or click media (images and videos) on project pages. This is click/open count only; view duration is not tracked.
          </p>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Media Clicks by Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mediaClicksByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mediaClicksByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>Media Clicks by Project</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mediaClicksByProject}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#fa709a">
                    {mediaClicksByProject.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card full-width">
              <h3>Media Clicks Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mediaClicksOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#fa709a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="traffic-table-container">
            <table className="traffic-table">
              <thead>
                <tr>
                  <th
                    className={`sortable ${mediaClickSortBy === 'mediaType' ? 'active ' + mediaClickSortDirection : ''}`}
                    onClick={() => setMediaClickSort('mediaType')}
                    title="Sort by media type"
                  >
                    Media Type {mediaClickSortBy === 'mediaType' && (mediaClickSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${mediaClickSortBy === 'caption' ? 'active ' + mediaClickSortDirection : ''}`}
                    onClick={() => setMediaClickSort('caption')}
                    title="Sort by caption"
                  >
                    Caption/Title {mediaClickSortBy === 'caption' && (mediaClickSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${mediaClickSortBy === 'projectPath' ? 'active ' + mediaClickSortDirection : ''}`}
                    onClick={() => setMediaClickSort('projectPath')}
                    title="Sort by project path"
                  >
                    Project Path {mediaClickSortBy === 'projectPath' && (mediaClickSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${mediaClickSortBy === 'mediaSrc' ? 'active ' + mediaClickSortDirection : ''}`}
                    onClick={() => setMediaClickSort('mediaSrc')}
                    title="Sort by media source"
                  >
                    Media Source {mediaClickSortBy === 'mediaSrc' && (mediaClickSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${mediaClickSortBy === 'timestamp' ? 'active ' + mediaClickSortDirection : ''}`}
                    onClick={() => setMediaClickSort('timestamp')}
                    title="Sort by timestamp"
                  >
                    Timestamp {mediaClickSortBy === 'timestamp' && (mediaClickSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className={`sortable ${mediaClickSortBy === 'environment' ? 'active ' + mediaClickSortDirection : ''}`}
                    onClick={() => setMediaClickSort('environment')}
                    title="Sort by environment"
                  >
                    Environment {mediaClickSortBy === 'environment' && (mediaClickSortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedMediaClicks.map((mediaClick) => (
                  <tr key={mediaClick.id}>
                    <td>
                      <span className={`media-type-badge ${mediaClick.mediaType === 'image' ? 'image-type' : 'video-type'}`}>
                        {mediaClick.mediaType || 'Unknown'}
                      </span>
                    </td>
                    <td>{mediaClick.mediaCaption || 'N/A'}</td>
                    <td>{mediaClick.projectPath || 'N/A'}</td>
                    <td className="media-src-cell" title={mediaClick.mediaSrc || 'N/A'}>
                      {mediaClick.mediaSrc ? (mediaClick.mediaSrc.length > 50 ? mediaClick.mediaSrc.substring(0, 50) + '...' : mediaClick.mediaSrc) : 'N/A'}
                    </td>
                    <td>{formatDate(mediaClick.timestamp)}</td>
                    <td>
                      <span className={`env-badge ${mediaClick.environment === 'localhost' ? 'localhost' : 'production'}`}>
                        {mediaClick.environment || 'unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {topMediaClicks.length > 0 && (
            <div className="top-media-section">
              <h3>Top 10 Most Clicked Media</h3>
              <div className="top-media-grid">
                {topMediaClicks.map((media, index) => (
                  <div key={index} className="top-media-item">
                    <div className="top-media-header">
                      <span className="top-media-rank">#{index + 1}</span>
                      <span className={`media-type-badge ${media.type === 'image' ? 'image-type' : 'video-type'}`}>
                        {media.type}
                      </span>
                    </div>
                    <div className="top-media-info">
                      <div className="top-media-caption">{media.caption}</div>
                      <div className="top-media-project">{media.projectPath}</div>
                      <div className="top-media-count">{media.count} click{media.count !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'enquiries' && (
        <div className="traffic-tab-content">
          <div className="enquiries-section">
            <h3>Contact Enquiries</h3>
            {sortedEnquiries.length === 0 ? (
              <div className="no-data-message">
                <p>No enquiries yet.</p>
              </div>
            ) : (
              <>
                <div className="enquiries-sort-bar">
                  <span className="enquiries-sort-label">Sort by:</span>
                  <button
                    type="button"
                    className={`enquiries-sort-btn ${enquirySortBy === 'timestamp' ? 'active' : ''}`}
                    onClick={() => setEnquirySort('timestamp')}
                    title={enquirySortBy === 'timestamp' ? (enquirySortDirection === 'asc' ? 'Newest first (click to toggle)' : 'Oldest first (click to toggle)') : 'Sort by date'}
                  >
                    Date {enquirySortBy === 'timestamp' && (enquirySortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                  <button
                    type="button"
                    className={`enquiries-sort-btn ${enquirySortBy === 'name' ? 'active' : ''}`}
                    onClick={() => setEnquirySort('name')}
                    title="Sort by name"
                  >
                    Name {enquirySortBy === 'name' && (enquirySortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                  <button
                    type="button"
                    className={`enquiries-sort-btn ${enquirySortBy === 'status' ? 'active' : ''}`}
                    onClick={() => setEnquirySort('status')}
                    title="Sort by status"
                  >
                    Status {enquirySortBy === 'status' && (enquirySortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
                <div className="enquiries-grid">
                  {sortedEnquiries.map((enquiry) => (
                  <div key={enquiry.id} className="enquiry-card">
                    <div className="enquiry-header">
                      <div className="enquiry-meta">
                        <span className={`enquiry-status ${enquiry.status || 'new'}`}>{enquiry.status || 'new'}</span>
                        <span className="enquiry-date">{formatDate(enquiry.timestamp)}</span>
                      </div>
                    </div>
                    <div className="enquiry-body">
                      <div className="enquiry-field">
                        <label>Name:</label>
                        <span className="enquiry-value">{enquiry.name || 'N/A'}</span>
                      </div>
                      {enquiry.email && (
                        <div className="enquiry-field">
                          <label>Email:</label>
                          <a href={`mailto:${enquiry.email}`} className="enquiry-value enquiry-link">
                            {enquiry.email}
                          </a>
                        </div>
                      )}
                      {enquiry.phone && (
                        <div className="enquiry-field">
                          <label>Phone:</label>
                          <a href={`tel:${enquiry.phone}`} className="enquiry-value enquiry-link">
                            {enquiry.phone}
                          </a>
                        </div>
                      )}
                      <div className="enquiry-field">
                        <label>Enquiry:</label>
                        <p className="enquiry-message">{enquiry.enquiry || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'visitor-activity' && (
        <div className="traffic-tab-content visitor-activity-tab">
          <h3>Watch visitor activity</h3>
          <p className="visitor-activity-intro">
            Select a visitor to see a chronological timeline of their page views, events, time on page, and media clicks.
            Activity is matched by anonymized IP so all previously collected data is included, including visitors from before today.
          </p>
          <div className="visitor-activity-selector">
            <label htmlFor="visitor-activity-select">Visitor (matched by IP for all historical data):</label>
            <select
              id="visitor-activity-select"
              value={selectedVisitorAnonymizedIP || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) {
                  setSelectedVisitorAnonymizedIP(null);
                  return;
                }
                const visitor = visitorsForActivitySelector.find((v) => v.id === val);
                if (visitor) setSelectedVisitorAnonymizedIP(visitor.id);
              }}
            >
              <option value="">— Select a visitor —</option>
              {visitorsForActivitySelector.map((visitor) => (
                <option key={visitor.id} value={visitor.id}>
                  {visitor.id + ' • ' + formatDate(visitor.lastVisit) + ' • ' + getLocationString(visitor.location)}
                </option>
              ))}
            </select>
          </div>
          {selectedVisitorAnonymizedIP && (
            <div className="visitor-activity-timeline-section">
              <h4>Activity timeline ({visitorActivityTimeline.length} items)</h4>
              {visitorActivityTimeline.length === 0 ? (
                <p className="no-activity-message">No recorded activity for this visitor.</p>
              ) : (
                <div className="visitor-activity-timeline">
                  {visitorActivityTimeline.map((item, idx) => (
                    <div key={idx} className={`activity-item activity-${item.type}`}>
                      <div className="activity-time">{formatDate(item.timestamp)}</div>
                      <div className="activity-badge">
                        {item.type === 'pageview' && 'Page view'}
                        {item.type === 'event' && 'Event'}
                        {item.type === 'pagetime' && 'Time on page'}
                        {item.type === 'mediaclick' && 'Media click'}
                      </div>
                      <div className="activity-details">
                        {item.type === 'pageview' && (
                          <>
                            <span className="activity-path">{item.raw.path || 'N/A'}</span>
                            <span className="activity-title">{item.raw.title || ''}</span>
                            {item.raw.referrer && <span className="activity-referrer">From: {item.raw.referrer}</span>}
                          </>
                        )}
                        {item.type === 'event' && (
                          <>
                            <span className="activity-category">{item.raw.category}</span>
                            <span className="activity-action">{item.raw.action}</span>
                            {item.raw.label && <span className="activity-label">{item.raw.label}</span>}
                            <span className="activity-path">{item.raw.path || ''}</span>
                          </>
                        )}
                        {item.type === 'pagetime' && (
                          <>
                            <span className="activity-path">{item.raw.path || 'N/A'}</span>
                            <span className="activity-duration">{item.raw.timeSpent || 0}s</span>
                          </>
                        )}
                        {item.type === 'mediaclick' && (
                          <>
                            <span className="activity-media-type">{item.raw.mediaType}</span>
                            <span className="activity-caption">{item.raw.mediaCaption || item.raw.mediaSrc || '—'}</span>
                            <span className="activity-path">{item.raw.projectPath || item.raw.path || ''}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
