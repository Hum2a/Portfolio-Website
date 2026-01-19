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
    visitorId = uuidv4();
    localStorage.setItem('analytics_visitor_id', visitorId);
  }
  return visitorId;
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

// Extract campaign parameters from URL
const getCampaignData = () => {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check for UTM parameters (standard)
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const utmTerm = urlParams.get('utm_term');
  const utmContent = urlParams.get('utm_content');
  
  // Check for custom source parameter (fallback)
  const customSource = urlParams.get('source') || urlParams.get('ref');
  
  // Determine the source
  const source = utmSource || customSource || null;
  
  // Only return campaign data if we have at least a source
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

// Track visitor
const trackVisitor = async () => {
  try {
    // Get IP address
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const ipAddress = ipData.ip;
    
    // Anonymize IP by removing last octet
    const ipParts = ipAddress.split('.');
    const anonymizedIP = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.0`;
    
    // Store anonymizedIP in localStorage for use in other functions
    localStorage.setItem('anonymizedIP', anonymizedIP);
    
    // Generate visitor ID if not exists
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = uuidv4();
      localStorage.setItem('visitorId', visitorId);
    }
    
    // Generate session ID
    const sessionId = uuidv4();
    sessionStorage.setItem('sessionId', sessionId);
    
    // Get enhanced device info
    const deviceInfo = getDeviceInfo();
    
    // Use a try/catch block for geolocation to prevent failures
    let userLocation = {
      city: "Unknown",
      region: "Unknown",
      country: "Unknown",
      coordinates: ["0", "0"],
      timezone: deviceInfo.timezone,
      isp: "Unknown"
    };
    
    try {
      // Try to get location from IPInfo if API token is available
      if (apiKeys.ipinfoToken && apiKeys.ipinfoToken !== 'YOUR_IPINFO_TOKEN' && apiKeys.ipinfoToken !== '') {
        const locationResponse = await fetch(`https://ipinfo.io/${ipAddress}/json?token=${apiKeys.ipinfoToken}`);
        if (locationResponse.ok) {
          const locationData = await locationResponse.json();
          
          // Extract location details
          if (locationData && !locationData.error) {
            userLocation = {
              city: locationData.city || "Unknown",
              region: locationData.region || "Unknown",
              country: locationData.country || "Unknown",
              coordinates: locationData.loc ? locationData.loc.split(",") : ["0", "0"],
              timezone: locationData.timezone || deviceInfo.timezone,
              isp: locationData.org || "Unknown"
            };
          }
        }
      }
      
      // Fallback to free IP geolocation API if IPInfo not available or failed
      if (userLocation.city === "Unknown" && userLocation.country === "Unknown") {
        try {
          // Try bigdatacloud.net first (more reliable, no rate limits for basic use)
          const bigDataResponse = await fetch(`https://api.bigdatacloud.net/data/ip-geolocation?ip=${ipAddress}`);
          if (bigDataResponse.ok) {
            const bigDataData = await bigDataResponse.json();
            if (bigDataData && !bigDataData.error) {
              userLocation = {
                city: bigDataData.location?.city || bigDataData.location?.locality || "Unknown",
                region: bigDataData.location?.principalSubdivision || "Unknown",
                country: bigDataData.location?.country?.name || bigDataData.country?.name || "Unknown",
                coordinates: bigDataData.location?.latitude && bigDataData.location?.longitude
                  ? [bigDataData.location.latitude.toString(), bigDataData.location.longitude.toString()]
                  : ["0", "0"],
                timezone: bigDataData.location?.timeZone?.name || deviceInfo.timezone,
                isp: bigDataData.network?.organization || "Unknown"
              };
            }
          }
        } catch (bigDataError) {
          console.log('BigDataCloud IP geolocation failed, trying ip-api.com...');
        }
      }
      
      // Try ip-api.com as another fallback (may have rate limits/403 errors)
      if (userLocation.city === "Unknown" && userLocation.country === "Unknown") {
        try {
          const freeApiResponse = await fetch(`https://ip-api.com/json/${ipAddress}?fields=status,country,regionName,city,lat,lon,timezone,isp,query`);
          if (freeApiResponse.ok && freeApiResponse.status === 200) {
            const freeApiData = await freeApiResponse.json();
            if (freeApiData && freeApiData.status === 'success') {
              userLocation = {
                city: freeApiData.city || "Unknown",
                region: freeApiData.regionName || "Unknown",
                country: freeApiData.country || "Unknown",
                coordinates: freeApiData.lat && freeApiData.lon 
                  ? [freeApiData.lat.toString(), freeApiData.lon.toString()] 
                  : ["0", "0"],
                timezone: freeApiData.timezone || deviceInfo.timezone,
                isp: freeApiData.isp || "Unknown"
              };
            }
          } else if (freeApiResponse.status === 403) {
            console.log('ip-api.com returned 403 (rate limited or forbidden), using browser geolocation fallback...');
          }
        } catch (freeApiError) {
          console.log('ip-api.com failed, trying browser geolocation...');
        }
      }
      
      // Final fallback to browser geolocation if all IP-based methods failed
      if (userLocation.coordinates[0] === "0" && userLocation.coordinates[1] === "0" && navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 60000 // Cache for 1 minute
            });
          });
          
          userLocation = {
            ...userLocation,
            coordinates: [position.coords.latitude.toString(), position.coords.longitude.toString()]
          };
          
          // Try to reverse geocode if we have coordinates but no city/country
          if (userLocation.city === "Unknown" && position.coords.latitude && position.coords.longitude) {
            try {
              const reverseGeoResponse = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
              );
              if (reverseGeoResponse.ok) {
                const reverseGeoData = await reverseGeoResponse.json();
                if (reverseGeoData) {
                  userLocation.city = reverseGeoData.city || userLocation.city;
                  userLocation.region = reverseGeoData.principalSubdivision || userLocation.region;
                  userLocation.country = reverseGeoData.countryName || userLocation.country;
                }
              }
            } catch (reverseGeoError) {
              // Silently fail - we have coordinates at least
            }
          }
        } catch (geoError) {
          // Silently fail - use IP-based data or defaults
        }
      }
    } catch (error) {
      console.error('Error getting location data:', error);
      // Keep default location data
    }
    
    // Current timestamp
    const timestamp = new Date();
    
    // Detect environment
    const environment = getEnvironment();
    
    // Get campaign data from URL parameters
    const campaignData = getCampaignData();
    
    // Build session object
    const sessionData = {
      sessionId,
      startTime: timestamp,
      referrer: document.referrer || 'direct',
      environment, // Include environment in session
    };
    
    // Add campaign data if available
    if (campaignData) {
      sessionData.campaign = campaignData;
      // Store campaign source in sessionStorage for later use
      sessionStorage.setItem('campaignSource', campaignData.source);
    }
    
    // Use anonymizedIP as the document ID, but include environment in data
    const visitorRef = doc(db, 'analytics_visitors', anonymizedIP);
    
    // Get the current document to check if it exists
    const docSnap = await getDoc(visitorRef);
    
    if (docSnap.exists()) {
      // Update existing visitor document
      await updateDoc(visitorRef, {
        visitorId,
        code: ipAddress,
        anonymizedIP,
        lastVisit: timestamp,
        visits: increment(1),
        deviceInfo,
        location: userLocation,
        environment, // Add environment field
        sessions: arrayUnion(sessionData)
      });
    } else {
      // Create new visitor document with initial visit count of 1
      await setDoc(visitorRef, {
        visitorId,
        code: ipAddress,
        anonymizedIP,
        firstVisit: timestamp,
        lastVisit: timestamp,
        visits: 1,
        deviceInfo,
        location: userLocation,
        environment, // Add environment field
        sessions: [sessionData]
      });
    }
    
    // Update total visitor count
    const statsRef = doc(db, 'analytics_stats', 'visitors');
    await setDoc(statsRef, {
      total: increment(1),
      lastUpdated: timestamp
    }, { merge: true });
    
    return { visitorId, sessionId, anonymizedIP, deviceInfo, location: userLocation };
  } catch (error) {
    return null;
  }
};

