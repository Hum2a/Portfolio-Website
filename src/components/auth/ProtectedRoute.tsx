import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import NavigateWithoutWipe from '../animations/comic-wipe/NavigateWithoutWipe';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <NavigateWithoutWipe to="/humza-login" />;
  }

  if (requiredRole && role !== requiredRole) {
    // User is authenticated but doesn't have required role
    return <NavigateWithoutWipe to="/" />;
  }

  return children;
};

export default ProtectedRoute;
