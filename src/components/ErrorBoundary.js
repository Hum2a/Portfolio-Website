import React, { Component } from 'react';
import { analytics } from '../utils/analytics';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    analytics.trackError('React Error', error.message, this.props.componentName);
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h2>Something went wrong.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 