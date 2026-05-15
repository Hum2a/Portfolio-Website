import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  increment, 
  arrayUnion, 
  serverTimestamp 
} from 'firebase/firestore';
import {
  trackVisitorStats,
  trackPageViewStats,
  trackPageTimeStats,
  trackEventStats,
  trackMediaClickStats,
  trackCampaignStats,
  trackEngagementStats,
  trackContactFormStats,
  trackScrollDepthStats,
} from './analyticsStatsUpdater';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { featureFlags, apiKeys } from '../utils/env';
import { db } from './firebase';

// Generate or retrieve session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Get or create visitor ID (stored in localStorage for returning visitors)
const getVisitorId = () => {
  let visitorId = localStorage.getItem('analytics_visitor_id');
  if (!visitorId) {
    visitorId = localStorage.getItem('visitorId');
  }
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem('analytics_visitor_id', visitorId);
  }
  localStorage.setItem('visitorId', visitorId);
  return visitorId;
};

// Keep session / visitor IDs aligned across trackVisitor and trackPageView
const ensureTrackingIds = () => {
  const visitorId = getVisitorId();
  const sessionId = getSessionId();
  sessionStorage.setItem('sessionId', sessionId);
  if (!sessionStorage.getItem('sessionStartTime')) {
    sessionStorage.setItem('sessionStartTime', new Date().toString());
  }
  return { visitorId, sessionId };
};

const fetchWithTimeout = async (url, ms = 2500) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
};

