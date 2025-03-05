import { useEffect, useState } from 'react';
import { analytics } from '../utils/analytics';

const ScrollTracker = ({ pageName }) => {
  const [scrollMarkers, setScrollMarkers] = useState({
    25: false,
    50: false,
    75: false,
    90: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      Object.keys(scrollMarkers).forEach(marker => {
        if (scrollPercentage >= parseInt(marker) && !scrollMarkers[marker]) {
          setScrollMarkers(prev => ({ ...prev, [marker]: true }));
          analytics.trackScrollDepth(parseInt(marker), pageName);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollMarkers, pageName]);

  return null; // This component doesn't render anything
};

export default ScrollTracker; 