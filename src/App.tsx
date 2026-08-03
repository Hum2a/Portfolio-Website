import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import './App.css';
import AppRoutes from "./routes/AppRoutes";
import firebaseAnalytics from './services/analyticsService';
import { AuthProvider } from './contexts/AuthContext';
import PageTimeTracker from './components/tracking/PageTimeTracker';

function App() {
  useEffect(() => {
    // Initialize analytics when app loads
    firebaseAnalytics.initAnalytics();
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <div className="App">
            <PageTimeTracker />
            <AppRoutes />
          </div>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