const resolveAnonymizedIP = async (visitorId) => {
  let anonymizedIP = localStorage.getItem('anonymizedIP');
  if (anonymizedIP) return { anonymizedIP, ipAddress: null };

  let ipAddress = null;
  try {
    const ipResponse = await fetchWithTimeout('https://api.ipify.org?format=json', 2500);
    const ipData = await ipResponse.json();
    if (ipData?.ip) {
      ipAddress = ipData.ip;
      const ipParts = ipAddress.split('.');
      if (ipParts.length === 4) {
        anonymizedIP = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.0`;
      }
    }
  } catch (error) {
    console.warn('IP lookup failed, using fallback visitor key.', error);
  }

  if (!anonymizedIP) {
    const fallbackHash = CryptoJS.SHA256(visitorId).toString().substring(0, 12);
    anonymizedIP = `anon_${fallbackHash}`;
  }

  localStorage.setItem('anonymizedIP', anonymizedIP);
  return { anonymizedIP, ipAddress };
};

// Anonymize IP address
const anonymizeIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    const ip = data.ip;
    
    // Only keep first two octets, hash the rest
    const parts = ip.split('.');
    if (parts.length === 4) {
      const anonymized = `${parts[0]}.${parts[1]}.**.**`;
      return anonymized;
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Detect environment (localhost vs production)
const getEnvironment = () => {
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || 
                      hostname === '127.0.0.1' || 
                      hostname === '0.0.0.0' ||
                      hostname === '[::1]' ||
                      hostname.startsWith('192.168.') ||
                      hostname.startsWith('10.') ||
                      hostname.startsWith('172.') ||
                      window.location.protocol === 'file:';
  
  return isLocalhost ? 'localhost' : 'production';
};

// Campaign attribution: ref token (DB) > UTM params > cookie (from previous ref visit) > direct source param
const getCampaignDataFromUtm = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const utmTerm = urlParams.get('utm_term');
  const utmContent = urlParams.get('utm_content');
  const customSource = urlParams.get('source');
  const source = utmSource || customSource || null;
  if (source) {
    return {
      source,
      medium: utmMedium || null,
      campaign: utmCampaign || null,
      term: utmTerm || null,
      content: utmContent || null,
      landingPage: window.location.pathname + window.location.search
    };
  }
  return null;
};

// Async: resolve campaign data (ref token lookup, cookie, UTM)
const getCampaignData = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const landingPage = window.location.pathname + window.location.search;

  // 1. Ref token (works with PDFs - short URL, DB lookup)
  const refToken = urlParams.get('ref');
  if (refToken) {
    try {
      const { lookupTrackingToken, setAttributionCookie, incrementTokenClicks, getAttributionFromCookie } = await import('./trackingTokenService');
      const tokenData = await lookupTrackingToken(refToken);
      if (tokenData) {
        setAttributionCookie({ ...tokenData, refToken: refToken.toLowerCase().trim() });
        return {
          source: tokenData.source,
          medium: tokenData.medium || null,
          campaign: tokenData.campaign || null,
          term: null,
          content: null,
          landingPage,
          refToken, // Store for drill-through (which IPs/sessions used this link)
        };
      }
    } catch (e) {
      console.warn('Token lookup failed:', e);
    }
  }

  // 2. UTM params (direct links)
  const utmData = getCampaignDataFromUtm();
  if (utmData) return utmData;

  // 3. Cookie (returning visitor - came via ref link before)
  try {
    const { getAttributionFromCookie } = await import('./trackingTokenService');
    const cookieData = getAttributionFromCookie();
    if (cookieData) {
      return {
        ...cookieData,
        term: null,
        content: null,
        landingPage,
        refToken: cookieData.refToken || null,
      };
    }
  } catch {
    // ignore
  }

  return null;
};

// Enhanced device info detection
const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const screenSize = `${window.innerWidth}x${window.innerHeight}`;
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const language = navigator.language;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const colorDepth = window.screen.colorDepth;
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Detect device type
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent);
  
  let deviceType = 'desktop';
  if (isTablet) deviceType = 'tablet';
  if (isMobile) deviceType = 'mobile';
  
  // Detect browser
  let browser = 'Unknown';
  let browserVersion = 'Unknown';
  
  if (userAgent.indexOf('Firefox') > -1) {
    browser = 'Firefox';
    browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)[1];
  } else if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edge') === -1 && userAgent.indexOf('Edg') === -1) {
    browser = 'Chrome';
    browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)[1];
  } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
    browser = 'Safari';
    browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('Edge') > -1 || userAgent.indexOf('Edg') > -1) {
    browser = 'Edge';
    browserVersion = userAgent.match(/Edge\/([0-9.]+)/)?.[1] || userAgent.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
    browser = 'Internet Explorer';
    browserVersion = userAgent.match(/(?:MSIE |rv:)([0-9.]+)/)[1];
  } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    browser = 'Opera';
    browserVersion = userAgent.match(/(?:Opera|OPR)\/([0-9.]+)/)[1];
  }
  
  // Detect OS
  let os = 'Unknown';
  let osVersion = 'Unknown';
  
  if (userAgent.indexOf('Windows') > -1) {
    os = 'Windows';
    osVersion = userAgent.match(/Windows NT ([0-9.]+)/)?.[1] || 'Unknown';
    // Map Windows NT version to common names
    if (osVersion === '10.0') osVersion = '10';
    else if (osVersion === '6.3') osVersion = '8.1';
    else if (osVersion === '6.2') osVersion = '8';
    else if (osVersion === '6.1') osVersion = '7';
    else if (osVersion === '6.0') osVersion = 'Vista';
    else if (osVersion === '5.1' || osVersion === '5.2') osVersion = 'XP';
  } else if (userAgent.indexOf('Mac') > -1) {
    os = 'macOS';
    osVersion = userAgent.match(/Mac OS X ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
  } else if (userAgent.indexOf('Android') > -1) {
    os = 'Android';
    osVersion = userAgent.match(/Android ([0-9.]+)/)?.[1] || 'Unknown';
  } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
    os = 'iOS';
    osVersion = userAgent.match(/OS ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
  } else if (userAgent.indexOf('Linux') > -1) {
    os = 'Linux';
  }
  
  // Connection info
  let connectionType = 'Unknown';
  let effectiveConnectionType = 'Unknown';
  
  if (navigator.connection) {
    connectionType = navigator.connection.type || 'Unknown';
    effectiveConnectionType = navigator.connection.effectiveType || 'Unknown';
  }
  
  return {
    userAgent,
    screenSize,
    screenResolution,
    language,
    timezone,
    colorDepth,
    pixelRatio,
    deviceType,
    browser,
    browserVersion,
    os,
    osVersion,
    connectionType,
    effectiveConnectionType,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack || window.doNotTrack || '0',
    online: navigator.onLine
  };
};

const defaultLocation = (deviceInfo) => ({
  city: 'Unknown',
  region: 'Unknown',
  country: 'Unknown',
  coordinates: ['0', '0'],
  timezone: deviceInfo?.timezone || 'Unknown',
  isp: 'Unknown',
});

// Resolve geo in the background so quick visits still get a session saved first
const enrichVisitorLocation = async (anonymizedIP, ipAddress, deviceInfo) => {
  let userLocation = defaultLocation(deviceInfo);

  if (!ipAddress) {
    try {
      const ipResponse = await fetchWithTimeout('https://api.ipify.org?format=json', 4000);
      const ipData = await ipResponse.json();
      ipAddress = ipData?.ip || null;
    } catch {
      return;
    }
  }

  if (!ipAddress) return;

  try {
    if (apiKeys.ipinfoToken && apiKeys.ipinfoToken !== 'YOUR_IPINFO_TOKEN' && apiKeys.ipinfoToken !== '') {
      const locationResponse = await fetch(`https://ipinfo.io/${ipAddress}/json?token=${apiKeys.ipinfoToken}`);
      if (locationResponse.ok) {
        const locationData = await locationResponse.json();
        if (locationData && !locationData.error) {
          userLocation = {
            city: locationData.city || 'Unknown',
            region: locationData.region || 'Unknown',
            country: locationData.country || 'Unknown',
            coordinates: locationData.loc ? locationData.loc.split(',') : ['0', '0'],
            timezone: locationData.timezone || deviceInfo.timezone,
            isp: locationData.org || 'Unknown',
          };
        }
      }
    }

    // BigDataCloud / ip-api.com are often 403 from browsers; use REACT_APP_IPINFO_TOKEN for geo.

    const visitorRef = doc(db, 'analytics_visitors', anonymizedIP);
    await updateDoc(visitorRef, {
      code: ipAddress,
      location: userLocation,
    });
  } catch (error) {
    console.warn('Location enrichment failed:', error);
  }
};

// Track visitor — save session immediately; enrich location afterward
const trackVisitor = async () => {
  try {
    const { visitorId, sessionId } = ensureTrackingIds();
    const { anonymizedIP, ipAddress } = await resolveAnonymizedIP(visitorId);
    const deviceInfo = getDeviceInfo();
    const timestamp = new Date();
    const environment = getEnvironment();
    const userLocation = defaultLocation(deviceInfo);

    const campaignData = await getCampaignData();

    const landingPath = window.location.pathname + window.location.search;
    sessionStorage.setItem('sessionLandingPath', landingPath);
    sessionStorage.setItem('sessionPageCount', '0');

    const sessionData = {
      sessionId,
      startTime: timestamp,
      referrer: document.referrer || 'direct',
      environment,
      landingPath,
      exitPath: window.location.pathname,
      pageCount: 1,
    };

    if (campaignData) {
      sessionData.campaign = campaignData;
      sessionStorage.setItem('campaignSource', campaignData.source);
      if (campaignData.refToken) {
        sessionStorage.setItem('sessionRefToken', campaignData.refToken);
      }
    }

    const visitorRef = doc(db, 'analytics_visitors', anonymizedIP);
    const docSnap = await getDoc(visitorRef);
    const isReturning = docSnap.exists();

    if (docSnap.exists()) {
      await updateDoc(visitorRef, {
        visitorId,
        code: ipAddress,
        anonymizedIP,
        lastVisit: timestamp,
        visits: increment(1),
        deviceInfo,
        location: userLocation,
        environment,
        sessions: arrayUnion(sessionData),
      });
    } else {
      await setDoc(visitorRef, {
        visitorId,
        code: ipAddress,
        anonymizedIP,
        firstVisit: timestamp,
        lastVisit: timestamp,
        visits: 1,
        deviceInfo,
        location: userLocation,
        environment,
        sessions: [sessionData],
      });
    }

    if (campaignData?.refToken) {
      const { recordRefAttribution } = await import('./trackingTokenService');
      recordRefAttribution(campaignData.refToken, {
        anonymizedIP,
        visitorId,
        sessionId,
        environment,
        landingPage: campaignData.landingPage,
      });
    }

    trackVisitorStats({ environment, isReturning, deviceInfo, location: userLocation });
    if (campaignData) trackCampaignStats(campaignData, environment);

    enrichVisitorLocation(anonymizedIP, ipAddress, deviceInfo).catch(() => {});

    return { visitorId, sessionId, anonymizedIP, deviceInfo, location: userLocation };
  } catch (error) {
    console.warn('trackVisitor failed:', error);
    return null;
  }
};

// Track page view
const trackPageView = async (path, title) => {
  try {
    const sessionId = getSessionId() || sessionStorage.getItem('sessionId');
    const visitorId = getVisitorId() || localStorage.getItem('visitorId');
    let anonymizedIP = localStorage.getItem('anonymizedIP');

    if (!anonymizedIP && visitorId) {
      const resolved = await resolveAnonymizedIP(visitorId);
      anonymizedIP = resolved.anonymizedIP;
    }

    if (!anonymizedIP) {
      anonymizedIP = await anonymizeIP();
      if (anonymizedIP) {
        localStorage.setItem('anonymizedIP', anonymizedIP);
      }
    }

    if (!sessionId || !visitorId) {
      return null;
    }
    
    // Ensure path and title are defined
    const currentPath = path || window.location.pathname;
    const currentTitle = title || document.title;
    const currentReferrer = document.referrer || null;
    const timestamp = new Date();
    
    // Detect environment
    const environment = getEnvironment();
    
    // Create a clean path ID (remove slashes and special characters)
    const pathId = currentPath.replace(/[^a-zA-Z0-9]/g, '_');
    
    // Create a unique document ID for this page view
    const pageViewId = `${pathId}_${Date.now()}_${sessionId}`;
    
    // Store page view start time for time tracking
    sessionStorage.setItem(`pageView_${currentPath}_start`, timestamp.getTime().toString());
    sessionStorage.setItem(`pageView_${currentPath}_id`, pageViewId);
    
    // Add page view to analytics_pageviews collection
    const pageViewsRef = collection(db, 'analytics_pageviews');
    await setDoc(doc(pageViewsRef, pageViewId), {
      visitorId,
      anonymizedIP,
      sessionId,
      path: currentPath,
      title: currentTitle,
      referrer: currentReferrer,
      timestamp,
      environment,
      timeSpent: 0, // Will be updated when page is left
      pageViewId // Store for updating time spent later
    });
    
    const pageCount = parseInt(sessionStorage.getItem('sessionPageCount') || '0', 10) + 1;
    sessionStorage.setItem('sessionPageCount', String(pageCount));

    trackPageViewStats(currentPath, environment);

    // Also update the visitor's document with this page view
    const visitorPageViewRef = doc(db, 'analytics_visitors', anonymizedIP, 'pageviews', pageViewId);
    await setDoc(visitorPageViewRef, {
      path: currentPath,
      title: currentTitle,
      timestamp,
      pageViewId
    });
    
    return pageViewId;
  } catch (error) {
    // Silent fail
    return null;
  }
};

// Track time spent on a page
const trackPageTime = async (path, pageViewId = null) => {
  try {
    const currentPath = path || window.location.pathname;
    const startTimeKey = `pageView_${currentPath}_start`;
    const pageViewIdKey = `pageView_${currentPath}_id`;
    
    const startTimeStr = sessionStorage.getItem(startTimeKey);
    const storedPageViewId = pageViewId || sessionStorage.getItem(pageViewIdKey);
    
    if (!startTimeStr || !storedPageViewId) {
      return;
    }
    
    const startTime = parseInt(startTimeStr, 10);
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - startTime) / 1000); // Time in seconds
    
    if (timeSpent < 0) {
      return;
    }
    
    const sessionId = getSessionId();
    const visitorId = getVisitorId();
    const anonymizedIP = localStorage.getItem('anonymizedIP');
    const environment = getEnvironment();
    
    if (!sessionId || !visitorId || !anonymizedIP) {
      return;
    }
    
    // Update the page view document with time spent
    const pageViewRef = doc(db, 'analytics_pageviews', storedPageViewId);
    await updateDoc(pageViewRef, {
      timeSpent,
      endTime: new Date(endTime),
      updatedAt: serverTimestamp()
    });
    
    // Also create/update a dedicated page time document for easier querying
    const timeDocId = `${storedPageViewId}_time`;
    const pageTimeRef = doc(db, 'analytics_page_times', timeDocId);
    await setDoc(pageTimeRef, {
      pageViewId: storedPageViewId,
      visitorId,
      anonymizedIP,
      sessionId,
      path: currentPath,
      timeSpent,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      timestamp: serverTimestamp(),
      environment
    }, { merge: true });
    
    if (timeSpent > 0) {
      trackPageTimeStats(currentPath, timeSpent, environment);
    }

    // Clean up session storage
    sessionStorage.removeItem(startTimeKey);
    sessionStorage.removeItem(pageViewIdKey);
    
  } catch (error) {
    // Silent fail
  }
};

