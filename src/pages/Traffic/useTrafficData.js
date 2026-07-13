import { useState, useEffect, useMemo, useCallback } from 'react';
import { loadTrafficData as fetchTrafficData } from './loadTrafficData';
import { formatDate, formatDuration, getLocationString } from './utils';
import { buildRefDrillData, buildRefTokenAnalytics } from './refTokenAnalytics';
import { computeTrafficTrends } from './trafficTrends';
import {
  parseRollupStats,
  getDailySeries,
  getDailySeriesInRange,
  getLast24hSummary,
  mergeHeadlineStats,
  getRefTokenRollup,
  mapDimensionCounts,
  computeRawCountsFromRecords,
  sumDailyBucketsInRange,
  getTimeRangeLabel,
} from './statsHelpers';
import { isExcludedAnalyticsPath, visitorHasNonAdminActivity, getAnalyticsPathLabel, canonicalizeAnalyticsPath } from '../../utils/analyticsPaths';
import { getTrafficSignalsForVisitor } from '../../utils/trafficSignals';
import {
  listOwnerTags,
  setOwnerTag,
  removeOwnerTag,
  deleteAnalyticsForIP,
  getBrowserAnonymizedIP,
} from '../../services/analyticsAdminService';

function getDateFilter(timeRange, dateRange) {
  if (timeRange === 'custom' && (dateRange.start || dateRange.end)) {
    const start = dateRange.start ? new Date(dateRange.start + 'T00:00:00') : null;
    const end = dateRange.end ? new Date(dateRange.end + 'T23:59:59') : null;
    if (start && end && start > end) return null;
    return { start, end };
  }
  if (timeRange === 'all') return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (timeRange) {
    case 'today':
      return { start: today, end: now };
    case '7d':
      return { start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), end: now };
    case '30d':
      return { start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), end: now };
    case '90d':
      return { start: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000), end: now };
    default:
      return null;
  }
}

