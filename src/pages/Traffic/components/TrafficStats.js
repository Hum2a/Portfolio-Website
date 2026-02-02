import React from 'react';
import { FaFlag, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useTraffic } from '../TrafficContext';

export function TrafficStats() {
  const {
    filteredStats,
    environmentFilter,
    expandedCountries,
    setExpandedCountries,
    visitorsByCountry,
    visitorsForCountryBreakdown,
    selectedCountry,
    setSelectedCountry,
  } = useTraffic();

  if (!filteredStats) return null;

  return (
    <div className="traffic-stats">
      <div className="stat-card">
        <h3>{environmentFilter === 'all' ? 'Total' : environmentFilter === 'production' ? 'Production' : 'Localhost'} Visitors</h3>
        <p className="stat-value">
          {environmentFilter === 'all'
            ? filteredStats.totalVisitors
            : environmentFilter === 'production'
              ? filteredStats.productionVisitors
              : filteredStats.localhostVisitors}
        </p>
        {environmentFilter === 'all' && (
          <div className="stat-breakdown">
            <span className="breakdown-item production">Prod: {filteredStats.productionVisitors}</span>
            <span className="breakdown-item localhost">Local: {filteredStats.localhostVisitors}</span>
          </div>
        )}
      </div>
      <div className="stat-card">
        <h3>{environmentFilter === 'all' ? 'Total' : environmentFilter === 'production' ? 'Production' : 'Localhost'} Page Views</h3>
        <p className="stat-value">
          {environmentFilter === 'all'
            ? filteredStats.totalPageViews
            : environmentFilter === 'production'
              ? filteredStats.productionPageViews
              : filteredStats.localhostPageViews}
        </p>
        {environmentFilter === 'all' && (
          <div className="stat-breakdown">
            <span className="breakdown-item production">Prod: {filteredStats.productionPageViews}</span>
            <span className="breakdown-item localhost">Local: {filteredStats.localhostPageViews}</span>
          </div>
        )}
      </div>
      <div className="stat-card">
        <h3>{environmentFilter === 'all' ? 'Total' : environmentFilter === 'production' ? 'Production' : 'Localhost'} Events</h3>
        <p className="stat-value">
          {environmentFilter === 'all'
            ? filteredStats.totalEvents
            : environmentFilter === 'production'
              ? filteredStats.productionEvents
              : filteredStats.localhostEvents}
        </p>
        {environmentFilter === 'all' && (
          <div className="stat-breakdown">
            <span className="breakdown-item production">Prod: {filteredStats.productionEvents}</span>
            <span className="breakdown-item localhost">Local: {filteredStats.localhostEvents}</span>
          </div>
        )}
      </div>
      <div className={`stat-card countries-card ${expandedCountries ? 'expanded' : ''}`}>
        <div className="stat-card-header" onClick={() => setExpandedCountries(!expandedCountries)}>
          <div className="stat-title-group">
            <FaFlag className="stat-icon" />
            <h3>Unique Countries</h3>
          </div>
          <button
            className="expand-countries-btn"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedCountries(!expandedCountries);
            }}
          >
            {expandedCountries ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        <p className="stat-value" onClick={() => setExpandedCountries(!expandedCountries)} style={{ cursor: 'pointer' }}>
          {visitorsByCountry.length}
        </p>
        {expandedCountries && (
          <div className="countries-tags-container">
            {visitorsByCountry.length > 0 ? (
              <>
                <div className="countries-header">
                  <div className="countries-title-row">
                    <h4>Countries Breakdown</h4>
                    {selectedCountry && (
                      <button
                        className="clear-country-filter-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCountry(null);
                        }}
                        title="Clear country filter"
                      >
                        Clear Filter
                      </button>
                    )}
                  </div>
                  <span className="countries-subtitle">
                    {selectedCountry
                      ? `Filtered: ${selectedCountry} (${visitorsByCountry.find((c) => c.name === selectedCountry)?.value || 0} visitors)`
                      : `${visitorsForCountryBreakdown.length} total visitors across ${visitorsByCountry.length} countries`}
                  </span>
                </div>
                <div className="countries-tags">
                  {visitorsByCountry.map((country, index) => {
                    const percentage =
                      visitorsForCountryBreakdown.length > 0
                        ? ((country.value / visitorsForCountryBreakdown.length) * 100).toFixed(1)
                        : 0;
                    const isSelected = selectedCountry === country.name;
                    return (
                      <span
                        key={index}
                        className={`country-tag ${isSelected ? 'selected' : ''}`}
                        title={`${country.value} visitor${country.value !== 1 ? 's' : ''} (${percentage}%) - Click to filter by this country`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCountry(isSelected ? null : country.name);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="country-flag">🌍</span>
                        <span className="country-name">{country.name}</span>
                        <span className="country-count">{country.value}</span>
                        {isSelected && <span className="country-filter-indicator">✓</span>}
                      </span>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="no-countries">No country data available</p>
            )}
          </div>
        )}
      </div>
      <div className="stat-card">
        <h3>{environmentFilter === 'all' ? 'Total' : environmentFilter === 'production' ? 'Production' : 'Localhost'} Page Times</h3>
        <p className="stat-value">{filteredStats.totalPageTimes || 0}</p>
        {environmentFilter === 'all' && (
          <div className="stat-breakdown">
            <span className="breakdown-item production">Prod: {filteredStats.productionPageTimes || 0}</span>
            <span className="breakdown-item localhost">Local: {filteredStats.localhostPageTimes || 0}</span>
          </div>
        )}
      </div>
      <div className="stat-card">
        <h3>Average Time Spent</h3>
        <p className="stat-value">{filteredStats.avgTimeSpent || 0}s</p>
        {filteredStats.totalTimeSpent > 0 && (
          <div className="stat-breakdown">
            <span className="breakdown-item production">Total: {filteredStats.totalTimeSpent || 0}s</span>
          </div>
        )}
      </div>
      <div className="stat-card">
        <h3>{environmentFilter === 'all' ? 'Total' : environmentFilter === 'production' ? 'Production' : 'Localhost'} Media Clicks</h3>
        <p className="stat-value">
          {environmentFilter === 'all'
            ? filteredStats.totalMediaClicks || 0
            : environmentFilter === 'production'
              ? filteredStats.productionMediaClicks || 0
              : filteredStats.localhostMediaClicks || 0}
        </p>
        {environmentFilter === 'all' && (
          <div className="stat-breakdown">
            <span className="breakdown-item production">Prod: {filteredStats.productionMediaClicks || 0}</span>
            <span className="breakdown-item localhost">Local: {filteredStats.localhostMediaClicks || 0}</span>
          </div>
        )}
      </div>
    </div>
  );
}
