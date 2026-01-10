import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    role: null,
    loading: true
  });

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange((authData) => {
      if (authData) {
        setAuthState({
          user: authData.user,
          role: authData.role,
          loading: false
        });
      } else {
        setAuthState({
          user: null,
          role: null,
          loading: false
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