// Track events (clicks, form submissions, etc.)
const trackEvent = async (category, action, label = null, value = null) => {
  try {
    const sessionId = getSessionId();
    if (!sessionId) {
      return;
    }
    
    // Ensure required fields are defined
    if (!category || !action) {
      return;
    }
    
    const timestamp = new Date();
    const currentPath = window.location.pathname;
    
    // Detect environment
    const environment = getEnvironment();
    
    const visitorId = getVisitorId();
    const anonymizedIP = localStorage.getItem('anonymizedIP');
    
    const eventData = {
      category,
      action,
      label,
      value,
      path: currentPath,
      timestamp,
      sessionId,
      visitorId,
      anonymizedIP,
      environment
    };
    
    // Add event to analytics_events collection
    const eventId = `${category}_${action}_${Date.now()}_${sessionId}`;
    const eventsRef = collection(db, 'analytics_events');
    await setDoc(doc(eventsRef, eventId), eventData);
    
    trackEventStats(category, action, environment);
  } catch (error) {
    // Silent fail
  }
};

// Track media clicks (images, videos) in project pages
const trackMediaClick = async (mediaType, mediaSrc, mediaCaption, projectPath) => {
  try {
    const sessionId = getSessionId();
    const visitorId = getVisitorId();
    const anonymizedIP = localStorage.getItem('anonymizedIP');
    
    if (!sessionId || !visitorId || !anonymizedIP) {
      return;
    }
    
    if (!mediaType || !mediaSrc) {
      return;
    }
    
    const timestamp = new Date();
    const currentPath = projectPath || window.location.pathname;
    const environment = getEnvironment();
    
    // Create a media click document
    const mediaClickId = `media_${Date.now()}_${sessionId}`;
    const mediaClicksRef = collection(db, 'analytics_media_clicks');
    
    await setDoc(doc(mediaClicksRef, mediaClickId), {
      visitorId,
      anonymizedIP,
      sessionId,
      mediaType, // 'image' or 'video'
      mediaSrc,
      mediaCaption: mediaCaption || null,
      projectPath: currentPath,
      timestamp,
      environment
    });
    
    trackMediaClickStats(currentPath, mediaType, environment);

    // Also track as a regular event for consistency
    await trackEvent('media', 'click', `${mediaType}: ${mediaCaption || mediaSrc}`, null);
    
  } catch (error) {
    // Silent fail
  }
};

