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
import { FaMapMarkerAlt, FaChevronDown, FaChevronUp, FaGlobe, FaFlag } from 'react-icons/fa';
import '../styles/Traffic.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a'];

const Traffic = () => {
  const { user, role } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [pageViews, setPageViews] = useState([]);
  const [events, setEvents] = useState([]);
  const [pageTimes, setPageTimes] = useState([]);
  const [mediaClicks, setMediaClicks] = useState([]);
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

  // Chart data for page times
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
      .sort((a, b) => b.average - a.average)
      .slice(0, 10); // Top 10 pages by average time
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
                              {hasValidCoordinates(visitor.location) && (
                                <button
                                  className="map-btn"
                                  onClick={() => setSelectedLocation(visitor.location)}
                                  title="View on map"
                                >
                                  <FaMapMarkerAlt />
                                </button>
                              )}
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
              <div className="traffic-tab-content">
                {/* Charts for Page Times */}
                <div className="charts-grid">
                  <div className="chart-card full-width">
                    <h3>Average Time Spent by Page</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={averageTimeByPath} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" label={{ value: 'Average Time (seconds)', position: 'insideBottom', offset: -5 }} />
                        <YAxis dataKey="name" type="category" width={200} />
                        <Tooltip formatter={(value) => [`${value}s`, 'Average Time']} />
                        <Legend />
                        <Bar dataKey="average" fill="#43e97b">
                          {averageTimeByPath.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="chart-card full-width">
                    <h3>Time Spent Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={timeSpentOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis label={{ value: 'Time (seconds)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value, name) => {
                          if (name === 'average') return `${value}s (avg)`;
                          if (name === 'total') return `${value}s (total)`;
                          return value;
                        }} />
                        <Legend />
                        <Area type="monotone" dataKey="average" stroke="#43e97b" fill="#43e97b" fillOpacity={0.6} name="Average Time" />
                        <Area type="monotone" dataKey="total" stroke="#38f9d7" fill="#38f9d7" fillOpacity={0.4} name="Total Time" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Page Times Table */}
                <div className="traffic-table-container">
                  <table className="traffic-table">
                    <thead>
                      <tr>
                        <th>Path</th>
                        <th>Time Spent (seconds)</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Visitor ID</th>
                        <th>Environment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPageTimes.map(pageTime => (
                        <tr key={pageTime.id}>
                          <td>{pageTime.path || 'N/A'}</td>
                          <td>
                            <span className="time-badge">{pageTime.timeSpent || 0}s</span>
                          </td>
                          <td>{formatDate(pageTime.startTime)}</td>
                          <td>{formatDate(pageTime.endTime)}</td>
                          <td className="visitor-id-cell">{pageTime.visitorId || 'N/A'}</td>
                          <td>
                            <span className={`env-badge ${pageTime.environment === 'localhost' ? 'localhost' : 'production'}`}>
                              {pageTime.environment || 'unknown'}
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
              <div className="traffic-tab-content">
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
          </>
        )}
      </div>
    </div>
  );
};

export default Traffic;
