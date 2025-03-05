import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import './App.css';
import Navigation from "./components/navigation";
import AppRoutes from "./routes/AppRoutes";
import firebaseAnalytics from './services/firebaseAnalytics';
// Commented out for testing
// import EnhancedCookieConsent from './components/EnhancedCookieConsent';
import ScrollTracker from './components/ScrollTracker';
import TimeTracker from './components/TimeTracker';

// PageTracker component to track page views
const PageTracker = () => {
  useEffect(() => {
    // Track page view when component mounts
    firebaseAnalytics.trackPageView();
  }, []);

  return null;
};

function App() {
  useEffect(() => {
    // Initialize analytics when app loads
    firebaseAnalytics.initAnalytics();
  }, []);

  return (
    <Router>
      <div className="App">
        <PageTracker />
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
