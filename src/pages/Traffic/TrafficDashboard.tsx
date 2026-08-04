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
import { Button } from '@/components/ui/button';

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
      <div className="traffic-header surface-2 mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl p-5">
        <h1 className="m-0 font-display text-3xl font-semibold tracking-tight text-text-primary">
          Traffic Analytics
        </h1>
        <div className="traffic-header-actions flex flex-wrap gap-3">
          <Button type="button" onClick={loadData} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
          <Button type="button" variant="outline" onClick={handleSignOut}>
            Sign Out ({user?.email})
          </Button>
        </div>
      </div>

      <div className="surface-2 mb-6 rounded-xl p-4 md:p-5">
        <UrlGeneratorSection />
      </div>
      <div className="surface-2 mb-6 rounded-xl p-4 md:p-5">
        <NotifyRecipientsSection />
      </div>
      {filteredStats?.dataTruncated && (filteredStats.dataTruncated.visitors || filteredStats.dataTruncated.pageViews) && (
        <div className="traffic-truncate-notice mb-4 rounded-lg border border-glass bg-elevated px-4 py-3 text-sm text-text-secondary" role="status">
          Showing the most recent loaded records only (per-collection cap). Totals in stat cards use rollups when available.
        </div>
      )}
      <div className="surface-1 mb-6 rounded-xl p-4 md:p-5">
        <TrafficFilters />
      </div>
      {filteredStats && (
        <div className="mb-6">
          <TrafficStats />
        </div>
      )}
      <div className="mb-4">
        <TrafficTabList />
      </div>

      <div className="traffic-content surface-2 rounded-xl p-4 md:p-6">
        {loading ? (
          <div className="traffic-loading text-text-secondary">Loading data...</div>
        ) : (
          <TrafficTabContent />
        )}
      </div>
    </>
  );
}
