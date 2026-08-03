import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { signOutUser } from '../../services/authService';
import { useTraffic } from './TrafficContext';
import { UrlGeneratorSection } from './components/UrlGeneratorSection';
import { NotifyRecipientsSection } from './components/NotifyRecipientsSection';
import { TrafficFilters } from './components/TrafficFilters';
import { TrafficStats } from './components/TrafficStats';
import { TrafficTabList } from './components/TrafficTabList';
import { TrafficTabContent } from './TrafficTabContent';

export function TrafficDashboard() {
  const { user } = useAuth();
  const {
    loadData,
    loading,
    filteredStats,
  } = useTraffic();

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <div className="traffic-header">
        <h1>Traffic Analytics</h1>
        <div className="traffic-header-actions">
          <button className="traffic-refresh-btn" onClick={loadData} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button className="traffic-signout-btn" onClick={handleSignOut}>
            Sign Out ({user?.email})
          </button>
        </div>
      </div>

      <UrlGeneratorSection />
      <NotifyRecipientsSection />
      {filteredStats?.dataTruncated && (filteredStats.dataTruncated.visitors || filteredStats.dataTruncated.pageViews) && (
        <div className="traffic-truncate-notice" role="status">
          Showing the most recent loaded records only (per-collection cap). Totals in stat cards use rollups when available.
        </div>
      )}
      <TrafficFilters />
      {filteredStats && <TrafficStats />}
      <TrafficTabList />

      <div className="traffic-content">
        {loading ? (
          <div className="traffic-loading">Loading data...</div>
        ) : (
          <TrafficTabContent />
        )}
      </div>
    </>
  );
}

