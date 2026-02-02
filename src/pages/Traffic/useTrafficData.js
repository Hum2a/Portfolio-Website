import { useState, useEffect, useMemo, useCallback } from 'react';
import { loadTrafficData as fetchTrafficData } from './loadTrafficData';
import { formatDate, formatDuration } from './utils';

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
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('visitors');
  const [expandedVisitors, setExpandedVisitors] = useState(new Set());
  const [visitorActiveTabs, setVisitorActiveTabs] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [environmentFilter, setEnvironmentFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [timeRange, setTimeRange] = useState('all');
  const [expandedCountries, setExpandedCountries] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showUrlGenerator, setShowUrlGenerator] = useState(false);
  const [urlGeneratorData, setUrlGeneratorData] = useState({
    baseUrl: typeof window !== 'undefined' ? window.location.origin : '',
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
  });
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedVisitorAnonymizedIP, setSelectedVisitorAnonymizedIP] = useState(null);

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
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === 'humza') loadData();
  }, [role, loadData]);

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

  const visitorsForActivitySelector = useMemo(() => {
    let filtered = visitors;
    if (environmentFilter !== 'all') filtered = filtered.filter((v) => v.environment === environmentFilter);
    if (selectedCountry && selectedCountry !== 'all') filtered = filtered.filter((v) => v.location?.country === selectedCountry);
    return filtered.sort((a, b) => {
      const aTime = toDate(a.lastVisit)?.getTime() || 0;
      const bTime = toDate(b.lastVisit)?.getTime() || 0;
      return bTime - aTime;
    });
  }, [visitors, environmentFilter, selectedCountry, toDate]);

  const filteredVisitors = useMemo(() => {
    let filtered = visitors;
    if (environmentFilter !== 'all') filtered = filtered.filter((v) => v.environment === environmentFilter);
    if (selectedCountry && selectedCountry !== 'all') filtered = filtered.filter((v) => v.location?.country === selectedCountry);
    if (dateFilter) filtered = filtered.filter((v) => isDateInRange(v.lastVisit, dateFilter.start, dateFilter.end));
    return filtered;
  }, [visitors, environmentFilter, selectedCountry, dateFilter, isDateInRange]);

  const filteredPageViews = useMemo(() => {
    let filtered = pageViews;
    if (environmentFilter !== 'all') filtered = filtered.filter((pv) => pv.environment === environmentFilter);
    if (dateFilter) filtered = filtered.filter((pv) => isDateInRange(pv.timestamp, dateFilter.start, dateFilter.end));
    return filtered;
  }, [pageViews, environmentFilter, dateFilter, isDateInRange]);

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (environmentFilter !== 'all') filtered = filtered.filter((e) => e.environment === environmentFilter);
    if (dateFilter) filtered = filtered.filter((e) => isDateInRange(e.timestamp, dateFilter.start, dateFilter.end));
    return filtered;
  }, [events, environmentFilter, dateFilter, isDateInRange]);

  const filteredPageTimes = useMemo(() => {
    let filtered = pageTimes;
    if (environmentFilter !== 'all') filtered = filtered.filter((pt) => pt.environment === environmentFilter);
    if (dateFilter) {
      filtered = filtered.filter((pt) => {
        const checkDate = pt.startTime ? toDate(pt.startTime) : pt.timestamp ? toDate(pt.timestamp) : null;
        if (!checkDate || isNaN(checkDate.getTime())) return false;
        return isDateInRange(checkDate, dateFilter.start, dateFilter.end);
      });
    }
    return filtered;
  }, [pageTimes, environmentFilter, dateFilter, isDateInRange, toDate]);

  const filteredMediaClicks = useMemo(() => {
    let filtered = mediaClicks;
    if (environmentFilter !== 'all') filtered = filtered.filter((mc) => mc.environment === environmentFilter);
    if (dateFilter) {
      filtered = filtered.filter((mc) => {
        const checkDate = mc.timestamp ? toDate(mc.timestamp) : null;
        if (!checkDate || isNaN(checkDate.getTime())) return false;
        return isDateInRange(checkDate, dateFilter.start, dateFilter.end);
      });
    }
    return filtered;
  }, [mediaClicks, environmentFilter, dateFilter, isDateInRange, toDate]);

  const visitorsForCountryBreakdown = useMemo(() => {
    let filtered = visitors;
    if (environmentFilter !== 'all') filtered = filtered.filter((v) => v.environment === environmentFilter);
    if (dateFilter) filtered = filtered.filter((v) => isDateInRange(v.lastVisit, dateFilter.start, dateFilter.end));
    return filtered;
  }, [visitors, environmentFilter, dateFilter, isDateInRange]);

  const visitorsByCountry = useMemo(() => {
    const countryMap = {};
    visitorsForCountryBreakdown.forEach((v) => {
      const country = v.location?.country || 'Unknown';
      countryMap[country] = (countryMap[country] || 0) + 1;
    });
    return Object.entries(countryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [visitorsForCountryBreakdown]);

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
    pageViews.filter(matchVisitorByIP).forEach((pv) => items.push({ type: 'pageview', timestamp: getTs(pv), raw: pv }));
    events.filter(matchVisitorByIP).forEach((e) => items.push({ type: 'event', timestamp: getTs(e), raw: e }));
    pageTimes.filter(matchVisitorByIP).forEach((pt) => items.push({ type: 'pagetime', timestamp: getTs(pt), raw: pt }));
    mediaClicks.filter(matchVisitorByIP).forEach((mc) => items.push({ type: 'mediaclick', timestamp: getTs(mc), raw: mc }));
    return items
      .filter((i) => i.timestamp && !isNaN(i.timestamp.getTime()))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [selectedVisitorAnonymizedIP, matchVisitorByIP, pageViews, events, pageTimes, mediaClicks, toDate]);

  const pageViewsOverTime = useMemo(() => {
    const dateMap = {};
    filteredPageViews.forEach((pv) => {
      const dateKey = formatDate(pv.timestamp).split(',')[0];
      dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
    });
    return Object.entries(dateMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => new Date(a.name) - new Date(b.name))
      .slice(-30);
  }, [filteredPageViews]);

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
      const path = pv.path || 'Unknown';
      pathMap[path] = (pathMap[path] || 0) + 1;
    });
    return Object.entries(pathMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredPageViews]);

  const visitsOverTime = useMemo(() => {
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
      const dateKey = formatDate(v.lastVisit).split(',')[0];
      dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
    });
    return Object.entries(dateMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => new Date(a.name) - new Date(b.name))
      .slice(-30);
  }, [filteredVisitors, environmentFilter]);

  const visitorsByDevice = useMemo(() => {
    const deviceMap = {};
    filteredVisitors.forEach((v) => {
      const device = v.deviceInfo?.deviceType || 'Unknown';
      deviceMap[device] = (deviceMap[device] || 0) + 1;
    });
    return Object.entries(deviceMap).map(([name, value]) => ({ name, value }));
  }, [filteredVisitors]);

  const averageTimeByPath = useMemo(() => {
    const pathMap = {};
    filteredPageTimes.forEach((pt) => {
      const path = pt.path || 'Unknown';
      if (!pathMap[path]) pathMap[path] = { total: 0, count: 0, values: [] };
      const timeSpent = pt.timeSpent || 0;
      pathMap[path].total += timeSpent;
      pathMap[path].count += 1;
      pathMap[path].values.push(timeSpent);
    });
    return Object.entries(pathMap)
      .map(([name, data]) => ({
        name,
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

  const filteredStats = useMemo(() => {
    if (!stats) return null;
    const totalTimeSpent = filteredPageTimes.reduce((sum, pt) => sum + (pt.timeSpent || 0), 0);
    const avgTimeSpent = filteredPageTimes.length > 0 ? (totalTimeSpent / filteredPageTimes.length).toFixed(1) : 0;
    return {
      localhostVisitors: visitors.filter((v) => v.environment === 'localhost').length,
      productionVisitors: visitors.filter((v) => v.environment === 'production').length,
      localhostPageViews: pageViews.filter((pv) => pv.environment === 'localhost').length,
      productionPageViews: pageViews.filter((pv) => pv.environment === 'production').length,
      localhostEvents: events.filter((e) => e.environment === 'localhost').length,
      productionEvents: events.filter((e) => e.environment === 'production').length,
      localhostPageTimes: pageTimes.filter((pt) => pt.environment === 'localhost').length,
      productionPageTimes: pageTimes.filter((pt) => pt.environment === 'production').length,
      localhostMediaClicks: mediaClicks.filter((mc) => mc.environment === 'localhost').length,
      productionMediaClicks: mediaClicks.filter((mc) => mc.environment === 'production').length,
      totalVisitors: visitors.length,
      totalPageViews: pageViews.length,
      totalEvents: events.length,
      totalPageTimes: pageTimes.length,
      totalMediaClicks: mediaClicks.length,
      avgTimeSpent: parseFloat(avgTimeSpent),
      totalTimeSpent,
    };
  }, [stats, visitors, pageViews, events, pageTimes, mediaClicks, filteredPageTimes]);

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
    const { baseUrl, source, medium, campaign, term, content } = urlGeneratorData;
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
    setGeneratedUrl(`${baseUrl}?${params.toString()}`);
  }, [urlGeneratorData]);

  useEffect(() => {
    generateUrl();
  }, [urlGeneratorData, generateUrl]);

  const handleUrlGeneratorChange = useCallback((field, value) => {
    setUrlGeneratorData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const applyPreset = useCallback((preset) => {
    const presets = {
      linkedin: { source: 'linkedin', medium: 'social', campaign: 'profile' },
      discord: { source: 'discord', medium: 'chat', campaign: 'networking' },
      whatsapp: { source: 'whatsapp', medium: 'message', campaign: 'sharing' },
      cv: { source: 'cv', medium: 'pdf', campaign: 'applications' },
      github: { source: 'github', medium: 'profile', campaign: 'portfolio' },
      twitter: { source: 'twitter', medium: 'social', campaign: 'profile' },
      email: { source: 'email-signature', medium: 'email', campaign: 'outreach' },
      instagram: { source: 'instagram', medium: 'social', campaign: 'bio' },
    };
    const presetData = presets[preset];
    if (presetData) setUrlGeneratorData((prev) => ({ ...prev, ...presetData }));
  }, []);

  const copyToClipboard = useCallback(async () => {
    if (generatedUrl) {
      try {
        await navigator.clipboard.writeText(generatedUrl);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  }, [generatedUrl]);

  const resetUrlGenerator = useCallback(() => {
    setUrlGeneratorData({
      baseUrl: typeof window !== 'undefined' ? window.location.origin : '',
      source: '',
      medium: '',
      campaign: '',
      term: '',
      content: '',
    });
    setGeneratedUrl('');
  }, []);

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
    generatedUrl,
    copiedUrl,
    selectedVisitorAnonymizedIP,
    setSelectedVisitorAnonymizedIP,
    // Filtered & computed
    filteredVisitors,
    filteredPageViews,
    filteredEvents,
    filteredPageTimes,
    filteredMediaClicks,
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
    filteredStats,
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
  };
}
