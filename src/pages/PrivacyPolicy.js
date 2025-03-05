import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <Navbar />
      <div className="privacy-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2>Introduction</h2>
          <p>
            This Privacy Policy explains how we collect, use, and protect your information when you visit our portfolio website.
          </p>
        </section>
        
        <section>
          <h2>Information We Collect</h2>
          <p>
            We collect information using Google Analytics, including:
          </p>
          <ul>
            <li>Pages you visit</li>
            <li>Time spent on the website</li>
            <li>Your general location (city/country)</li>
            <li>Device and browser information</li>
            <li>Referral source</li>
          </ul>
        </section>
        
        <section>
          <h2>How We Use Your Information</h2>
          <p>
            We use the collected information to:
          </p>
          <ul>
            <li>Analyze website traffic and improve user experience</li>
            <li>Understand which content is most valuable to visitors</li>
            <li>Identify technical issues</li>
          </ul>
        </section>
        
        <section>
          <h2>Cookies</h2>
          <p>
            We use cookies to enhance your browsing experience. You can choose to disable cookies in your browser settings, 
            although this may affect certain functionality of the website.
          </p>
        </section>
        
        <section>
          <h2>Third-Party Services</h2>
          <p>
            We use Google Analytics to collect and process data about your use of our website. 
            Google Analytics may set cookies on your browser and read cookies that are already there. 
            Google Analytics may also receive information about you from apps you have downloaded that partner with Google.
          </p>
          <p>
            For more information about how Google Analytics collects and processes data, visit: 
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
              https://policies.google.com/technologies/partner-sites
            </a>
          </p>
        </section>
        
        <section>
          <h2>Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul>
            <li>Opt-out of cookies via our cookie consent banner</li>
            <li>Use browser settings to clear or block cookies</li>
            <li>Install the Google Analytics Opt-out Browser Add-on: 
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                https://tools.google.com/dlpage/gaoptout
              </a>
            </li>
          </ul>
        </section>
        
        <section>
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at [your email address].
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 