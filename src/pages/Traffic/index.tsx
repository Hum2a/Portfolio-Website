import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TrafficProvider } from './TrafficContext';
import { TrafficDashboard } from './TrafficDashboard';
import Seo from '../../components/seo/Seo';
import './Traffic.css';

function Traffic() {
  const { role } = useAuth();

  if (role !== 'humza') {
    return (
      <div className="traffic-container">
        <Seo title="Traffic" path="/traffic" noindex />
        <div className="traffic-error">
          <h2>Access Denied</h2>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="traffic-container">
      <Seo title="Traffic" path="/traffic" noindex />
      <TrafficProvider role={role}>
        <TrafficDashboard />
      </TrafficProvider>
    </div>
  );
}

export default Traffic;
