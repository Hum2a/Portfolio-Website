import React from 'react';
import { FaEye } from 'react-icons/fa';
import { useTraffic } from '../TrafficContext';

export function TrafficTabList() {
  const {
    activeTab,
    setActiveTab,
    filteredVisitors,
    filteredPageViews,
    filteredEvents,
    filteredPageTimes,
    filteredMediaClicks,
    enquiries,
    selectedCountry,
  } = useTraffic();

  return (
    <div className="traffic-tabs">
      <button className={`traffic-tab ${activeTab === 'visitors' ? 'active' : ''}`} onClick={() => setActiveTab('visitors')}>
        <span>Visitors ({filteredVisitors.length})</span>
        {selectedCountry && (
          <span className="filter-badge country-badge" title={`Filtered by: ${selectedCountry}`}>{selectedCountry}</span>
        )}
      </button>
      <button className={`traffic-tab ${activeTab === 'pageviews' ? 'active' : ''}`} onClick={() => setActiveTab('pageviews')}>
        Page Views ({filteredPageViews.length})
      </button>
      <button className={`traffic-tab ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
        Events ({filteredEvents.length})
      </button>
      <button className={`traffic-tab ${activeTab === 'pagetimes' ? 'active' : ''}`} onClick={() => setActiveTab('pagetimes')}>
        Page Times ({filteredPageTimes.length})
      </button>
      <button className={`traffic-tab ${activeTab === 'mediaclicks' ? 'active' : ''}`} onClick={() => setActiveTab('mediaclicks')}>
        Media Clicks ({filteredMediaClicks.length})
      </button>
      <button className={`traffic-tab ${activeTab === 'enquiries' ? 'active' : ''}`} onClick={() => setActiveTab('enquiries')}>
        Enquiries ({enquiries.length})
      </button>
      <button className={`traffic-tab ${activeTab === 'visitor-activity' ? 'active' : ''}`} onClick={() => setActiveTab('visitor-activity')}>
        <FaEye /> Watch visitor
      </button>
    </div>
  );
}
