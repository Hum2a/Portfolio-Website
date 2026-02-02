import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../services/authService';
import Navbar from '../components/Navbar';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FaMapMarkerAlt, FaChevronDown, FaChevronUp, FaGlobe, FaFlag, FaEye } from 'react-icons/fa';
import '../styles/Traffic.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a'];

const Traffic = () => {
  const { user, role } = useAuth();
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
  const [visitorActiveTabs, setVisitorActiveTabs] = useState({}); // Track active tab for each visitor
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [environmentFilter, setEnvironmentFilter] = useState('all'); // 'all', 'localhost', 'production'
  const [dateRange, setDateRange] = useState({ start: null, end: null }); // Date range filter
  const [timeRange, setTimeRange] = useState('all'); // Quick time filter: 'all', 'today', '7d', '30d', '90d', 'custom'
  const [expandedCountries, setExpandedCountries] = useState(false); // Track if countries card is expanded
  const [selectedCountry, setSelectedCountry] = useState(null); // Filter by specific country
  
  // URL Generator states
  const [showUrlGenerator, setShowUrlGenerator] = useState(false);
  const [urlGeneratorData, setUrlGeneratorData] = useState({
    baseUrl: window.location.origin,
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: ''
  });
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Visitor activity (watch by anonymized IP so all historical data matches)
  const [selectedVisitorAnonymizedIP, setSelectedVisitorAnonymizedIP] = useState(null);

  useEffect(() => {
    if (role === 'humza') {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load all visitors (not limited for better analytics)
      const visitorsSnapshot = await getDocs(
        query(collection(db, 'analytics_visitors'), orderBy('lastVisit', 'desc'))
      );
      const visitorsData = visitorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVisitors(visitorsData);

      // Load all page views
      const pageViewsSnapshot = await getDocs(
        query(collection(db, 'analytics_pageviews'), orderBy('timestamp', 'desc'))
      );
      const pageViewsData = pageViewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPageViews(pageViewsData);

      // Load all events
      const eventsSnapshot = await getDocs(
        query(collection(db, 'analytics_events'), orderBy('timestamp', 'desc'))
      );
      const eventsData = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);

      // Load all page times
      const pageTimesSnapshot = await getDocs(
        query(collection(db, 'analytics_page_times'), orderBy('timestamp', 'desc'))
      );
      const pageTimesData = pageTimesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPageTimes(pageTimesData);

      // Load all media clicks
      const mediaClicksSnapshot = await getDocs(
        query(collection(db, 'analytics_media_clicks'), orderBy('timestamp', 'desc'))
      );
      const mediaClicksData = mediaClicksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMediaClicks(mediaClicksData);

      // Load all enquiries
      const enquiriesSnapshot = await getDocs(
        query(collection(db, 'enquiries'), orderBy('timestamp', 'desc'))
      );
      const enquiriesData = enquiriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEnquiries(enquiriesData);

      // Load stats
      const statsDoc = await getDocs(collection(db, 'analytics_stats'));
      const statsData = {};
      statsDoc.forEach(doc => {
        statsData[doc.id] = doc.data();
      });
      setStats(statsData);

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // URL Generator Functions
  const generateUrl = () => {
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
    
    const url = `${baseUrl}?${params.toString()}`;
    setGeneratedUrl(url);
  };

  const handleUrlGeneratorChange = (field, value) => {
    setUrlGeneratorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyPreset = (preset) => {
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
    if (presetData) {
      setUrlGeneratorData(prev => ({
        ...prev,
        ...presetData
      }));
    }
  };

  const copyToClipboard = async () => {
    if (generatedUrl) {
      try {
        await navigator.clipboard.writeText(generatedUrl);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const resetUrlGenerator = () => {
    setUrlGeneratorData({
      baseUrl: window.location.origin,
      source: '',
      medium: '',
      campaign: '',
      term: '',
      content: ''
    });
    setGeneratedUrl('');
  };

  // Trigger URL generation whenever data changes
  useEffect(() => {
    generateUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlGeneratorData]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleString();
      }
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleString();
    } catch (error) {
      return 'N/A';
    }
  };

  // Human-readable duration (e.g. "45s", "2m 30s", "1h 5m")
  const formatDuration = (totalSeconds) => {
    if (totalSeconds == null || totalSeconds < 0) return '0s';
    const s = Math.floor(totalSeconds);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const secs = s % 60;
    if (m < 60) return secs > 0 ? `${m}m ${secs}s` : `${m}m`;
    const h = Math.floor(m / 60);
    const mins = m % 60;
    if (mins > 0) return `${h}h ${mins}m`;
    return `${h}h`;
  };

  const toggleVisitorExpansion = (visitorId) => {
    const newExpanded = new Set(expandedVisitors);
    if (newExpanded.has(visitorId)) {
      newExpanded.delete(visitorId);
      // Remove tab state when collapsing
      const newTabs = { ...visitorActiveTabs };
      delete newTabs[visitorId];
      setVisitorActiveTabs(newTabs);
    } else {
      newExpanded.add(visitorId);
      // Set default tab to 'visits' when expanding
      setVisitorActiveTabs({ ...visitorActiveTabs, [visitorId]: 'visits' });
    }
    setExpandedVisitors(newExpanded);
  };

  const setVisitorTab = (visitorId, tabName) => {
    setVisitorActiveTabs({ ...visitorActiveTabs, [visitorId]: tabName });
  };

  const getVisitorTab = (visitorId) => {
    return visitorActiveTabs[visitorId] || 'visits';
  };

  const getLocationString = (location) => {
    if (!location) {
      return "Location unavailable";
    }
    if ((location.city === "Unknown" || !location.city) && (location.country === "Unknown" || !location.country)) {
      return "Location unavailable";
    }
    const parts = [];
    if (location.city && location.city !== "Unknown") parts.push(location.city);
    if (location.region && location.region !== "Unknown") parts.push(location.region);
    if (location.country && location.country !== "Unknown") parts.push(location.country);
    return parts.length > 0 ? parts.join(", ") : "Location unavailable";
  };

  const hasValidCoordinates = (location) => {
    if (!location || !location.coordinates) return false;
    const [lat, lon] = location.coordinates;
    return lat && lon && lat !== "0" && lon !== "0" && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lon));
  };

  const getGoogleMapsUrl = (location) => {
    if (!hasValidCoordinates(location)) {
      const locationStr = getLocationString(location).replace(/\s+/g, '+');
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationStr)}`;
    }
    const [lat, lon] = location.coordinates;
    return `https://www.google.com/maps?q=${lat},${lon}`;
  };

  // Helper function to convert Firestore timestamp to Date
  const toDate = useCallback((timestamp) => {
    if (!timestamp) return null;
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    return new Date(timestamp);
  }, []);

  // Helper function to check if date is within range
  // Handles cases where only start or only end date is provided
  const isDateInRange = useCallback((date, startDate, endDate) => {
    if (!date) return false;
    const checkDate = toDate(date);
    if (!checkDate || isNaN(checkDate.getTime())) return false;
    
    // If only start date is provided, filter everything from that date onwards
    if (startDate && !endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Start of day
      return checkDate >= start;
    }
    
    // If only end date is provided, filter everything up to that date
    if (!startDate && endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      return checkDate <= end;
    }
    
    // If both dates provided, check if within range
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Start of day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      return checkDate >= start && checkDate <= end;
    }
    
    // If no dates provided, include all
    return true;
  }, [toDate]);

  // Visitors for the Watch-visitor dropdown: no date filter so we can pick any visitor (including old ones)
  const visitorsForActivitySelector = useMemo(() => {
    let filtered = visitors;
    if (environmentFilter !== 'all') {
      filtered = filtered.filter(v => v.environment === environmentFilter);
    }
    if (selectedCountry && selectedCountry !== 'all') {
      filtered = filtered.filter(v => v.location?.country === selectedCountry);
    }
    return filtered.sort((a, b) => {
      const aTime = toDate(a.lastVisit)?.getTime() || 0;
      const bTime = toDate(b.lastVisit)?.getTime() || 0;
      return bTime - aTime;
    });
  }, [visitors, environmentFilter, selectedCountry, toDate]);

  // Filter data by environment, date range, and country
  const filteredVisitors = useMemo(() => {
    let filtered = visitors;
    
    // Filter by environment
    if (environmentFilter !== 'all') {
      filtered = filtered.filter(v => v.environment === environmentFilter);
    }
    
    // Filter by country
    if (selectedCountry && selectedCountry !== 'all') {
      filtered = filtered.filter(v => v.location?.country === selectedCountry);
    }
    
    // Filter by date range (using lastVisit)
    let dateFilter = null;
    if (timeRange === 'custom') {
      // For custom range, require at least one date, but can work with just start or just end
      if (dateRange.start || dateRange.end) {
        dateFilter = {
          start: dateRange.start ? new Date(dateRange.start + 'T00:00:00') : null,
          end: dateRange.end ? new Date(dateRange.end + 'T23:59:59') : null
        };
        // Validate: if both dates exist, ensure start is before end
        if (dateFilter.start && dateFilter.end && dateFilter.start > dateFilter.end) {
          dateFilter = null; // Invalid range, don't filter
        }
      }
    } else if (timeRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (timeRange) {
        case 'today':
          dateFilter = { start: today, end: now };
          break;
        case '7d':
          dateFilter = { start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), end: now };
          break;
        case '30d':
          dateFilter = { start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), end: now };
          break;
        case '90d':
          dateFilter = { start: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000), end: now };
          break;
        default:
          dateFilter = null;
      }
    }
    
    if (dateFilter) {
      filtered = filtered.filter(v => {
        // If only start date, filter everything after start
        // If only end date, filter everything before end
        // If both dates, filter within range
        return isDateInRange(v.lastVisit, dateFilter.start, dateFilter.end);
      });
    }
    
    return filtered;
  }, [visitors, environmentFilter, selectedCountry, timeRange, dateRange, isDateInRange]);

  const filteredPageViews = useMemo(() => {
    let filtered = pageViews;
    
    // Filter by environment
    if (environmentFilter !== 'all') {
      filtered = filtered.filter(pv => pv.environment === environmentFilter);
    }
    
    // Filter by date range
    let dateFilter = null;
    if (timeRange === 'custom') {
      if (dateRange.start || dateRange.end) {
        dateFilter = {
          start: dateRange.start ? new Date(dateRange.start + 'T00:00:00') : null,
          end: dateRange.end ? new Date(dateRange.end + 'T23:59:59') : null
        };
        // Validate: if both dates exist, ensure start is before end
        if (dateFilter.start && dateFilter.end && dateFilter.start > dateFilter.end) {
          dateFilter = null; // Invalid range, don't filter
        }
      }
    } else if (timeRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (timeRange) {
        case 'today':
          dateFilter = { start: today, end: now };
          break;
        case '7d':
          dateFilter = { start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), end: now };
          break;
        case '30d':
          dateFilter = { start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), end: now };
          break;
        case '90d':
          dateFilter = { start: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000), end: now };
          break;
        default:
          dateFilter = null;
      }
    }
    
    if (dateFilter) {
      filtered = filtered.filter(pv => isDateInRange(pv.timestamp, dateFilter.start, dateFilter.end));
    }
    
    return filtered;
  }, [pageViews, environmentFilter, timeRange, dateRange, isDateInRange]);

  const filteredEvents = useMemo(() => {
    let filtered = events;
    
    // Filter by environment
    if (environmentFilter !== 'all') {
      filtered = filtered.filter(e => e.environment === environmentFilter);
    }
    
    // Filter by date range
    let dateFilter = null;
    if (timeRange === 'custom') {
      if (dateRange.start || dateRange.end) {
        dateFilter = {
          start: dateRange.start ? new Date(dateRange.start + 'T00:00:00') : null,
          end: dateRange.end ? new Date(dateRange.end + 'T23:59:59') : null
        };
        // Validate: if both dates exist, ensure start is before end
        if (dateFilter.start && dateFilter.end && dateFilter.start > dateFilter.end) {
          dateFilter = null; // Invalid range, don't filter
        }
      }
    } else if (timeRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (timeRange) {
        case 'today':
          dateFilter = { start: today, end: now };
          break;
        case '7d':
          dateFilter = { start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), end: now };
          break;
        case '30d':
          dateFilter = { start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), end: now };
          break;
        case '90d':
          dateFilter = { start: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000), end: now };
          break;
        default:
          dateFilter = null;
      }
    }
    
    if (dateFilter) {
      filtered = filtered.filter(e => isDateInRange(e.timestamp, dateFilter.start, dateFilter.end));
    }
    
    return filtered;
  }, [events, environmentFilter, timeRange, dateRange, isDateInRange]);

  // Filter page times by environment and date range
  const filteredPageTimes = useMemo(() => {
    let filtered = pageTimes;
    
    // Filter by environment
    if (environmentFilter !== 'all') {
      filtered = filtered.filter(pt => pt.environment === environmentFilter);
    }
    
    // Filter by date range (using timestamp or startTime)
    let dateFilter = null;
    if (timeRange === 'custom') {
      if (dateRange.start || dateRange.end) {
        dateFilter = {
          start: dateRange.start ? new Date(dateRange.start + 'T00:00:00') : null,
          end: dateRange.end ? new Date(dateRange.end + 'T23:59:59') : null
        };
        if (dateFilter.start && dateFilter.end && dateFilter.start > dateFilter.end) {
          dateFilter = null;
        }
      }
    } else if (timeRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (timeRange) {
        case 'today':
          dateFilter = { start: today, end: now };
          break;
        case '7d':
          dateFilter = { start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), end: now };
          break;
        case '30d':
          dateFilter = { start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), end: now };
          break;
        case '90d':
          dateFilter = { start: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000), end: now };
          break;
        default:
          dateFilter = null;
      }
    }
    
    if (dateFilter) {
      filtered = filtered.filter(pt => {
        const checkDate = pt.startTime ? toDate(pt.startTime) : (pt.timestamp ? toDate(pt.timestamp) : null);
        if (!checkDate || isNaN(checkDate.getTime())) return false;
        return isDateInRange(checkDate, dateFilter.start, dateFilter.end);
      });
    }
    
    return filtered;
  }, [pageTimes, environmentFilter, timeRange, dateRange, isDateInRange, toDate]);

  // Filter media clicks by environment and date range
  const filteredMediaClicks = useMemo(() => {
    let filtered = mediaClicks;
    
    // Filter by environment
    if (environmentFilter !== 'all') {
      filtered = filtered.filter(mc => mc.environment === environmentFilter);
    }
    
    // Filter by date range (using timestamp)
    let dateFilter = null;
    if (timeRange === 'custom') {
      if (dateRange.start || dateRange.end) {
        dateFilter = {
          start: dateRange.start ? new Date(dateRange.start + 'T00:00:00') : null,
          end: dateRange.end ? new Date(dateRange.end + 'T23:59:59') : null
        };
        if (dateFilter.start && dateFilter.end && dateFilter.start > dateFilter.end) {
          dateFilter = null;
        }
      }
    } else if (timeRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (timeRange) {
        case 'today':
          dateFilter = { start: today, end: now };
          break;
        case '7d':
          dateFilter = { start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), end: now };
          break;
        case '30d':
          dateFilter = { start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), end: now };
          break;
        case '90d':
          dateFilter = { start: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000), end: now };
          break;
        default:
          dateFilter = null;
      }
    }
    
    if (dateFilter) {
      filtered = filtered.filter(mc => {
        const checkDate = mc.timestamp ? toDate(mc.timestamp) : null;
        if (!checkDate || isNaN(checkDate.getTime())) return false;
        return isDateInRange(checkDate, dateFilter.start, dateFilter.end);
      });
    }
    
    return filtered;
  }, [mediaClicks, environmentFilter, timeRange, dateRange, isDateInRange, toDate]);

  // Get visitors filtered by environment and date (but not country) for country breakdown
  const visitorsForCountryBreakdown = useMemo(() => {
    let filtered = visitors;
    
    // Filter by environment
    if (environmentFilter !== 'all') {
      filtered = filtered.filter(v => v.environment === environmentFilter);
    }
    
    // Filter by date range (using lastVisit)
    let dateFilter = null;
    if (timeRange === 'custom') {
      if (dateRange.start || dateRange.end) {
        dateFilter = {
          start: dateRange.start ? new Date(dateRange.start + 'T00:00:00') : null,
          end: dateRange.end ? new Date(dateRange.end + 'T23:59:59') : null
        };
        if (dateFilter.start && dateFilter.end && dateFilter.start > dateFilter.end) {
          dateFilter = null;
        }
      }
    } else if (timeRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (timeRange) {
        case 'today':
          dateFilter = { start: today, end: now };
          break;
        case '7d':
          dateFilter = { start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), end: now };
          break;
        case '30d':
          dateFilter = { start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), end: now };
          break;
        case '90d':
          dateFilter = { start: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000), end: now };
          break;
        default:
          dateFilter = null;
      }
    }
    
    if (dateFilter) {
      filtered = filtered.filter(v => isDateInRange(v.lastVisit, dateFilter.start, dateFilter.end));
    }
    
    return filtered;
  }, [visitors, environmentFilter, timeRange, dateRange, isDateInRange]);

  // Process data for charts using filtered data (including country filter)
  const visitorsByCountry = useMemo(() => {
    const countryMap = {};
    visitorsForCountryBreakdown.forEach(v => {
      const country = v.location?.country || "Unknown";
      countryMap[country] = (countryMap[country] || 0) + 1;
    });
    return Object.entries(countryMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [visitorsForCountryBreakdown]);

  const visitorsByDevice = useMemo(() => {
    const deviceMap = {};
    filteredVisitors.forEach(v => {
      const device = v.deviceInfo?.deviceType || "Unknown";
      deviceMap[device] = (deviceMap[device] || 0) + 1;
    });
    return Object.entries(deviceMap).map(([name, value]) => ({ name, value }));
  }, [filteredVisitors]);

  // Match visitor to analytics records by anonymizedIP (visitor.id = Firestore doc id = anonymizedIP).
  // This works for all historical data because every analytics record stores anonymizedIP;
  // visitorId can be missing or inconsistent for older visitors.
  const matchVisitorByIP = useCallback((item) => {
    return Boolean(selectedVisitorAnonymizedIP && item.anonymizedIP === selectedVisitorAnonymizedIP);
  }, [selectedVisitorAnonymizedIP]);

  // Build chronological activity timeline for the selected visitor (by anonymizedIP for full history)
  const visitorActivityTimeline = useMemo(() => {
    if (!selectedVisitorAnonymizedIP) return [];
    const getTs = (item) => {
      const t = item.timestamp || item.startTime || item.endTime;
      return t ? toDate(t) : null;
    };
    const items = [];
    pageViews.filter(matchVisitorByIP).forEach(pv => {
      items.push({ type: 'pageview', timestamp: getTs(pv), raw: pv });
    });
    events.filter(matchVisitorByIP).forEach(e => {
      items.push({ type: 'event', timestamp: getTs(e), raw: e });
    });
    pageTimes.filter(matchVisitorByIP).forEach(pt => {
      items.push({ type: 'pagetime', timestamp: getTs(pt), raw: pt });
    });
    mediaClicks.filter(matchVisitorByIP).forEach(mc => {
      items.push({ type: 'mediaclick', timestamp: getTs(mc), raw: mc });
    });
    return items
      .filter(i => i.timestamp && !isNaN(i.timestamp.getTime()))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [selectedVisitorAnonymizedIP, matchVisitorByIP, pageViews, events, pageTimes, mediaClicks, toDate]);

  const openVisitorActivity = useCallback((visitor) => {
    setSelectedVisitorAnonymizedIP(visitor.id || null);
    setActiveTab('visitor-activity');
  }, []);

  const pageViewsOverTime = useMemo(() => {
    const dateMap = {};
    filteredPageViews.forEach(pv => {
      const date = formatDate(pv.timestamp);
      const dateKey = date.split(',')[0]; // Get date part
      dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
    });
    return Object.entries(dateMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => new Date(a.name) - new Date(b.name))
      .slice(-30); // Last 30 days
  }, [filteredPageViews]);

  const eventsByCategory = useMemo(() => {
    const categoryMap = {};
    filteredEvents.forEach(e => {
      const category = e.category || "Unknown";
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredEvents]);

  const pageViewsByPath = useMemo(() => {
    const pathMap = {};
    filteredPageViews.forEach(pv => {
      const path = pv.path || "Unknown";
      pathMap[path] = (pathMap[path] || 0) + 1;
    });
    return Object.entries(pathMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 pages
  }, [filteredPageViews]);

  const visitsOverTime = useMemo(() => {
    const dateMap = {};
    filteredVisitors.forEach(v => {
      if (v.sessions && Array.isArray(v.sessions)) {
        v.sessions.forEach(session => {
          // Filter sessions by environment if not 'all'
          if (environmentFilter === 'all' || session.environment === environmentFilter) {
            const date = formatDate(session.startTime);
            const dateKey = date.split(',')[0];
            dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
          }
        });
      }
      // Also count based on lastVisit
      const date = formatDate(v.lastVisit);
      const dateKey = date.split(',')[0];
      dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
    });
    return Object.entries(dateMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => new Date(a.name) - new Date(b.name))
      .slice(-30);
  }, [filteredVisitors, environmentFilter]);

  // Chart data for page times (and time-by-page summary)
  const averageTimeByPath = useMemo(() => {
    const pathMap = {};
    filteredPageTimes.forEach(pt => {
      const path = pt.path || "Unknown";
      if (!pathMap[path]) {
        pathMap[path] = { total: 0, count: 0, values: [] };
      }
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
        min: data.values.length > 0 ? Math.min(...data.values) : 0
      }))
      .sort((a, b) => b.total - a.total); // All pages, sorted by total time (for summary table)
  }, [filteredPageTimes]);

  // Page time summary stats (for summary cards)
  const pageTimeSummary = useMemo(() => {
    const totalSeconds = filteredPageTimes.reduce((sum, pt) => sum + (pt.timeSpent || 0), 0);
    const sessions = filteredPageTimes.length;
    const avgPerSession = sessions > 0 ? totalSeconds / sessions : 0;
    return { totalSeconds, sessions, avgPerSession };
  }, [filteredPageTimes]);

  const timeSpentOverTime = useMemo(() => {
    const dateMap = {};
    filteredPageTimes.forEach(pt => {
      const timeField = pt.startTime || pt.timestamp;
      if (!timeField) return;
      const date = formatDate(timeField);
      if (date === 'N/A') return;
      const dateKey = date.split(',')[0];
      if (!dateMap[dateKey]) {
        dateMap[dateKey] = { total: 0, count: 0 };
      }
      dateMap[dateKey].total += (pt.timeSpent || 0);
      dateMap[dateKey].count += 1;
    });
    return Object.entries(dateMap)
      .map(([name, data]) => ({
        name,
        average: parseFloat(data.count > 0 ? (data.total / data.count).toFixed(1) : 0),
        total: data.total,
        count: data.count
      }))
      .sort((a, b) => new Date(a.name) - new Date(b.name))
      .slice(-30); // Last 30 days
  }, [filteredPageTimes]);

  // Chart data for media clicks
  const mediaClicksByProject = useMemo(() => {
    const projectMap = {};
    filteredMediaClicks.forEach(mc => {
      const project = mc.projectPath || "Unknown";
      projectMap[project] = (projectMap[project] || 0) + 1;
    });
    return Object.entries(projectMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 projects
  }, [filteredMediaClicks]);

  const mediaClicksByType = useMemo(() => {
    const typeMap = {};
    filteredMediaClicks.forEach(mc => {
      const type = mc.mediaType || "Unknown";
      typeMap[type] = (typeMap[type] || 0) + 1;
    });
    return Object.entries(typeMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredMediaClicks]);

  const mediaClicksOverTime = useMemo(() => {
    const dateMap = {};
    filteredMediaClicks.forEach(mc => {
      const date = formatDate(mc.timestamp);
      const dateKey = date.split(',')[0];
      dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
    });
    return Object.entries(dateMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => new Date(a.name) - new Date(b.name))
      .slice(-30); // Last 30 days
  }, [filteredMediaClicks]);

  const topMediaClicks = useMemo(() => {
    const mediaMap = {};
    filteredMediaClicks.forEach(mc => {
      const key = `${mc.mediaCaption || mc.mediaSrc || 'Unknown'}`;
      if (!mediaMap[key]) {
        mediaMap[key] = {
          caption: mc.mediaCaption || 'Unknown',
          src: mc.mediaSrc || 'Unknown',
          type: mc.mediaType || 'Unknown',
          projectPath: mc.projectPath || 'Unknown',
          count: 0
        };
      }
      mediaMap[key].count += 1;
    });
    return Object.values(mediaMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 media items
  }, [filteredMediaClicks]);

  // Calculate filtered stats
  const filteredStats = useMemo(() => {
    if (!stats) return null;
    
    const localhostVisitors = visitors.filter(v => v.environment === 'localhost').length;
    const productionVisitors = visitors.filter(v => v.environment === 'production').length;
    const localhostPageViews = pageViews.filter(pv => pv.environment === 'localhost').length;
    const productionPageViews = pageViews.filter(pv => pv.environment === 'production').length;
    const localhostEvents = events.filter(e => e.environment === 'localhost').length;
    const productionEvents = events.filter(e => e.environment === 'production').length;
    const localhostPageTimes = pageTimes.filter(pt => pt.environment === 'localhost').length;
    const productionPageTimes = pageTimes.filter(pt => pt.environment === 'production').length;
    const localhostMediaClicks = mediaClicks.filter(mc => mc.environment === 'localhost').length;
    const productionMediaClicks = mediaClicks.filter(mc => mc.environment === 'production').length;

    // Calculate average time spent
    const totalTimeSpent = filteredPageTimes.reduce((sum, pt) => sum + (pt.timeSpent || 0), 0);
    const avgTimeSpent = filteredPageTimes.length > 0 ? (totalTimeSpent / filteredPageTimes.length).toFixed(1) : 0;

    return {
      localhostVisitors,
      productionVisitors,
      localhostPageViews,
      productionPageViews,
      localhostEvents,
      productionEvents,
      localhostPageTimes,
      productionPageTimes,
      localhostMediaClicks,
      productionMediaClicks,
      totalVisitors: visitors.length,
      totalPageViews: pageViews.length,
      totalEvents: events.length,
      totalPageTimes: pageTimes.length,
      totalMediaClicks: mediaClicks.length,
      avgTimeSpent: parseFloat(avgTimeSpent),
      totalTimeSpent
    };
  }, [stats, visitors, pageViews, events, pageTimes, mediaClicks, filteredPageTimes]);

  // Format date for input field (YYYY-MM-DD)
  const formatDateForInput = (date) => {
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
  };

  // Handle date range change
  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => {
      const newRange = {
        ...prev,
        [field]: value ? value : null
      };
      
      // Validate that end date is not before start date
      if (newRange.start && newRange.end && newRange.start > newRange.end) {
        if (field === 'start') {
          // If start date is after end date, clear end date
          newRange.end = null;
        } else {
          // If end date is before start date, clear start date
          newRange.start = null;
        }
      }
      
      return newRange;
    });
    if (value) {
      setTimeRange('custom');
    }
  };

  // Handle quick time range selection
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    if (range !== 'custom') {
      setDateRange({ start: null, end: null });
    }
  };

  if (role !== 'humza') {
    return (
      <div className="traffic-container">
        <div className="traffic-error">
          <h2>Access Denied</h2>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="traffic-container">
      <Navbar />
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

      {/* URL Generator Section */}
      <div className="url-generator-section">
        <div className="url-generator-header" onClick={() => setShowUrlGenerator(!showUrlGenerator)}>
          <h2>🔗 Campaign URL Generator</h2>
          <span className="toggle-icon">{showUrlGenerator ? '▼' : '▶'}</span>
        </div>
        
        {showUrlGenerator && (
          <div className="url-generator-content">
            <p className="url-generator-description">
              Generate tracked URLs to identify traffic sources from different platforms.
            </p>
            
            {/* Quick Presets */}
            <div className="url-presets">
              <h3>Quick Presets:</h3>
              <div className="preset-buttons">
                <button className="preset-btn linkedin" onClick={() => applyPreset('linkedin')}>
                  LinkedIn
                </button>
                <button className="preset-btn discord" onClick={() => applyPreset('discord')}>
                  Discord
                </button>
                <button className="preset-btn whatsapp" onClick={() => applyPreset('whatsapp')}>
                  WhatsApp
                </button>
                <button className="preset-btn cv" onClick={() => applyPreset('cv')}>
                  CV/Resume
                </button>
                <button className="preset-btn github" onClick={() => applyPreset('github')}>
                  GitHub
                </button>
                <button className="preset-btn twitter" onClick={() => applyPreset('twitter')}>
                  Twitter/X
                </button>
                <button className="preset-btn email" onClick={() => applyPreset('email')}>
                  Email
                </button>
                <button className="preset-btn instagram" onClick={() => applyPreset('instagram')}>
                  Instagram
                </button>
              </div>
            </div>

            {/* URL Form */}
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
              </div>

              {/* Generated URL Display */}
              {generatedUrl && (
                <div className="generated-url-section">
                  <h3>Generated URL:</h3>
                  <div className="generated-url-display">
                    <input
                      type="text"
                      value={generatedUrl}
                      readOnly
                      className="generated-url-input"
                    />
                    <button 
                      className="copy-btn"
                      onClick={copyToClipboard}
                    >
                      {copiedUrl ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <div className="url-actions">
                    <button className="reset-btn" onClick={resetUrlGenerator}>
                      🔄 Reset
                    </button>
                    <a 
                      href={generatedUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="test-btn"
                    >
                      🔗 Test URL
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        {/* Environment Filter */}
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
              All ({visitors.length} visitors, {pageViews.length} page views, {events.length} events)
            </button>
            <button
              className={`filter-btn ${environmentFilter === 'production' ? 'active' : ''}`}
              onClick={() => setEnvironmentFilter('production')}
            >
              Production ({visitors.filter(v => v.environment === 'production').length} visitors, {pageViews.filter(pv => pv.environment === 'production').length} page views, {events.filter(e => e.environment === 'production').length} events)
            </button>
            <button
              className={`filter-btn ${environmentFilter === 'localhost' ? 'active' : ''}`}
              onClick={() => setEnvironmentFilter('localhost')}
            >
              Localhost ({visitors.filter(v => v.environment === 'localhost').length} visitors, {pageViews.filter(pv => pv.environment === 'localhost').length} page views, {events.filter(e => e.environment === 'localhost').length} events)
            </button>
          </div>
        </div>

        {/* Date & Time Filter */}
        <div className="date-time-filter">
          <div className="filter-header">
            <h3>Date & Time Range</h3>
            <span className="filter-subtitle">Filter data by date range</span>
          </div>
          <div className="time-range-controls">
            <div className="quick-filters">
              <button
                className={`time-filter-btn ${timeRange === 'all' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('all')}
              >
                All Time
              </button>
              <button
                className={`time-filter-btn ${timeRange === 'today' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('today')}
              >
                Today
              </button>
              <button
                className={`time-filter-btn ${timeRange === '7d' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('7d')}
              >
                Last 7 Days
              </button>
              <button
                className={`time-filter-btn ${timeRange === '30d' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('30d')}
              >
                Last 30 Days
              </button>
              <button
                className={`time-filter-btn ${timeRange === '90d' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('90d')}
              >
                Last 90 Days
              </button>
              <button
                className={`time-filter-btn ${timeRange === 'custom' ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange('custom')}
              >
                Custom Range
              </button>
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
                  <button
                    className="clear-date-btn"
                    onClick={() => setDateRange({ start: null, end: null })}
                  >
                    Clear Dates
                  </button>
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
                <span className="range-value">
                  {formatDateForInput(dateRange.start)} to {formatDateForInput(dateRange.end)}
                </span>
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

      {filteredStats && (
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
          <div 
            className={`stat-card countries-card ${expandedCountries ? 'expanded' : ''}`}
          >
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
                          ? `Filtered: ${selectedCountry} (${visitorsByCountry.find(c => c.name === selectedCountry)?.value || 0} visitors)`
                          : `${visitorsForCountryBreakdown.length} total visitors across ${visitorsByCountry.length} countries`
                        }
                      </span>
                    </div>
                    <div className="countries-tags">
                      {visitorsByCountry.map((country, index) => {
                        const percentage = visitorsForCountryBreakdown.length > 0 
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
                <span className="breakdown-item production">
                  Total: {filteredStats.totalTimeSpent || 0}s
                </span>
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
      )}

      <div className="traffic-tabs">
        <button
          className={`traffic-tab ${activeTab === 'visitors' ? 'active' : ''}`}
          onClick={() => setActiveTab('visitors')}
        >
          <span>Visitors ({filteredVisitors.length})</span>
          {selectedCountry && (
            <span className="filter-badge country-badge" title={`Filtered by: ${selectedCountry}`}>
              {selectedCountry}
            </span>
          )}
        </button>
        <button
          className={`traffic-tab ${activeTab === 'pageviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('pageviews')}
        >
          Page Views ({filteredPageViews.length})
        </button>
        <button
          className={`traffic-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events ({filteredEvents.length})
        </button>
        <button
          className={`traffic-tab ${activeTab === 'pagetimes' ? 'active' : ''}`}
          onClick={() => setActiveTab('pagetimes')}
        >
          Page Times ({filteredPageTimes.length})
        </button>
        <button
          className={`traffic-tab ${activeTab === 'mediaclicks' ? 'active' : ''}`}
          onClick={() => setActiveTab('mediaclicks')}
        >
          Media Clicks ({filteredMediaClicks.length})
        </button>
        <button
          className={`traffic-tab ${activeTab === 'enquiries' ? 'active' : ''}`}
          onClick={() => setActiveTab('enquiries')}
        >
          Enquiries ({enquiries.length})
        </button>
        <button
          className={`traffic-tab ${activeTab === 'visitor-activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('visitor-activity')}
        >
          <FaEye /> Watch visitor
        </button>
      </div>

      <div className="traffic-content">
        {loading ? (
          <div className="traffic-loading">Loading data...</div>
        ) : (
          <>
            {activeTab === 'visitors' && (
              <div className="traffic-tab-content">
                {/* Charts for Visitors */}
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

                {/* Map for Locations */}
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
                        ></iframe>
                      ) : (
                        <iframe
                          title="Location Map"
                          width="100%"
                          height="400"
                          frameBorder="0"
                          style={{ border: 0 }}
                          src={`https://www.google.com/maps?q=${encodeURIComponent(getLocationString(selectedLocation))}&output=embed`}
                          allowFullScreen
                        ></iframe>
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

                {/* Visitors Table */}
                <div className="traffic-table-container">
                  <table className="traffic-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>IP Address</th>
                        <th>Visits</th>
                        <th>Device Type</th>
                        <th>Browser</th>
                        <th>OS</th>
                        <th>Location</th>
                        <th>First Visit</th>
                        <th>Last Visit</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVisitors.map(visitor => (
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

                                  {/* Visit History Panel */}
                                  <div className={`expanded-panel panel-visits ${getVisitorTab(visitor.id) === 'visits' ? 'active' : ''}`}>
                                    <h4>Visit History ({visitor.sessions && Array.isArray(visitor.sessions) ? visitor.sessions.length : 0} sessions)</h4>
                                        {visitor.sessions && Array.isArray(visitor.sessions) && visitor.sessions.length > 0 ? (
                                      <div className="sessions-container">
                                        {visitor.sessions
                                          .filter(session => {
                                            // Filter sessions by environment if filter is active
                                            // If session doesn't have environment, include it for backward compatibility
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
                                                    <span className="detail-value campaign-badge source-badge">
                                                      {session.campaign.source}
                                                    </span>
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

                                  {/* Device Info Panel */}
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

                                  {/* Location Panel */}
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
                                            <button
                                              className="map-action-btn"
                                              onClick={() => setSelectedLocation(visitor.location)}
                                            >
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

                                  {/* Summary Panel */}
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

                                    {/* Raw Data View (Collapsible) */}
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
                {/* Charts for Page Views */}
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

                {/* Page Views Table */}
                <div className="traffic-table-container">
                  <table className="traffic-table">
                    <thead>
                      <tr>
                        <th>Path</th>
                        <th>Title</th>
                        <th>Referrer</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPageViews.map(pageView => (
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
                {/* Charts for Events */}
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

                {/* Events Table */}
                <div className="traffic-table-container">
                  <table className="traffic-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Action</th>
                        <th>Label</th>
                        <th>Path</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.map(event => (
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

                {/* Summary cards */}
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

                {/* Time by page summary table */}
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

                {/* Charts for Page Times */}
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
                        <Tooltip formatter={(value, name) => {
                          if (name === 'average') return [formatDuration(value), 'Avg per day'];
                          if (name === 'total') return [formatDuration(value), 'Total that day'];
                          return [value, name];
                        }} />
                        <Legend />
                        <Area type="monotone" dataKey="average" stroke="#43e97b" fill="#43e97b" fillOpacity={0.6} name="Avg per day" />
                        <Area type="monotone" dataKey="total" stroke="#38f9d7" fill="#38f9d7" fillOpacity={0.4} name="Total per day" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Raw page times table (individual visits) */}
                <div className="traffic-table-container">
                  <h3>Individual page visits (raw data)</h3>
                  <table className="traffic-table">
                    <thead>
                      <tr>
                        <th>Path</th>
                        <th>Duration</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Visitor (IP)</th>
                        <th>Env</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPageTimes.map(pageTime => (
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
                {/* Charts for Media Clicks */}
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

                {/* Media Clicks Table */}
                <div className="traffic-table-container">
                  <table className="traffic-table">
                    <thead>
                      <tr>
                        <th>Media Type</th>
                        <th>Caption/Title</th>
                        <th>Project Path</th>
                        <th>Media Source</th>
                        <th>Timestamp</th>
                        <th>Environment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMediaClicks.map(mediaClick => (
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

                {/* Top Media Clicks Summary */}
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
                  
                  {enquiries.length === 0 ? (
                    <div className="no-data-message">
                      <p>No enquiries yet.</p>
                    </div>
                  ) : (
                    <div className="enquiries-grid">
                      {enquiries.map(enquiry => (
                        <div key={enquiry.id} className="enquiry-card">
                          <div className="enquiry-header">
                            <div className="enquiry-meta">
                              <span className={`enquiry-status ${enquiry.status || 'new'}`}>
                                {enquiry.status || 'new'}
                              </span>
                              <span className="enquiry-date">
                                {formatDate(enquiry.timestamp)}
                              </span>
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
                      const visitor = visitorsForActivitySelector.find(v => v.id === val);
                      if (visitor) {
                        setSelectedVisitorAnonymizedIP(visitor.id);
                      }
                    }}
                  >
                    <option value="">— Select a visitor —</option>
                    {visitorsForActivitySelector.map(visitor => (
                      <option
                        key={visitor.id}
                        value={visitor.id}
                      >
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
        )}
      </div>
    </div>
  );
};

export default Traffic;