// Track session duration when user leaves
const trackSessionEnd = async () => {
  try {
    const sessionId = getSessionId();
    if (!sessionId) {
      return;
    }
    
    // Track time spent on current page before ending session
    await trackPageTime();
    
    const sessionStartTime = sessionStorage.getItem('sessionStartTime');
    if (!sessionStartTime) {
      return;
    }
    
    const startTime = new Date(sessionStartTime);
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000; // duration in seconds
    
    if (duration < 1) {
      return;
    }
    
    const visitorId = getVisitorId();
    const anonymizedIP = localStorage.getItem('anonymizedIP');
    const environment = getEnvironment();
    const pageCount = parseInt(sessionStorage.getItem('sessionPageCount') || '1', 10);
    const landingPath = sessionStorage.getItem('sessionLandingPath') || window.location.pathname;
    const exitPath = window.location.pathname + window.location.search;
    const refToken = sessionStorage.getItem('sessionRefToken') || null;
    const campaignSource = sessionStorage.getItem('campaignSource') || null;

    const sessionRef = doc(db, 'analytics_sessions', sessionId);
    await setDoc(sessionRef, {
      sessionId,
      visitorId,
      anonymizedIP,
      startTime,
      endTime,
      duration,
      path: exitPath,
      landingPath,
      exitPath,
      pageCount,
      refToken,
      campaignSource,
      environment,
    }, { merge: true });

    trackEngagementStats({ duration, pageCount, environment });
  } catch (error) {
    // Silent fail
  }
};

