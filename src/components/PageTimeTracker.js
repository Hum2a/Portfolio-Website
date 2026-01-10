import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import firebaseAnalytics from '../services/firebaseAnalytics';

/**
 * PageTimeTracker component tracks time spent on each page
 * and automatically records it when the page is left or component unmounts
 */
const PageTimeTracker = () => {
  const location = useLocation();
  const pageViewIdRef = useRef(null);

  useEffect(() => {
    // Track page view when route changes
    const trackPage = async () => {
      pageViewIdRef.current = await firebaseAnalytics.trackPageView();
    };
    
    trackPage();

    // Track time spent when leaving the page
    return () => {
      if (pageViewIdRef.current) {
        firebaseAnalytics.trackPageTime(location.pathname, pageViewIdRef.current);
      } else {
        // Fallback: try to track anyway (will use session storage)
        firebaseAnalytics.trackPageTime(location.pathname);
      }
    };
  }, [location.pathname]);

  // Also track time spent when page is being unloaded (beforeunload)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pageViewIdRef.current) {
        firebaseAnalytics.trackPageTime(location.pathname, pageViewIdRef.current);
      } else {
        firebaseAnalytics.trackPageTime(location.pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  return null; // This component doesn't render anything
};

export default PageTimeTracker;
