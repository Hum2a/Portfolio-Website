import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = () => {
  ReactGA.initialize('G-4NQRQB6C7S');
  console.log('Google Analytics initialized');
};

// Log page views
export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
  console.log(`Logged pageview for: ${window.location.pathname}`);
};

// Log events (button clicks, downloads, etc.)
export const logEvent = (category, action, label) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
  console.log(`Logged event - Category: ${category}, Action: ${action}, Label: ${label}`);
};

// Track specific user engagement metrics
export const trackUserEngagement = {
  // Track when users view a specific project
  trackProjectView: (projectName) => {
    logEvent('Portfolio', 'Project View', projectName);
  },

  // Track when users click external links
  trackExternalLink: (linkName, url) => {
    logEvent('External Link', 'Click', `${linkName}: ${url}`);
  },

  // Track when users download files
  trackDownload: (fileName) => {
    logEvent('Download', 'Click', fileName);
  },

  // Track contact form interactions
  trackContactForm: (status) => {
    logEvent('Contact Form', status, 'Form Interaction');
  },

  // Track time spent on page
  trackTimeOnPage: () => {
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      logEvent('User Engagement', 'Time on Page', `${timeSpent} seconds`);
    });
  }
};