// Initialize analytics
const initAnalytics = async () => {
  try {
    if (!featureFlags.enableAnalytics) {
      return null;
    }

    const visitorData = await trackVisitor();
    
    if (visitorData) {
      // Store session start time
      sessionStorage.setItem('sessionStartTime', new Date().toString());
      
      // Track initial page view
      await trackPageView();
      
      // Set up session end tracking
      window.addEventListener('beforeunload', trackSessionEnd);
    }
    
    return visitorData;
  } catch (error) {
    return null;
  }
};

// Export a complete analytics API
const firebaseAnalytics = {
  trackVisitor,
  trackPageView,
  trackPageTime,
  trackEvent,
  trackMediaClick,
  trackSessionEnd,
  initAnalytics
};

export default firebaseAnalytics;

export const trackContactSubmit = () => {
  trackEvent('contact', 'submit', window.location.pathname);
  trackContactFormStats('submit', getEnvironment());
};

export const trackContactFormStart = () => {
  trackEvent('contact', 'start', window.location.pathname);
  trackContactFormStats('start', getEnvironment());
};

export const trackScrollDepth = (depthPercent, pageName) => {
  trackEvent('engagement', 'scroll_depth', `${depthPercent}% - ${pageName}`);
  trackScrollDepthStats(depthPercent, window.location.pathname, getEnvironment());
};

export { trackVisitor, trackPageView, trackPageTime, trackEvent, trackMediaClick, trackSessionEnd, initAnalytics }; 