import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = () => {
  ReactGA.initialize('G-4NQRQB6C7S'); // Your measurement ID
  console.log('Google Analytics initialized');
};

// Basic page view tracking
export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
};

// Enhanced event tracking
export const analytics = {
  // Track any click event with element details
  trackClick: (elementName, elementType, pageSection) => {
    ReactGA.event({
      category: 'User Interaction',
      action: 'Click',
      label: elementName,
      non_interaction: false,
      custom_parameters: {
        element_type: elementType,
        page_section: pageSection
      }
    });
  },

  // Track form interactions
  trackForm: (formName, action, status) => {
    ReactGA.event({
      category: 'Form',
      action: action, // 'Start', 'Submit', 'Error', 'Complete'
      label: formName,
      custom_parameters: {
        form_status: status
      }
    });
  },

  // Track content visibility
  trackVisibility: (elementName, isVisible) => {
    ReactGA.event({
      category: 'Content',
      action: isVisible ? 'Viewed' : 'Hidden',
      label: elementName
    });
  },

  // Track scroll depth
  trackScrollDepth: (depth, pageTitle) => {
    ReactGA.event({
      category: 'Scroll',
      action: 'Depth',
      label: `${depth}% - ${pageTitle}`
    });
  },

  // Track time spent on page
  trackEngagementTime: (timeInSeconds, pageName) => {
    ReactGA.event({
      category: 'Engagement',
      action: 'Time Spent',
      label: pageName,
      value: timeInSeconds
    });
  },

  // Track file downloads
  trackDownload: (fileName, fileType) => {
    ReactGA.event({
      category: 'Download',
      action: fileType,
      label: fileName
    });
  },

  // Track external link clicks
  trackExternalLink: (linkUrl, linkText) => {
    ReactGA.event({
      category: 'External Link',
      action: 'Click',
      label: linkText,
      custom_parameters: {
        destination: linkUrl
      }
    });
  },

  // Track project interactions
  trackProjectInteraction: (projectName, interactionType) => {
    ReactGA.event({
      category: 'Project',
      action: interactionType, // 'View', 'Details', 'Demo', 'GitHub'
      label: projectName
    });
  },

  // Track user preferences
  trackPreference: (preferenceType, preferenceValue) => {
    ReactGA.event({
      category: 'Preference',
      action: preferenceType,
      label: preferenceValue
    });
  },

  // Track errors
  trackError: (errorType, errorMessage, componentName) => {
    ReactGA.event({
      category: 'Error',
      action: errorType,
      label: `${componentName}: ${errorMessage}`
    });
  },

  // Track search
  trackSearch: (searchTerm, resultsCount) => {
    ReactGA.event({
      category: 'Search',
      action: 'Query',
      label: searchTerm,
      value: resultsCount
    });
  }
};
