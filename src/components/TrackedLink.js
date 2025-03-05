import React from 'react';
import { analytics } from '../utils/analytics';

const TrackedLink = ({ 
  href, 
  children, 
  elementName, 
  section = 'general', 
  isExternal = false,
  ...props 
}) => {
  const handleClick = () => {
    if (isExternal) {
      analytics.trackExternalLink(href, elementName);
    } else {
      analytics.trackClick(elementName, 'link', section);
    }
  };

  return (
    <a 
      href={href} 
      onClick={handleClick}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
};

export default TrackedLink; 