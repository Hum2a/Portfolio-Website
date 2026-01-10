import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import firebaseAnalytics from '../services/firebaseAnalytics';

/**
 * Custom hook for tracking media clicks in project pages
 * Returns a function that can be called when media (images/videos) is clicked
 */
export const useMediaTracking = () => {
  const location = useLocation();

  const trackMediaClick = useCallback((mediaType, mediaSrc, mediaCaption) => {
    firebaseAnalytics.trackMediaClick(
      mediaType, // 'image' or 'video'
      mediaSrc,
      mediaCaption,
      location.pathname
    );
  }, [location.pathname]);

  return { trackMediaClick };
};

export default useMediaTracking;
