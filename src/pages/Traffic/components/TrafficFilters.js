import React from 'react';
import { useTraffic } from '../TrafficContext';
import { OwnerDevicesPanel } from './VisitorDataAdmin';

export function TrafficFilters() {
  const {
    environmentFilter,
    setEnvironmentFilter,
    excludeAdminPaths,
    setExcludeAdminPaths,
    hideBots,
    setHideBots,
    filterCountsByEnvironment,
    timeRange,
    handleTimeRangeChange,
    formatDateForInput,
    dateRange,
    handleDateRangeChange,
    setDateRange,
    adminMessage,
  } = useTraffic();

  const counts = filterCountsByEnvironment || {
    all: { visitors: 0, pageViews: 0, events: 0 },
    production: { visitors: 0, pageViews: 0, events: 0 },
    localhost: { visitors: 0, pageViews: 0, events: 0 },
  };

  return (
    <div className="filters-section">
      <OwnerDevicesPanel />
      {adminMessage && (
        <p className="admin-message" role="status">
          {adminMessage}
        </p>
      )}

      <div className="environment-filter admin-path-filter">
        <div className="filter-header">
          <h3>Admin pages</h3>
          <span className="filter-subtitle">Hide /traffic from stats (your dashboard visits)</span>
        </div>
        <label className="admin-path-filter-toggle">
          <input
            type="checkbox"
            checked={excludeAdminPaths}
            onChange={(e) => setExcludeAdminPaths(e.target.checked)}
          />
          <span>Exclude /traffic from analytics</span>
        </label>
        <label className="admin-path-filter-toggle">
          <input
            type="checkbox"
            checked={hideBots}
            onChange={(e) => setHideBots(e.target.checked)}
          />
          <span>Hide likely bots from visitor list</span>
        </label>
      </div>

      <div className="environment-filter">
        <div className="filter-header">
          <h3>Environment Filter</h3>
          <span className="filter-subtitle">Filter data by source environment</span>
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${environmentFilter === 'all' ? 'active' : ''}`}
            onClick={() => setEnvironmentFilter('all')}
          >
            All ({counts.all.visitors} visitors, {counts.all.pageViews} page views, {counts.all.events} events)
          </button>
          <button
            className={`filter-btn ${environmentFilter === 'production' ? 'active' : ''}`}
            onClick={() => setEnvironmentFilter('production')}
          >
            Production ({counts.production.visitors} visitors, {counts.production.pageViews} page views, {counts.production.events} events)
          </button>
          <button
            className={`filter-btn ${environmentFilter === 'localhost' ? 'active' : ''}`}
            onClick={() => setEnvironmentFilter('localhost')}
          >
            Localhost ({counts.localhost.visitors} visitors, {counts.localhost.pageViews} page views, {counts.localhost.events} events)
          </button>
        </div>
      </div>

      <div className="date-time-filter">
        <div className="filter-header">
          <h3>Date & Time Range</h3>
          <span className="filter-subtitle">Filter data by date range</span>
        </div>
        <div className="time-range-controls">
          <div className="quick-filters">
            <button className={`time-filter-btn ${timeRange === 'all' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('all')}>All Time</button>
            <button className={`time-filter-btn ${timeRange === 'today' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('today')}>Today</button>
            <button className={`time-filter-btn ${timeRange === '7d' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('7d')}>Last 7 Days</button>
            <button className={`time-filter-btn ${timeRange === '30d' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('30d')}>Last 30 Days</button>
            <button className={`time-filter-btn ${timeRange === '90d' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('90d')}>Last 90 Days</button>
            <button className={`time-filter-btn ${timeRange === 'custom' ? 'active' : ''}`} onClick={() => handleTimeRangeChange('custom')}>Custom Range</button>
          </div>

          {timeRange === 'custom' && (
            <div className="custom-date-range">
              <div className="date-input-group">
                <label htmlFor="start-date">From Date:</label>
                <input
                  type="date"
                  id="start-date"
                  className="date-input"
                  value={formatDateForInput(dateRange.start)}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  max={formatDateForInput(new Date())}
                />
              </div>
              <div className="date-input-group">
                <label htmlFor="end-date">To Date:</label>
                <input
                  type="date"
                  id="end-date"
                  className="date-input"
                  value={formatDateForInput(dateRange.end)}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  min={dateRange.start || undefined}
                  max={formatDateForInput(new Date())}
                />
              </div>
              {(dateRange.start || dateRange.end) && (
                <button className="clear-date-btn" onClick={() => setDateRange({ start: null, end: null })}>Clear Dates</button>
              )}
            </div>
          )}

          {timeRange !== 'all' && timeRange !== 'custom' && (
            <div className="current-range-display">
              <span className="range-label">Showing data from:</span>
              <span className="range-value">
                {timeRange === 'today' && 'Today'}
                {timeRange === '7d' && 'Last 7 days'}
                {timeRange === '30d' && 'Last 30 days'}
                {timeRange === '90d' && 'Last 90 days'}
              </span>
            </div>
          )}

          {timeRange === 'custom' && dateRange.start && dateRange.end && (
            <div className="current-range-display">
              <span className="range-label">Custom range:</span>
              <span className="range-value">{formatDateForInput(dateRange.start)} to {formatDateForInput(dateRange.end)}</span>
            </div>
          )}

          {timeRange === 'custom' && !dateRange.start && !dateRange.end && (
            <div className="current-range-display warning">
              <span className="range-label">⚠️ Please select at least one date (start or end) to filter</span>
            </div>
          )}

          {timeRange === 'custom' && (dateRange.start || dateRange.end) && !(dateRange.start && dateRange.end) && (
            <div className="current-range-display info">
              <span className="range-label">
                {dateRange.start ? `From: ${formatDateForInput(dateRange.start)}` : ''}
                {dateRange.end ? ` To: ${formatDateForInput(dateRange.end)}` : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
