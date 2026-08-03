import React from 'react';
import Navbar from './Navbar';
import './RouteFallback.css';

/**
 * Suspense fallback for lazy routes — header + content skeleton, never a spinner.
 */
const RouteFallback = () => {
  return (
    <div className="route-fallback" aria-busy="true" aria-live="polite">
      <Navbar />
      <main className="route-fallback-main" id="main-content">
        <div className="route-fallback-skeleton">
          <div className="route-fallback-title" />
          <div className="route-fallback-line route-fallback-line--lg" />
          <div className="route-fallback-line route-fallback-line--md" />
          <div className="route-fallback-line route-fallback-line--sm" />
          <div className="route-fallback-cards">
            <div className="route-fallback-card" />
            <div className="route-fallback-card" />
            <div className="route-fallback-card" />
          </div>
        </div>
        <span className="visually-hidden">Loading page…</span>
      </main>
    </div>
  );
};

export default RouteFallback;
