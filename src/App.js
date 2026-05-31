import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import './App.css';
import AppRoutes from "./routes/AppRoutes";
import firebaseAnalytics from './services/firebaseAnalytics';
import { AuthProvider } from './contexts/AuthContext';
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
