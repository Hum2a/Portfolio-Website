import React, { useState } from 'react';
import { analytics } from '../utils/analytics';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Track when user starts filling out the form
    if (formData.name === '' && formData.email === '' && formData.message === '') {
      analytics.trackForm('Contact Form', 'Start', 'initiated');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      analytics.trackForm('Contact Form', 'Error', 'validation_failed');
      return;
    }
    
    // Track successful submission
    analytics.trackForm('Contact Form', 'Submit', 'success');
    
    // Form submission logic here
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Send Message</button>
    </form>
  );
};

export default ContactForm; 