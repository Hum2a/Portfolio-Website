import { useEffect } from 'react';
import { analytics } from '../utils/analytics';

const TimeTracker = ({ pageName }) => {
  useEffect(() => {
    const startTime = Date.now();
    let timeInterval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      // Track every minute
      if (timeSpent % 60 === 0 && timeSpent > 0) {
        analytics.trackEngagementTime(timeSpent, pageName);
      }
    }, 1000);

    return () => {
      clearInterval(timeInterval);
      const totalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
      analytics.trackEngagementTime(totalTimeSpent, pageName);
    };
  }, [pageName]);

  return null; // This component doesn't render anything
};

export default TimeTracker; 