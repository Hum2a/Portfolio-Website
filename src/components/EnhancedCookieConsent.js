import React, { useState, useEffect } from 'react';
import './EnhancedCookieConsent.css';

const EnhancedCookieConsent = ({ onAccept, onDecline }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Check if user has already made a choice
    const consentChoice = localStorage.getItem('cookieConsent');
    
    if (!consentChoice) {
      // Show consent banner if no choice has been made
      setVisible(true);
    } else if (consentChoice === 'accepted') {
      // If consent was previously accepted, trigger the onAccept callback
      onAccept && onAccept();
    }
  }, [onAccept]);
  
  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
    onAccept && onAccept();
  };
  
  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setVisible(false);
    onDecline && onDecline();
  };
  
  if (!visible) {
    return null;
  }
  
  return (
    <div className="cookie-consent">
      <div className="cookie-content">
        <h3>This site uses cookies</h3>
        <p>
          We use cookies and similar technologies to analyze traffic, enhance site functionality, 
          and improve your experience. By clicking "Accept", you consent to the use of cookies.
        </p>
        <div className="cookie-buttons">
          <button className="accept-button" onClick={handleAccept}>
            Accept
          </button>
          <button className="decline-button" onClick={handleDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCookieConsent; 