import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Tracks time spent on each page. Loads analytics only after idle so Firebase
 * stays off the critical first-paint path.
 */
const PageTimeTracker = () => {
  const location = useLocation();
  const pageViewIdRef = useRef(null);
  const analyticsRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let idleId;
    let timeoutId;

    const load = () => {
      void import('../../services/analyticsService').then((mod) => {
        if (!cancelled) analyticsRef.current = mod.default;
      });
    };

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(load, { timeout: 4000 });
    } else {
      timeoutId = window.setTimeout(load, 2000);
    }

    return () => {
      cancelled = true;
      if (idleId != null) window.cancelIdleCallback?.(idleId);
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const trackPage = async () => {
      const analytics = analyticsRef.current;
      if (!analytics) {
        // Wait briefly for deferred load
        await new Promise((r) => setTimeout(r, 500));
      }
      const api = analyticsRef.current;
      if (!api || cancelled) return;
      pageViewIdRef.current = await api.trackPageView();
    };

    void trackPage();

    return () => {
      cancelled = true;
      const api = analyticsRef.current;
      if (!api) return;
      if (pageViewIdRef.current) {
        api.trackPageTime(location.pathname, pageViewIdRef.current);
      } else {
        api.trackPageTime(location.pathname);
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const api = analyticsRef.current;
      if (!api) return;
      if (pageViewIdRef.current) {
        api.trackPageTime(location.pathname, pageViewIdRef.current);
      } else {
        api.trackPageTime(location.pathname);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [location.pathname]);

  return null;
};

export default PageTimeTracker;
