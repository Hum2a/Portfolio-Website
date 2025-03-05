import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, serverTimestamp } from 'firebase/database';
import CryptoJS from 'crypto-js'; // For hashing IP addresses

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2z-bw004i2Ns5bLReBv444RZO2mu0ZiY",
    authDomain: "portfolio-110f1.firebaseapp.com",
    projectId: "portfolio-110f1",
    storageBucket: "portfolio-110f1.firebasestorage.app",
    messagingSenderId: "236653178863",
    appId: "1:236653178863:web:f14820795c55cfd785901a",
    measurementId: "G-NW1GSRNPHP"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to anonymize IP address (hash the last octet)
const anonymizeIP = (ip) => {
  if (!ip) return null;
  
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  
  // Hash the last octet for partial anonymization
  const hashedLastOctet = CryptoJS.SHA256(parts[3]).toString().substring(0, 8);
  return `${parts[0]}.${parts[1]}.${parts[2]}.*`;
};

// Track visitor with consent
export const trackVisitorWithConsent = async (hasConsent) => {
  if (!hasConsent) return;
  
  try {
    // Get IP address using a public API
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    const ipAddress = data.ip;
    
    // Anonymize the IP address
    const anonymizedIP = anonymizeIP(ipAddress);
    
    // Get basic visitor info
    const visitorData = {
      timestamp: serverTimestamp(),
      anonymizedIP: anonymizedIP,
      userAgent: navigator.userAgent,
      language: navigator.language,
      referrer: document.referrer || 'direct',
      path: window.location.pathname,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      // Do NOT collect personally identifiable information
    };
    
    // Store in Firebase
    const visitorRef = ref(database, 'analytics/visitors');
    await push(visitorRef, visitorData);
    
    console.log('Anonymous visitor data stored');
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
};

// Track page view
export const trackPageView = async (hasConsent) => {
  if (!hasConsent) return;
  
  try {
    const pageData = {
      timestamp: serverTimestamp(),
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer || 'direct'
    };
    
    const pageViewRef = ref(database, 'analytics/pageViews');
    await push(pageViewRef, pageData);
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Track events
export const trackEvent = async (hasConsent, eventCategory, eventAction, eventLabel) => {
  if (!hasConsent) return;
  
  try {
    const eventData = {
      timestamp: serverTimestamp(),
      category: eventCategory,
      action: eventAction,
      label: eventLabel,
      path: window.location.pathname
    };
    
    const eventRef = ref(database, 'analytics/events');
    await push(eventRef, eventData);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}; 