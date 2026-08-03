import React from 'react';
import { FaEye } from 'react-icons/fa';
import { useTraffic } from '../TrafficContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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
    emailLogs,
    selectedCountry,
  } = useTraffic();

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="traffic-tabs w-full"
    >
      <TabsList
        variant="default"
        className="flex h-auto w-full flex-wrap justify-start gap-1 p-1"
      >
        <TabsTrigger value="trends" className="px-3">
          Trends
        </TabsTrigger>
        <TabsTrigger value="visitors" className="gap-1.5 px-3">
          Visitors ({filteredVisitors.length})
          {selectedCountry ? (
            <Badge variant="secondary" className="max-w-[8rem] truncate" title={`Filtered by: ${selectedCountry}`}>
              {selectedCountry}
            </Badge>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="pageviews" className="px-3">
          Page Views ({filteredPageViews.length})
        </TabsTrigger>
        <TabsTrigger value="events" className="px-3">
          Events ({filteredEvents.length})
        </TabsTrigger>
        <TabsTrigger value="pagetimes" className="px-3">
          Page Times ({filteredPageTimes.length})
        </TabsTrigger>
        <TabsTrigger value="mediaclicks" className="px-3">
          Media Clicks ({filteredMediaClicks.length})
        </TabsTrigger>
        <TabsTrigger value="enquiries" className="px-3">
          Enquiries ({enquiries.length})
        </TabsTrigger>
        <TabsTrigger value="emails" className="px-3">
          Emails ({emailLogs?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="visitor-activity" className="gap-1.5 px-3">
          <FaEye className="size-3.5" />
          Watch visitor
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
