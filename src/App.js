import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import './App.css';
import AppRoutes from "./routes/AppRoutes";
import firebaseAnalytics from './services/firebaseAnalytics';
import { AuthProvider } from './contexts/AuthContext';
// Commented out for testing
// import EnhancedCookieConsent from './components/EnhancedCookieConsent';
import ScrollTracker from './components/ScrollTracker';
import TimeTracker from './components/TimeTracker';
import PageTimeTracker from './components/PageTimeTracker';

function App() {
  useEffect(() => {
    // Initialize analytics when app loads
    firebaseAnalytics.initAnalytics();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <PageTimeTracker />
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
