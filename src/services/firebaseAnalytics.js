import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
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

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2z-bw004i2Ns5bLReBv444RZO2mu0ZiY",
    authDomain: "portfolio-110f1.firebaseapp.com",
    projectId: "portfolio-110f1",
    storageBucket: "portfolio-110f1.firebasestorage.app",
    messagingSenderId: "236653178863",
    appId: "1:236653178863:web:f14820795c55cfd785901a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
      // Use browser's geolocation API instead of IP-based geolocation
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0
          });
        });
        
        userLocation = {
          ...userLocation,
          coordinates: [position.coords.latitude.toString(), position.coords.longitude.toString()]
        };
      }
    } catch (geoError) {
      // Silently fail and use default location data
    }
    
    // Current timestamp
    const timestamp = new Date();
    
    // Use anonymizedIP as the document ID
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
        sessions: arrayUnion({
          sessionId,
          startTime: timestamp,
          referrer: document.referrer || 'direct',
        })
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
        sessions: [{
          sessionId,
          startTime: timestamp,
          referrer: document.referrer || 'direct',
        }]
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
    const sessionId = sessionStorage.getItem('sessionId');
    const visitorId = localStorage.getItem('visitorId');
    const anonymizedIP = localStorage.getItem('anonymizedIP');
    
    if (!sessionId || !visitorId || !anonymizedIP) {
      return;
    }
    
    // Ensure path and title are defined
    const currentPath = path || window.location.pathname;
    const currentTitle = title || document.title;
    const currentReferrer = document.referrer || null;
    const timestamp = new Date();
    
    // Create a clean path ID (remove slashes and special characters)
    const pathId = currentPath.replace(/[^a-zA-Z0-9]/g, '_');
    
    // Create a document ID that combines path and timestamp
    const pageViewId = `${pathId}_${Date.now()}`;
    
    // Add page view to analytics_pageviews collection
    const pageViewsRef = collection(db, 'analytics_pageviews');
    await setDoc(doc(pageViewsRef), {
      visitorId,
      anonymizedIP,
      sessionId,
      path: currentPath,
      title: currentTitle,
      referrer: currentReferrer,
      timestamp
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
      timestamp
    });
    
  } catch (error) {
    // Silent fail
  }
};

// Track events (clicks, form submissions, etc.)
const trackEvent = async (category, action, label = null, value = null) => {
  try {
    const sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      return;
    }
    
    // Ensure required fields are defined
    if (!category || !action) {
      return;
    }
    
    const timestamp = new Date();
    const currentPath = window.location.pathname;
    
    const eventData = {
      category,
      action,
      label,
      value,
      path: currentPath,
      timestamp,
      sessionId
    };
    
    // Add event to analytics_events collection
    const eventsRef = collection(db, 'analytics_events');
    await setDoc(doc(eventsRef), eventData);
    
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

// Track session duration when user leaves
const trackSessionEnd = async () => {
  try {
    const sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      return;
    }
    
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
    
    // Update session data in analytics_sessions collection
    const sessionRef = doc(db, 'analytics_sessions', sessionId);
    await setDoc(sessionRef, {
      sessionId,
      startTime,
      endTime,
      duration,
      path: window.location.pathname
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
  trackEvent,
  trackSessionEnd,
  initAnalytics
};

export default firebaseAnalytics;

export { trackVisitor, trackPageView, trackEvent, trackSessionEnd, initAnalytics }; 