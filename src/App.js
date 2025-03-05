import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navigation from "./components/navigation";
import { initGA, logPageView } from './utils/analytics';

const App = () => {
  useEffect(() => {
    // Initialize Google Analytics
    initGA();
    
    // Log initial page view
    logPageView();
    
    // Log page views on route changes
    const handleRouteChange = () => {
      logPageView();
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <Router>
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        <Navigation />
      </div>
    </Router>
  );
};

export default App;