export function useTrafficData(role) {
  const [visitors, setVisitors] = useState([]);
  const [pageViews, setPageViews] = useState([]);
  const [events, setEvents] = useState([]);
  const [pageTimes, setPageTimes] = useState([]);
  const [mediaClicks, setMediaClicks] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [refHits, setRefHits] = useState([]);
  const [stats, setStats] = useState(null);
  const [dataTruncated, setDataTruncated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('visitors');
  const [expandedVisitors, setExpandedVisitors] = useState(new Set());
  const [visitorActiveTabs, setVisitorActiveTabs] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [environmentFilter, setEnvironmentFilter] = useState('all');
  const [excludeAdminPaths, setExcludeAdminPaths] = useState(true);
  const [hideBots, setHideBots] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [timeRange, setTimeRange] = useState('all');
  const [expandedCountries, setExpandedCountries] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showUrlGenerator, setShowUrlGenerator] = useState(false);
  const [urlGeneratorData, setUrlGeneratorData] = useState({
    baseUrl: typeof window !== 'undefined' ? window.location.origin : '',
    landingPath: '/',
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
  });
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [urlGeneratorMode, setUrlGeneratorMode] = useState('ref'); // 'ref' | 'utm' - ref works with PDFs
  const [generatedRefUrl, setGeneratedRefUrl] = useState('');
  const [refUrlLoading, setRefUrlLoading] = useState(false);
  const [refUrlError, setRefUrlError] = useState('');
  const [trackingTokens, setTrackingTokens] = useState([]);
  const [trackingTokensLoading, setTrackingTokensLoading] = useState(false);
  const [trackingTokensError, setTrackingTokensError] = useState('');
  const [selectedVisitorAnonymizedIP, setSelectedVisitorAnonymizedIP] = useState(null);
  const [visitorSortBy, setVisitorSortBy] = useState('lastVisit');
  const [visitorSortDirection, setVisitorSortDirection] = useState('desc');
  const [pageViewSortBy, setPageViewSortBy] = useState('timestamp');
  const [pageViewSortDirection, setPageViewSortDirection] = useState('desc');
  const [eventSortBy, setEventSortBy] = useState('timestamp');
  const [eventSortDirection, setEventSortDirection] = useState('desc');
  const [pageTimeSortBy, setPageTimeSortBy] = useState('startTime');
  const [pageTimeSortDirection, setPageTimeSortDirection] = useState('desc');
  const [mediaClickSortBy, setMediaClickSortBy] = useState('timestamp');
  const [mediaClickSortDirection, setMediaClickSortDirection] = useState('desc');
  const [enquirySortBy, setEnquirySortBy] = useState('timestamp');
  const [enquirySortDirection, setEnquirySortDirection] = useState('desc');
  const [ownerTags, setOwnerTags] = useState({});
  const [deleteAnalyticsLoading, setDeleteAnalyticsLoading] = useState(null);
  const [adminMessage, setAdminMessage] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTrafficData();
      setVisitors(data.visitors);
      setPageViews(data.pageViews);
      setEvents(data.events);
      setPageTimes(data.pageTimes);
      setMediaClicks(data.mediaClicks);
      setEnquiries(data.enquiries);
      setRefHits(data.refHits || []);
      setStats(data.stats);
      setDataTruncated(data.truncated || null);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === 'humza') loadData();
  }, [role, loadData]);

  const loadOwnerTags = useCallback(async () => {
    try {
      const tags = await listOwnerTags();
      setOwnerTags(tags);
    } catch (error) {
      console.error('Failed to load owner tags:', error);
    }
  }, []);

  useEffect(() => {
    if (role === 'humza') loadOwnerTags();
  }, [role, loadOwnerTags]);

  const getVisitorKey = useCallback(
    (visitor) => visitor?.anonymizedIP || visitor?.id || '',
    []
  );

  const isOwnerVisitor = useCallback(
    (key) => Boolean(key && ownerTags[key]),
    [ownerTags]
  );

  const browserAnonymizedIP =
    typeof window !== 'undefined' ? getBrowserAnonymizedIP() : null;

  const tagVisitorAsOwner = useCallback(
    async (key, label = 'Mine') => {
      await setOwnerTag(key, label);
      await loadOwnerTags();
      setAdminMessage(`Tagged ${key} as yours.`);
    },
    [loadOwnerTags]
  );

  const tagCurrentBrowser = useCallback(async () => {
    const ip = getBrowserAnonymizedIP();
    if (!ip) {
      setAdminMessage('Visit the main site in this browser first so an analytics ID is created.');
      return;
    }
    await tagVisitorAsOwner(ip);
  }, [tagVisitorAsOwner]);

  const untagVisitorAsOwner = useCallback(
    async (key) => {
      await removeOwnerTag(key);
      await loadOwnerTags();
    },
    [loadOwnerTags]
  );

  const deleteVisitorAnalytics = useCallback(
    async (key, { skipConfirm = false } = {}) => {
      if (!key) return;
      if (
        !skipConfirm &&
        !window.confirm(
          `Delete ALL analytics for ${key}?\n\nThis removes the visitor record, page views, events, sessions, and ref hits. It cannot be undone.`
        )
      ) {
        return;
      }

      setDeleteAnalyticsLoading(key);
      setAdminMessage(null);
      try {
        const result = await deleteAnalyticsForIP(key);
        await loadData();
        await loadOwnerTags();
        setExpandedVisitors((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
        if (selectedVisitorAnonymizedIP === key) {
          setSelectedVisitorAnonymizedIP(null);
        }
        setAdminMessage(
          `Deleted analytics for ${key} (${result.total} document${result.total === 1 ? '' : 's'}). Rollup totals may still include old counts until reset.`
        );
      } catch (error) {
        console.error('Delete analytics failed:', error);
        setAdminMessage(error.message || 'Delete failed');
      } finally {
        setDeleteAnalyticsLoading(null);
      }
    },
    [loadData, loadOwnerTags, selectedVisitorAnonymizedIP]
  );

  const loadTrackingTokens = useCallback(async () => {
    setTrackingTokensLoading(true);
    setTrackingTokensError('');
    try {
      const { listTrackingTokens } = await import('../../services/trackingTokenService');
      const tokens = await listTrackingTokens();
      setTrackingTokens(tokens);
    } catch (err) {
      setTrackingTokensError(err?.message || 'Failed to load reference codes');
      setTrackingTokens([]);
    } finally {
      setTrackingTokensLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === 'humza') {
      loadTrackingTokens();
    }
  }, [role, loadTrackingTokens]);

  const toDate = useCallback((timestamp) => {
    if (!timestamp) return null;
    if (typeof timestamp?.toDate === 'function') return timestamp.toDate();
    if (timestamp instanceof Date) return timestamp;
    return new Date(timestamp);
  }, []);

  const isDateInRange = useCallback(
    (date, startDate, endDate) => {
      if (!date) return false;
      const checkDate = toDate(date);
      if (!checkDate || isNaN(checkDate.getTime())) return false;
      if (startDate && !endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        return checkDate >= start;
      }
      if (!startDate && endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return checkDate <= end;
      }
      if (startDate && endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return checkDate >= start && checkDate <= end;
      }
      return true;
    },
    [toDate]
  );

  const dateFilter = useMemo(
    () => getDateFilter(timeRange, dateRange),
    [timeRange, dateRange]
  );

  const pageViewsForAnalytics = useMemo(() => {
    if (!excludeAdminPaths) return pageViews;
    return pageViews.filter((pv) => !isExcludedAnalyticsPath(pv.path));
  }, [pageViews, excludeAdminPaths]);

  const eventsForAnalytics = useMemo(() => {
    if (!excludeAdminPaths) return events;
    return events.filter((e) => !isExcludedAnalyticsPath(e.path));
  }, [events, excludeAdminPaths]);

  const pageTimesForAnalytics = useMemo(() => {
    if (!excludeAdminPaths) return pageTimes;
    return pageTimes.filter((pt) => !isExcludedAnalyticsPath(pt.path));
  }, [pageTimes, excludeAdminPaths]);

  const mediaClicksForAnalytics = useMemo(() => {
    if (!excludeAdminPaths) return mediaClicks;
    return mediaClicks.filter(
      (mc) =>
        !isExcludedAnalyticsPath(mc.path) && !isExcludedAnalyticsPath(mc.projectPath)
    );
  }, [mediaClicks, excludeAdminPaths]);

  const visitorsForAnalytics = useMemo(() => {
    let list = visitors;
    if (excludeAdminPaths) {
      list = list.filter((v) => visitorHasNonAdminActivity(v, pageViews));
    }
    if (hideBots) {
      list = list.filter((v) => !getTrafficSignalsForVisitor(v)?.isLikelyBot);
    }
    return list;
  }, [visitors, pageViews, excludeAdminPaths, hideBots]);

  const formatDateForInput = useCallback(
    (date) => {
      if (!date) return '';
      try {
        const d = typeof date === 'string' ? new Date(date) : toDate(date);
        if (!d || isNaN(d.getTime())) return '';
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (error) {
        return '';
      }
    },
    [toDate]
  );

  const visitorsForActivitySelector = useMemo(() => {
    let filtered = visitorsForAnalytics;
    if (environmentFilter !== 'all') filtered = filtered.filter((v) => v.environment === environmentFilter);
    if (selectedCountry && selectedCountry !== 'all') filtered = filtered.filter((v) => v.location?.country === selectedCountry);
    return filtered.sort((a, b) => {
      const aTime = toDate(a.lastVisit)?.getTime() || 0;
      const bTime = toDate(b.lastVisit)?.getTime() || 0;
      return bTime - aTime;
    });
  }, [visitorsForAnalytics, environmentFilter, selectedCountry, toDate]);

  const filteredVisitors = useMemo(() => {
    let filtered = visitorsForAnalytics;
    if (environmentFilter !== 'all') filtered = filtered.filter((v) => v.environment === environmentFilter);
    if (selectedCountry && selectedCountry !== 'all') filtered = filtered.filter((v) => v.location?.country === selectedCountry);
    if (dateFilter) filtered = filtered.filter((v) => isDateInRange(v.lastVisit, dateFilter.start, dateFilter.end));
    return filtered;
  }, [visitorsForAnalytics, environmentFilter, selectedCountry, dateFilter, isDateInRange]);

  const sortedVisitors = useMemo(() => {
    const list = [...filteredVisitors];
    const dir = visitorSortDirection === 'asc' ? 1 : -1;
    const cmp = (a, b) => {
      switch (visitorSortBy) {
        case 'ip':
          return (a.anonymizedIP || a.id || '').localeCompare(b.anonymizedIP || b.id || '');
        case 'visits':
          return (a.visits || 0) - (b.visits || 0);
        case 'deviceType':
          return (a.deviceInfo?.deviceType || 'N/A').localeCompare(b.deviceInfo?.deviceType || 'N/A');
        case 'browser':
          return (a.deviceInfo?.browser || 'N/A').localeCompare(b.deviceInfo?.browser || 'N/A');
        case 'os':
          return (a.deviceInfo?.os || 'N/A').localeCompare(b.deviceInfo?.os || 'N/A');
        case 'location':
          return getLocationString(a.location).localeCompare(getLocationString(b.location));
        case 'firstVisit': {
          const at = toDate(a.firstVisit)?.getTime() ?? 0;
          const bt = toDate(b.firstVisit)?.getTime() ?? 0;
          return at - bt;
        }
        case 'lastVisit':
        default: {
          const at = toDate(a.lastVisit)?.getTime() ?? 0;
          const bt = toDate(b.lastVisit)?.getTime() ?? 0;
          return at - bt;
        }
      }
    };
    list.sort((a, b) => dir * cmp(a, b));
    return list;
  }, [filteredVisitors, visitorSortBy, visitorSortDirection, toDate]);

  const setVisitorSort = useCallback((field) => {
    setVisitorSortBy((prev) => {
      if (prev === field) {
        setVisitorSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setVisitorSortDirection(['lastVisit', 'firstVisit', 'visits'].includes(field) ? 'desc' : 'asc');
      return field;
    });
  }, []);

  const filteredPageViews = useMemo(() => {
    let filtered = pageViewsForAnalytics;
    if (environmentFilter !== 'all') filtered = filtered.filter((pv) => pv.environment === environmentFilter);
    if (dateFilter) filtered = filtered.filter((pv) => isDateInRange(pv.timestamp, dateFilter.start, dateFilter.end));
    return filtered;
  }, [pageViewsForAnalytics, environmentFilter, dateFilter, isDateInRange]);

  const sortedPageViews = useMemo(() => {
    const list = [...filteredPageViews];
    const dir = pageViewSortDirection === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      let cmp = 0;
      switch (pageViewSortBy) {
        case 'path':
          cmp = (a.path || '').localeCompare(b.path || '');
          break;
        case 'title':
          cmp = (a.title || '').localeCompare(b.title || '');
          break;
        case 'referrer':
          cmp = (a.referrer || '').localeCompare(b.referrer || '');
          break;
        case 'timestamp':
        default: {
          const at = toDate(a.timestamp)?.getTime() ?? 0;
          const bt = toDate(b.timestamp)?.getTime() ?? 0;
          cmp = at - bt;
          break;
        }
      }
      return dir * cmp;
    });
    return list;
  }, [filteredPageViews, pageViewSortBy, pageViewSortDirection, toDate]);

  const setPageViewSort = useCallback((field) => {
    setPageViewSortBy((prev) => {
      if (prev === field) {
        setPageViewSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setPageViewSortDirection(field === 'timestamp' ? 'desc' : 'asc');
      return field;
    });
  }, []);

  const filteredEvents = useMemo(() => {
    let filtered = eventsForAnalytics;
    if (environmentFilter !== 'all') filtered = filtered.filter((e) => e.environment === environmentFilter);
    if (dateFilter) filtered = filtered.filter((e) => isDateInRange(e.timestamp, dateFilter.start, dateFilter.end));
    return filtered;
  }, [eventsForAnalytics, environmentFilter, dateFilter, isDateInRange]);

  const sortedEvents = useMemo(() => {
    const list = [...filteredEvents];
    const dir = eventSortDirection === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      let cmp = 0;
      switch (eventSortBy) {
        case 'category':
          cmp = (a.category || '').localeCompare(b.category || '');
          break;
        case 'action':
          cmp = (a.action || '').localeCompare(b.action || '');
          break;
        case 'label':
          cmp = (a.label || '').localeCompare(b.label || '');
          break;
        case 'path':
          cmp = (a.path || '').localeCompare(b.path || '');
          break;
        case 'timestamp':
        default: {
          const at = toDate(a.timestamp)?.getTime() ?? 0;
          const bt = toDate(b.timestamp)?.getTime() ?? 0;
          cmp = at - bt;
          break;
        }
      }
      return dir * cmp;
    });
    return list;
  }, [filteredEvents, eventSortBy, eventSortDirection, toDate]);

  const setEventSort = useCallback((field) => {
    setEventSortBy((prev) => {
      if (prev === field) {
        setEventSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setEventSortDirection(field === 'timestamp' ? 'desc' : 'asc');
      return field;
    });
  }, []);

  const filteredPageTimes = useMemo(() => {
    let filtered = pageTimesForAnalytics;
    if (environmentFilter !== 'all') filtered = filtered.filter((pt) => pt.environment === environmentFilter);
    if (dateFilter) {
      filtered = filtered.filter((pt) => {
        const checkDate = pt.startTime ? toDate(pt.startTime) : pt.timestamp ? toDate(pt.timestamp) : null;
        if (!checkDate || isNaN(checkDate.getTime())) return false;
        return isDateInRange(checkDate, dateFilter.start, dateFilter.end);
      });
    }
    return filtered;
  }, [pageTimesForAnalytics, environmentFilter, dateFilter, isDateInRange, toDate]);

  const sortedPageTimes = useMemo(() => {
    const list = [...filteredPageTimes];
    const dir = pageTimeSortDirection === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      let cmp = 0;
      switch (pageTimeSortBy) {
        case 'path':
          cmp = (a.path || '').localeCompare(b.path || '');
          break;
        case 'duration':
          cmp = (a.timeSpent || 0) - (b.timeSpent || 0);
          break;
        case 'startTime': {
          const at = toDate(a.startTime)?.getTime() ?? 0;
          const bt = toDate(b.startTime)?.getTime() ?? 0;
          cmp = at - bt;
          break;
        }
        case 'endTime': {
          const at = toDate(a.endTime)?.getTime() ?? 0;
          const bt = toDate(b.endTime)?.getTime() ?? 0;
          cmp = at - bt;
          break;
        }
        case 'visitor':
          cmp = (a.anonymizedIP || a.visitorId || '').localeCompare(b.anonymizedIP || b.visitorId || '');
          break;
        case 'environment':
          cmp = (a.environment || '').localeCompare(b.environment || '');
          break;
        default:
          cmp = (toDate(a.startTime)?.getTime() ?? 0) - (toDate(b.startTime)?.getTime() ?? 0);
          break;
      }
      return dir * cmp;
    });
    return list;
  }, [filteredPageTimes, pageTimeSortBy, pageTimeSortDirection, toDate]);

  const setPageTimeSort = useCallback((field) => {
    setPageTimeSortBy((prev) => {
      if (prev === field) {
        setPageTimeSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setPageTimeSortDirection(['startTime', 'endTime', 'duration'].includes(field) ? 'desc' : 'asc');
      return field;
    });
  }, []);

  const filteredMediaClicks = useMemo(() => {
    let filtered = mediaClicksForAnalytics;
    if (environmentFilter !== 'all') filtered = filtered.filter((mc) => mc.environment === environmentFilter);
    if (dateFilter) {
      filtered = filtered.filter((mc) => {
        const checkDate = mc.timestamp ? toDate(mc.timestamp) : null;
        if (!checkDate || isNaN(checkDate.getTime())) return false;
        return isDateInRange(checkDate, dateFilter.start, dateFilter.end);
      });
    }
    return filtered;
  }, [mediaClicksForAnalytics, environmentFilter, dateFilter, isDateInRange, toDate]);

  const sortedMediaClicks = useMemo(() => {
    const list = [...filteredMediaClicks];
    const dir = mediaClickSortDirection === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      let cmp = 0;
      switch (mediaClickSortBy) {
        case 'mediaType':
          cmp = (a.mediaType || '').localeCompare(b.mediaType || '');
          break;
        case 'caption':
          cmp = (a.mediaCaption || '').localeCompare(b.mediaCaption || '');
          break;
        case 'projectPath':
          cmp = (a.projectPath || '').localeCompare(b.projectPath || '');
          break;
        case 'mediaSrc':
          cmp = (a.mediaSrc || '').localeCompare(b.mediaSrc || '');
          break;
        case 'environment':
          cmp = (a.environment || '').localeCompare(b.environment || '');
          break;
        case 'timestamp':
        default: {
          const at = toDate(a.timestamp)?.getTime() ?? 0;
          const bt = toDate(b.timestamp)?.getTime() ?? 0;
          cmp = at - bt;
          break;
        }
      }
      return dir * cmp;
    });
    return list;
  }, [filteredMediaClicks, mediaClickSortBy, mediaClickSortDirection, toDate]);

  const setMediaClickSort = useCallback((field) => {
    setMediaClickSortBy((prev) => {
      if (prev === field) {
        setMediaClickSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setMediaClickSortDirection(field === 'timestamp' ? 'desc' : 'asc');
      return field;
    });
  }, []);

  const sortedEnquiries = useMemo(() => {
    const list = [...enquiries];
    const dir = enquirySortDirection === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      let cmp = 0;
      switch (enquirySortBy) {
        case 'name':
          cmp = (a.name || '').localeCompare(b.name || '');
          break;
        case 'status':
          cmp = (a.status || '').localeCompare(b.status || '');
          break;
        case 'timestamp':
        default: {
          const at = toDate(a.timestamp)?.getTime() ?? 0;
          const bt = toDate(b.timestamp)?.getTime() ?? 0;
          cmp = at - bt;
          break;
        }
      }
      return dir * cmp;
    });
    return list;
  }, [enquiries, enquirySortBy, enquirySortDirection, toDate]);

  const setEnquirySort = useCallback((field) => {
    setEnquirySortBy((prev) => {
      if (prev === field) {
        setEnquirySortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setEnquirySortDirection(field === 'timestamp' ? 'desc' : 'asc');
      return field;
    });
  }, []);

  const visitorsForCountryBreakdown = useMemo(() => {
    let filtered = visitorsForAnalytics;
    if (environmentFilter !== 'all') filtered = filtered.filter((v) => v.environment === environmentFilter);
    if (dateFilter) filtered = filtered.filter((v) => isDateInRange(v.lastVisit, dateFilter.start, dateFilter.end));
    return filtered;
  }, [visitorsForAnalytics, environmentFilter, dateFilter, isDateInRange]);

  const rollup = useMemo(() => parseRollupStats(stats), [stats]);

  const filteredStats = useMemo(() => {
    if (!stats) return null;
    const prodOnly = environmentFilter === 'production';
    const useDateScopedCounts = Boolean(dateFilter);

    const rawCounts = useDateScopedCounts
      ? computeRawCountsFromRecords({
          visitors: filteredVisitors,
          pageViews: filteredPageViews,
          events: filteredEvents,
          pageTimes: filteredPageTimes,
          mediaClicks: filteredMediaClicks,
        })
      : computeRawCountsFromRecords({
          visitors: visitorsForAnalytics,
          pageViews: pageViewsForAnalytics,
          events: eventsForAnalytics,
          pageTimes: pageTimesForAnalytics,
          mediaClicks: mediaClicksForAnalytics,
        });

    if (useDateScopedCounts) {
      const dailySum = sumDailyBucketsInRange(rollup.daily, dateFilter, prodOnly);
      if (dailySum) {
        if (environmentFilter === 'production') {
          rawCounts.totalVisitors = dailySum.visitors;
          rawCounts.totalPageViews = dailySum.pageViews;
          rawCounts.totalEvents = dailySum.events;
        } else if (environmentFilter !== 'localhost') {
          rawCounts.totalVisitors = Math.max(rawCounts.totalVisitors, dailySum.visitors);
          rawCounts.totalPageViews = Math.max(rawCounts.totalPageViews, dailySum.pageViews);
          rawCounts.totalEvents = Math.max(rawCounts.totalEvents, dailySum.events);
        }
      }
    }

    const merged = mergeHeadlineStats(
      useDateScopedCounts ? null : rollup,
      rawCounts,
      environmentFilter
    );
    const last24h = useDateScopedCounts ? null : getLast24hSummary(rollup.daily, prodOnly);
    const dailySumForRange = useDateScopedCounts
      ? sumDailyBucketsInRange(rollup.daily, dateFilter, prodOnly)
      : null;
    const rangeSummary = useDateScopedCounts
      ? {
          visitors: merged.totalVisitors,
          pageViews: merged.totalPageViews,
          refClicks: dailySumForRange?.refClicks ?? 0,
          sessionsEnded: dailySumForRange?.sessionsEnded ?? merged.totalPageTimes ?? 0,
        }
      : null;

    return {
      ...merged,
      last24h,
      rangeSummary,
      timeRangeLabel: getTimeRangeLabel(timeRange, dateRange, formatDateForInput),
      isDateFiltered: useDateScopedCounts,
      dataTruncated,
    };
  }, [
    stats,
    rollup,
    visitorsForAnalytics,
    pageViewsForAnalytics,
    eventsForAnalytics,
    pageTimesForAnalytics,
    mediaClicksForAnalytics,
    filteredVisitors,
    filteredPageViews,
    filteredEvents,
    filteredPageTimes,
    filteredMediaClicks,
    environmentFilter,
    dateFilter,
    timeRange,
    dateRange,
    formatDateForInput,
    dataTruncated,
  ]);

  const visitsOverTimeFromRollup = useMemo(() => {
    const productionOnly = environmentFilter === 'production';
    const series = dateFilter
      ? getDailySeriesInRange(rollup.daily, dateFilter, productionOnly)
      : getDailySeries(rollup.daily, { days: 30, productionOnly });
    if (series.length === 0) return null;
    return series.map((d) => ({ name: d.name, value: d.visitors || d.sessionsEnded || 0 }));
  }, [rollup.daily, environmentFilter, dateFilter]);

  const pageViewsOverTimeFromRollup = useMemo(() => {
    const productionOnly = environmentFilter === 'production';
    const series = dateFilter
      ? getDailySeriesInRange(rollup.daily, dateFilter, productionOnly)
      : getDailySeries(rollup.daily, { days: 30, productionOnly });
    if (series.length === 0) return null;
    return series.map((d) => ({ name: d.name, value: d.pageViews || 0 }));
  }, [rollup.daily, environmentFilter, dateFilter]);

  const visitorsByCountryFromRollup = useMemo(() => {
    if (dateFilter) return null;
    const dims = mapDimensionCounts(rollup.visitors, 'dim_country', environmentFilter === 'production');
    return dims.length > 0 ? dims : null;
  }, [rollup.visitors, environmentFilter, dateFilter]);

  const visitorsByDeviceFromRollup = useMemo(() => {
    if (dateFilter) return null;
    const dims = mapDimensionCounts(rollup.visitors, 'dim_device', environmentFilter === 'production');
    return dims.length > 0 ? dims : null;
  }, [rollup.visitors, environmentFilter, dateFilter]);

  const visitorsByCountry = useMemo(() => {
    // Prefer the enriched per-visitor location (resolved via IP geo lookup).
    const countryMap = {};
    visitorsForCountryBreakdown.forEach((v) => {
      const country = v.location?.country || 'Unknown';
      countryMap[country] = (countryMap[country] || 0) + 1;
    });
    const fromVisitors = Object.entries(countryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Use per-visitor data whenever it has any real (resolved) country. Fall
    // back to the rollup only if visitor docs carry no usable geo at all, since
    // older rollups may still hold the legacy "Unknown" placeholder counts.
    const hasResolvedCountry = fromVisitors.some((c) => c.name && c.name !== 'Unknown');
    if (fromVisitors.length && (hasResolvedCountry || !visitorsByCountryFromRollup?.length)) {
      return fromVisitors;
    }
    return visitorsByCountryFromRollup || fromVisitors;
  }, [visitorsForCountryBreakdown, visitorsByCountryFromRollup]);

  const matchVisitorByIP = useCallback(
    (item) => Boolean(selectedVisitorAnonymizedIP && item.anonymizedIP === selectedVisitorAnonymizedIP),
    [selectedVisitorAnonymizedIP]
  );

  const visitorActivityTimeline = useMemo(() => {
    if (!selectedVisitorAnonymizedIP) return [];
    const getTs = (item) => {
      const t = item.timestamp || item.startTime || item.endTime;
      return t ? toDate(t) : null;
    };
    const items = [];
    pageViewsForAnalytics.filter(matchVisitorByIP).forEach((pv) => items.push({ type: 'pageview', timestamp: getTs(pv), raw: pv }));
    eventsForAnalytics.filter(matchVisitorByIP).forEach((e) => items.push({ type: 'event', timestamp: getTs(e), raw: e }));
    pageTimesForAnalytics.filter(matchVisitorByIP).forEach((pt) => items.push({ type: 'pagetime', timestamp: getTs(pt), raw: pt }));
    mediaClicksForAnalytics.filter(matchVisitorByIP).forEach((mc) => items.push({ type: 'mediaclick', timestamp: getTs(mc), raw: mc }));
    return items
      .filter((i) => i.timestamp && !isNaN(i.timestamp.getTime()))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [
    selectedVisitorAnonymizedIP,
    matchVisitorByIP,
    pageViewsForAnalytics,
    eventsForAnalytics,
    pageTimesForAnalytics,
    mediaClicksForAnalytics,
    toDate,
  ]);

  const pageViewsOverTime = useMemo(() => {
    if (pageViewsOverTimeFromRollup?.length) return pageViewsOverTimeFromRollup;
    const dateMap = {};
    filteredPageViews.forEach((pv) => {
      const dateKey = formatDate(pv.timestamp).split(',')[0];
      dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
    });
    return Object.entries(dateMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => new Date(a.name) - new Date(b.name))
      .slice(-30);
  }, [filteredPageViews, pageViewsOverTimeFromRollup]);

  const eventsByCategory = useMemo(() => {
    const categoryMap = {};
    filteredEvents.forEach((e) => {
      const category = e.category || 'Unknown';
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });
    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredEvents]);

  const pageViewsByPath = useMemo(() => {
    const pathMap = {};
    filteredPageViews.forEach((pv) => {
      const path = canonicalizeAnalyticsPath(pv.path || 'Unknown');
      pathMap[path] = (pathMap[path] || 0) + 1;
    });
    return Object.entries(pathMap)
      .map(([path, value]) => ({
        name: getAnalyticsPathLabel(path),
        path,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredPageViews]);

  const visitsOverTime = useMemo(() => {
    if (visitsOverTimeFromRollup?.length) return visitsOverTimeFromRollup;
    const dateMap = {};
    filteredVisitors.forEach((v) => {
      if (v.sessions && Array.isArray(v.sessions)) {
        v.sessions.forEach((session) => {
          if (environmentFilter === 'all' || session.environment === environmentFilter) {
            const dateKey = formatDate(session.startTime).split(',')[0];
            dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
          }
        });
      }
    });
    return Object.entries(dateMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => new Date(a.name) - new Date(b.name))
      .slice(-30);
  }, [filteredVisitors, environmentFilter, visitsOverTimeFromRollup]);

  const visitorsByDevice = useMemo(() => {
    if (visitorsByDeviceFromRollup?.length) return visitorsByDeviceFromRollup;
    const deviceMap = {};
    filteredVisitors.forEach((v) => {
      const device = v.deviceInfo?.deviceType || 'Unknown';
      deviceMap[device] = (deviceMap[device] || 0) + 1;
    });
    return Object.entries(deviceMap).map(([name, value]) => ({ name, value }));
  }, [filteredVisitors, visitorsByDeviceFromRollup]);

  const averageTimeByPath = useMemo(() => {
    const pathMap = {};
    filteredPageTimes.forEach((pt) => {
      const path = canonicalizeAnalyticsPath(pt.path || 'Unknown');
      if (!pathMap[path]) pathMap[path] = { total: 0, count: 0, values: [] };
      const timeSpent = pt.timeSpent || 0;
      pathMap[path].total += timeSpent;
      pathMap[path].count += 1;
      pathMap[path].values.push(timeSpent);
    });
    return Object.entries(pathMap)
      .map(([path, data]) => ({
        name: getAnalyticsPathLabel(path),
        path,
        average: parseFloat(data.count > 0 ? (data.total / data.count).toFixed(1) : 0),
        total: data.total,
        count: data.count,
        max: data.values.length > 0 ? Math.max(...data.values) : 0,
        min: data.values.length > 0 ? Math.min(...data.values) : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredPageTimes]);

  const pageTimeSummary = useMemo(() => {
    const totalSeconds = filteredPageTimes.reduce((sum, pt) => sum + (pt.timeSpent || 0), 0);
    const sessions = filteredPageTimes.length;
    const avgPerSession = sessions > 0 ? totalSeconds / sessions : 0;
    return { totalSeconds, sessions, avgPerSession };
  }, [filteredPageTimes]);

  const timeSpentOverTime = useMemo(() => {
    const dateMap = {};
    filteredPageTimes.forEach((pt) => {
      const timeField = pt.startTime || pt.timestamp;
      if (!timeField) return;
      const date = formatDate(timeField);
      if (date === 'N/A') return;
      const dateKey = date.split(',')[0];
      if (!dateMap[dateKey]) dateMap[dateKey] = { total: 0, count: 0 };
      dateMap[dateKey].total += pt.timeSpent || 0;
      dateMap[dateKey].count += 1;
    });
    return Object.entries(dateMap)
      .map(([name, data]) => ({
        name,
        average: parseFloat(data.count > 0 ? (data.total / data.count).toFixed(1) : 0),
        total: data.total,
        count: data.count,
      }))
      .sort((a, b) => new Date(a.name) - new Date(b.name))
      .slice(-30);
  }, [filteredPageTimes]);

  const mediaClicksByProject = useMemo(() => {
    const projectMap = {};
    filteredMediaClicks.forEach((mc) => {
      const project = mc.projectPath || 'Unknown';
      projectMap[project] = (projectMap[project] || 0) + 1;
    });
    return Object.entries(projectMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredMediaClicks]);

  const mediaClicksByType = useMemo(() => {
    const typeMap = {};
    filteredMediaClicks.forEach((mc) => {
      const type = mc.mediaType || 'Unknown';
      typeMap[type] = (typeMap[type] || 0) + 1;
    });
    return Object.entries(typeMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredMediaClicks]);

  const mediaClicksOverTime = useMemo(() => {
    const dateMap = {};
    filteredMediaClicks.forEach((mc) => {
      const dateKey = formatDate(mc.timestamp).split(',')[0];
      dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
    });
    return Object.entries(dateMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => new Date(a.name) - new Date(b.name))
      .slice(-30);
  }, [filteredMediaClicks]);

  const topMediaClicks = useMemo(() => {
    const mediaMap = {};
    filteredMediaClicks.forEach((mc) => {
      const key = `${mc.mediaCaption || mc.mediaSrc || 'Unknown'}`;
      if (!mediaMap[key]) {
        mediaMap[key] = {
          caption: mc.mediaCaption || 'Unknown',
          src: mc.mediaSrc || 'Unknown',
          type: mc.mediaType || 'Unknown',
          projectPath: mc.projectPath || 'Unknown',
          count: 0,
        };
      }
      mediaMap[key].count += 1;
    });
    return Object.values(mediaMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredMediaClicks]);

  const filterCountsByEnvironment = useMemo(() => {
    const filterVisitorsByDate = (list) => {
      if (!dateFilter) return list;
      return list.filter((v) => isDateInRange(v.lastVisit, dateFilter.start, dateFilter.end));
    };
    const filterByTimestamp = (list) => {
      if (!dateFilter) return list;
      return list.filter((item) => isDateInRange(item.timestamp, dateFilter.start, dateFilter.end));
    };
    const v = filterVisitorsByDate(visitorsForAnalytics);
    const pv = filterByTimestamp(pageViewsForAnalytics);
    const ev = filterByTimestamp(eventsForAnalytics);
    return {
      all: { visitors: v.length, pageViews: pv.length, events: ev.length },
      production: {
        visitors: v.filter((x) => x.environment === 'production').length,
        pageViews: pv.filter((x) => x.environment === 'production').length,
        events: ev.filter((x) => x.environment === 'production').length,
      },
      localhost: {
        visitors: v.filter((x) => x.environment === 'localhost').length,
        pageViews: pv.filter((x) => x.environment === 'localhost').length,
        events: ev.filter((x) => x.environment === 'localhost').length,
      },
    };
  }, [visitorsForAnalytics, pageViewsForAnalytics, eventsForAnalytics, dateFilter, isDateInRange]);

  const trafficTrends = useMemo(
    () =>
      computeTrafficTrends({
        pageViews: pageViewsForAnalytics,
        events: eventsForAnalytics,
        pageTimes: pageTimesForAnalytics,
        mediaClicks: mediaClicksForAnalytics,
        visitors: visitorsForAnalytics,
        enquiries,
        trackingTokens,
        environmentFilter,
        toDate,
        dateFilter,
      }),
    [
      pageViewsForAnalytics,
      eventsForAnalytics,
      pageTimesForAnalytics,
      mediaClicksForAnalytics,
      visitorsForAnalytics,
      enquiries,
      trackingTokens,
      environmentFilter,
      toDate,
      dateFilter,
    ]
  );

  const handleDateRangeChange = useCallback((field, value) => {
    setDateRange((prev) => {
      const newRange = { ...prev, [field]: value || null };
      if (newRange.start && newRange.end && newRange.start > newRange.end) {
        if (field === 'start') newRange.end = null;
        else newRange.start = null;
      }
      return newRange;
    });
    if (value) setTimeRange('custom');
  }, []);

  const handleTimeRangeChange = useCallback((range) => {
    setTimeRange(range);
    if (range !== 'custom') setDateRange({ start: null, end: null });
  }, []);

  const toggleVisitorExpansion = useCallback((visitorId) => {
    setExpandedVisitors((prev) => {
      const next = new Set(prev);
      const isRemoving = next.has(visitorId);
      if (isRemoving) {
        next.delete(visitorId);
        setVisitorActiveTabs((t) => {
          const n = { ...t };
          delete n[visitorId];
          return n;
        });
      } else {
        next.add(visitorId);
        setVisitorActiveTabs((t) => ({ ...t, [visitorId]: 'visits' }));
      }
      return next;
    });
  }, []);

  const setVisitorTab = useCallback((visitorId, tabName) => {
    setVisitorActiveTabs((prev) => ({ ...prev, [visitorId]: tabName }));
  }, []);

  const getVisitorTab = useCallback((visitorId) => visitorActiveTabs[visitorId] || 'visits', [visitorActiveTabs]);

  const openVisitorActivity = useCallback((visitor) => {
    setSelectedVisitorAnonymizedIP(visitor.id || null);
    setActiveTab('visitor-activity');
  }, []);

  const generateUrl = useCallback(() => {
    const { baseUrl, landingPath, source, medium, campaign, term, content } = urlGeneratorData;
    if (!source) {
      setGeneratedUrl('');
      return;
    }
    const params = new URLSearchParams();
    if (source) params.append('utm_source', source);
    if (medium) params.append('utm_medium', medium);
    if (campaign) params.append('utm_campaign', campaign);
    if (term) params.append('utm_term', term);
    if (content) params.append('utm_content', content);
    const origin = (baseUrl || '').replace(/\/$/, '');
    const path = landingPath && landingPath !== '/' ? landingPath : '';
    setGeneratedUrl(`${origin}${path}?${params.toString()}`);
  }, [urlGeneratorData]);

  useEffect(() => {
    generateUrl();
  }, [urlGeneratorData, generateUrl]);

  const handleUrlGeneratorChange = useCallback((field, value) => {
    setUrlGeneratorData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const applyPreset = useCallback((preset) => {
    const presets = {
      linkedin: { source: 'linkedin', medium: 'social', campaign: 'profile', landingPath: '/career' },
      discord: { source: 'discord', medium: 'chat', campaign: 'networking', landingPath: '/' },
      whatsapp: { source: 'whatsapp', medium: 'message', campaign: 'sharing', landingPath: '/' },
      cv: { source: 'cv', medium: 'pdf', campaign: 'applications', landingPath: '/career' },
      github: { source: 'github', medium: 'profile', campaign: 'portfolio', landingPath: '/github' },
      twitter: { source: 'twitter', medium: 'social', campaign: 'profile', landingPath: '/' },
      email: { source: 'email-signature', medium: 'email', campaign: 'outreach', landingPath: '/contact' },
      instagram: { source: 'instagram', medium: 'social', campaign: 'bio', landingPath: '/' },
      career: { source: 'career', medium: 'site', campaign: 'portfolio', landingPath: '/career' },
    };
    const presetData = presets[preset];
    if (presetData) setUrlGeneratorData((prev) => ({ ...prev, ...presetData }));
  }, []);

  const createRefLink = useCallback(async () => {
    const { source, medium, campaign } = urlGeneratorData;
    if (!source?.trim()) {
      setRefUrlError('Source is required');
      setGeneratedRefUrl('');
      return;
    }
    setRefUrlError('');
    setRefUrlLoading(true);
    try {
      const { createTrackingToken } = await import('../../services/trackingTokenService');
      const { token } = await createTrackingToken({
        source: source.trim(),
        medium: medium?.trim() || null,
        campaign: campaign?.trim() || null,
      });
      const baseUrl = urlGeneratorData.baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
      const origin = baseUrl.replace(/\/$/, '');
      const pathPart =
        !urlGeneratorData.landingPath || urlGeneratorData.landingPath === '/'
          ? ''
          : urlGeneratorData.landingPath;
      setGeneratedRefUrl(`${origin}${pathPart}?ref=${token}`);
      loadTrackingTokens();
    } catch (err) {
      setRefUrlError(err?.message || 'Failed to create link');
      setGeneratedRefUrl('');
    } finally {
      setRefUrlLoading(false);
    }
  }, [urlGeneratorData, loadTrackingTokens]);

  const updateTrackingTokenHandler = useCallback(async (tokenId, attrs) => {
    try {
      const { updateTrackingToken } = await import('../../services/trackingTokenService');
      await updateTrackingToken(tokenId, attrs);
      await loadTrackingTokens();
    } catch (err) {
      throw err;
    }
  }, [loadTrackingTokens]);

  const deleteTrackingTokenHandler = useCallback(async (tokenId) => {
    try {
      const { deleteTrackingToken } = await import('../../services/trackingTokenService');
      await deleteTrackingToken(tokenId);
      await loadTrackingTokens();
    } catch (err) {
      throw err;
    }
  }, [loadTrackingTokens]);

  const copyToClipboard = useCallback(async () => {
    const toCopy = urlGeneratorMode === 'ref' ? generatedRefUrl : generatedUrl;
    if (toCopy) {
      try {
        await navigator.clipboard.writeText(toCopy);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  }, [urlGeneratorMode, generatedRefUrl, generatedUrl]);

  const resetUrlGenerator = useCallback(() => {
    setUrlGeneratorData({
      baseUrl: typeof window !== 'undefined' ? window.location.origin : '',
      landingPath: '/',
      source: '',
      medium: '',
      campaign: '',
      term: '',
      content: '',
    });
    setGeneratedUrl('');
    setGeneratedRefUrl('');
    setRefUrlError('');
  }, []);

  const getRefTokenDrillThrough = useCallback(
    (tokenId) => buildRefDrillData(tokenId, visitors, refHits),
    [visitors, refHits]
  );

  const getRefTokenAnalytics = useCallback(
    (tokenId, tokenMeta = {}) => {
      const base = buildRefTokenAnalytics(tokenId, visitors, refHits, tokenMeta);
      const rollupData = getRefTokenRollup(rollup.refTokens, tokenId);
      if (!rollupData) return base;
      return {
        ...base,
        summary: {
          ...base.summary,
          storedClicks: Math.max(base.summary.storedClicks, rollupData.clicks || 0),
          trackedVisits: Math.max(base.summary.trackedVisits, rollupData.sessions || base.summary.trackedVisits),
        },
        visitsOverTime:
          rollupData.visitsOverTime?.length > 0 ? rollupData.visitsOverTime : base.visitsOverTime,
      };
    },
    [visitors, refHits, rollup.refTokens]
  );

  const exportRefTokenCsv = useCallback(
    (tokenId, tokenMeta = {}) => {
      const { visitRows } = getRefTokenAnalytics(tokenId, tokenMeta);
      const header = ['When', 'Visitor IP', 'Location', 'Device', 'Environment', 'Referrer'];
      const rows = visitRows.map((r) => {
        const d = r.startTime?.toDate?.() || r.startTime;
        const when = d instanceof Date ? d.toISOString() : String(r.startTime || '');
        return [
          when,
          r.anonymizedIP,
          getLocationString(r.location),
          r.deviceType || '',
          r.environment || '',
          r.referrer || '',
        ];
      });
      const csv = [header, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ref-${tokenId}-visits.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [getRefTokenAnalytics]
  );

  return {
    // Data
    visitors,
    pageViews,
    events,
    pageTimes,
    mediaClicks,
    enquiries,
    stats,
    loading,
    loadData,
    // Filters & UI state
    activeTab,
    setActiveTab,
    expandedVisitors,
    visitorActiveTabs,
    selectedLocation,
    setSelectedLocation,
    environmentFilter,
    setEnvironmentFilter,
    excludeAdminPaths,
    setExcludeAdminPaths,
    hideBots,
    setHideBots,
    dateRange,
    setDateRange,
    timeRange,
    expandedCountries,
    setExpandedCountries,
    selectedCountry,
    setSelectedCountry,
    showUrlGenerator,
    setShowUrlGenerator,
    urlGeneratorData,
    urlGeneratorMode,
    setUrlGeneratorMode,
    generatedUrl,
    generatedRefUrl,
    refUrlLoading,
    refUrlError,
    createRefLink,
    copiedUrl,
    trackingTokens,
    trackingTokensLoading,
    trackingTokensError,
    loadTrackingTokens,
    updateTrackingToken: updateTrackingTokenHandler,
    deleteTrackingToken: deleteTrackingTokenHandler,
    getRefTokenDrillThrough,
    getRefTokenAnalytics,
    exportRefTokenCsv,
    rollup,
    selectedVisitorAnonymizedIP,
    setSelectedVisitorAnonymizedIP,
    // Filtered & computed
    filteredVisitors,
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
    sortedEnquiries,
    enquirySortBy,
    enquirySortDirection,
    setEnquirySort,
    visitorsForActivitySelector,
    visitorsForCountryBreakdown,
    visitorsByCountry,
    visitorsByDevice,
    pageViewsOverTime,
    pageViewsByPath,
    eventsByCategory,
    visitsOverTime,
    averageTimeByPath,
    pageTimeSummary,
    timeSpentOverTime,
    mediaClicksByProject,
    mediaClicksByType,
    mediaClicksOverTime,
    topMediaClicks,
    trafficTrends,
    filteredStats,
    filterCountsByEnvironment,
    dateFilter,
    visitorActivityTimeline,
    // Helpers
    formatDate,
    formatDuration,
    formatDateForInput,
    toDate,
    isDateInRange,
    handleDateRangeChange,
    handleTimeRangeChange,
    toggleVisitorExpansion,
    setVisitorTab,
    getVisitorTab,
    openVisitorActivity,
    handleUrlGeneratorChange,
    applyPreset,
    copyToClipboard,
    resetUrlGenerator,
    // Owner IP tagging & purge
    ownerTags,
    browserAnonymizedIP,
    tagVisitorAsOwner,
    tagCurrentBrowser,
    untagVisitorAsOwner,
    deleteVisitorAnalytics,
    deleteAnalyticsLoading,
    adminMessage,
    setAdminMessage,
    getVisitorKey,
    isOwnerVisitor,
  };
}