// Track page view
const trackPageView = async (path, title) => {
  try {
    const sessionId = getSessionId();
    const visitorId = getVisitorId();
    // Get anonymizedIP from localStorage (set by trackVisitor during init)
    let anonymizedIP = localStorage.getItem('anonymizedIP');
    
    // If not available, try to get it (fallback)
    if (!anonymizedIP) {
      anonymizedIP = await anonymizeIP();
      if (anonymizedIP) {
        localStorage.setItem('anonymizedIP', anonymizedIP);
      }
    }
    
    if (!sessionId || !visitorId || !anonymizedIP) {
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
    
    // Update page view count in analytics_stats
    const pageStatsRef = doc(db, 'analytics_stats', 'pages');
    await setDoc(pageStatsRef, {
      [currentPath]: increment(1),
      total: increment(1),
      lastUpdated: timestamp
    }, { merge: true });
    
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
    
    // Only track if time spent is meaningful (at least 1 second)
    if (timeSpent < 1) {
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
    
    // Update page time stats
    const pageTimeStatsRef = doc(db, 'analytics_stats', 'page_times');
    await setDoc(pageTimeStatsRef, {
      [currentPath]: arrayUnion(timeSpent), // Track all time spent values for averaging
      total: increment(timeSpent),
      count: increment(1),
      lastUpdated: serverTimestamp()
    }, { merge: true });
    
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
    
    // Update event count in analytics_stats
    const eventKey = `${category}_${action}`;
    const eventStatsRef = doc(db, 'analytics_stats', 'events');
    await setDoc(eventStatsRef, {
      [eventKey]: increment(1),
      total: increment(1),
      lastUpdated: timestamp
    }, { merge: true });
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
    
    // Update media click stats
    const mediaStatsRef = doc(db, 'analytics_stats', 'media_clicks');
    const statsKey = `${currentPath}_${mediaType}`;
    await setDoc(mediaStatsRef, {
      [statsKey]: increment(1),
      [`${currentPath}_total`]: increment(1),
      [`${mediaType}_total`]: increment(1),
      total: increment(1),
      lastUpdated: serverTimestamp()
    }, { merge: true });
    
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
    
    // Only track sessions longer than 5 seconds
    if (duration < 5) {
      return;
    }
    
    const visitorId = getVisitorId();
    const anonymizedIP = localStorage.getItem('anonymizedIP');
    const environment = getEnvironment();
    
    // Update session data in analytics_sessions collection
    const sessionRef = doc(db, 'analytics_sessions', sessionId);
    await setDoc(sessionRef, {
      sessionId,
      visitorId,
      anonymizedIP,
      startTime,
      endTime,
      duration,
      path: window.location.pathname,
      environment
    }, { merge: true });
  } catch (error) {
    // Silent fail
  }
};

// Initialize analytics
const initAnalytics = async () => {
  try {
    // Track visitor
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

export { trackVisitor, trackPageView, trackPageTime, trackEvent, trackMediaClick, trackSessionEnd, initAnalytics }; 