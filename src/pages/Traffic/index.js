import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import { TrafficProvider } from './TrafficContext';
import { TrafficDashboard } from './TrafficDashboard';
import '../../styles/Traffic.css';

function Traffic() {
  const { user, role } = useAuth();

  if (role !== 'humza') {
    return (
      <div className="traffic-container">
        <div className="traffic-error">
          <h2>Access Denied</h2>
          <p>You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="traffic-container">
      <Navbar />
      <TrafficProvider role={role}>
        <TrafficDashboard />
      </TrafficProvider>
    </div>
  );
}

export default Traffic;
