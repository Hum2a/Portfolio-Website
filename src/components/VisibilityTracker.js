import React, { useEffect, useRef } from 'react';
import { analytics } from '../utils/analytics';

const withVisibilityTracking = (WrappedComponent, elementName) => {
  return (props) => {
    const ref = useRef(null);
    const hasBeenVisible = useRef(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasBeenVisible.current) {
            analytics.trackVisibility(elementName, true);
            hasBeenVisible.current = true;
          }
        },
        { threshold: 0.5 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, []);

    return <div ref={ref}><WrappedComponent {...props} /></div>;
  };
};

export default withVisibilityTracking; 