import React, { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { MotionConfig } from 'framer-motion';
import { ScrollManager } from './lib/scroll';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import PageTimeTracker from './components/tracking/PageTimeTracker';
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';
import ComicWipeProvider from './components/animations/comic-wipe/ComicWipeProvider';
import ComicWipeOverlay from './components/animations/comic-wipe/ComicWipeOverlay';

function App() {
  useEffect(() => {
    const start = () => {
      void import('./services/analyticsService').then((mod) => {
        void mod.default.initAnalytics();
      });
    };
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout: 4000 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(start, 2000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
    <HelmetProvider>
      <AuthProvider>
        <ComicWipeProvider>
          <div className="App">
            <ScrollManager />
            <PageTimeTracker />
            <SiteHeader />
            <div className="app-main" id="main-content">
              <AppRoutes />
            </div>
            <ComicWipeOverlay />
            <SiteFooter />
          </div>
        </ComicWipeProvider>
      </AuthProvider>
    </HelmetProvider>
    </MotionConfig>
  );
}

export default App;
