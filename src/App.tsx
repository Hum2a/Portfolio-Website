import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import firebaseAnalytics from './services/analyticsService';
import { AuthProvider } from './contexts/AuthContext';
import PageTimeTracker from './components/tracking/PageTimeTracker';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';

function App() {
  useEffect(() => {
    firebaseAnalytics.initAnalytics();
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <div className="App">
            <PageTimeTracker />
            <SiteHeader />
            <div className="app-main" id="main-content">
              <AppRoutes />
            </div>
            <SiteFooter />
          </div>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
