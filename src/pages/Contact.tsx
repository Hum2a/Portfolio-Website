import React, { useState } from 'react';
import { FaEnvelope, FaLinkedin, FaGithub, FaFileDownload } from 'react-icons/fa';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { trackContactSubmit, trackEvent } from '../services/analyticsService';
import Seo from '../components/seo/Seo';
import SectionBackdrop from '../components/media/SectionBackdrop';
import { Button } from '@/components/ui/button';
import { TextareaPaperExpansion } from '@/components/animations/textarea-paper-expansion';
import './Contact.css';

const CV_HREF = '/Humza-Butt-CV.pdf?v=2026-08';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiry: '',
    company: '', // honeypot
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<{
    type: '' | 'success' | 'error';
    message: string;
  }>({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string, data = formData) => {
    if (name === 'name' && !value.trim()) return 'Name is required';
    if (name === 'enquiry' && !value.trim()) return 'Enquiry message is required';
    if (name === 'email' && value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email address';
    }
    if (name === 'phone' && value.trim()) {
      const phoneRegex = /^[\d\s\-+()]+$/;
      if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
        return 'Please enter a valid phone number';
      }
    }
    if (
      (name === 'email' || name === 'phone') &&
      !data.email.trim() &&
      !data.phone.trim()
    ) {
      return 'Either email or phone number is required';
    }
    return '';
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const nameErr = validateField('name', formData.name);
    if (nameErr) errors.name = nameErr;
    const enquiryErr = validateField('enquiry', formData.enquiry);
    if (enquiryErr) errors.enquiry = enquiryErr;
    if (!formData.email.trim() && !formData.phone.trim()) {
      errors.contact = 'Either email or phone number is required';
    }
    const emailErr = validateField('email', formData.email);
    if (emailErr && formData.email.trim()) errors.email = emailErr;
    const phoneErr = validateField('phone', formData.phone);
    if (phoneErr && formData.phone.trim()) errors.phone = phoneErr;
    return errors;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);
    if (touched[name] || formErrors[name]) {
      const err = validateField(name, value, next);
      setFormErrors((prev) => {
        const copy = { ...prev };
        if (err) copy[name] = err;
        else delete copy[name];
        if (name === 'email' || name === 'phone') {
          if (next.email.trim() || next.phone.trim()) delete copy.contact;
        }
        return copy;
      });
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setFormErrors((prev) => {
      const copy = { ...prev };
      if (err) copy[name] = err;
      else delete copy[name];
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.company.trim()) {
      // Honeypot filled — pretend success
      setSubmitStatus({
        type: 'success',
        message: "Thank you! Your enquiry has been submitted successfully.",
      });
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setTouched({ name: true, email: true, phone: true, enquiry: true });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      await addDoc(collection(db, 'enquiries'), {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        enquiry: formData.enquiry.trim(),
        timestamp: serverTimestamp(),
        status: 'new',
      });

      trackContactSubmit();

      setSubmitStatus({
        type: 'success',
        message:
          "Thank you! Your enquiry has been submitted successfully. I'll get back to you soon.",
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        enquiry: '',
        company: '',
      });
      setFormErrors({});
      setTouched({});
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setSubmitStatus({
        type: 'error',
        message:
          'Sorry, there was an error submitting your enquiry. Please try again or email me directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCvClick = () => {
    trackEvent('engagement', 'cv_download', '/contact');
  };

  return (
    <div className="contact-page">
      <Seo
        title="Contact"
        description="Get in touch with Humza Butt for contract work, collaborations, or questions about shipped projects."
        path="/contact"
      />

      <div className="contact-container">
        <SectionBackdrop
          src="/images/Therabot/Dashboard.png"
          placement="left"
          intensity={0.11}
          tint="accent"
        />

        <header className="contact-header">
          <h1 className="contact-title">Get in touch</h1>
          <p className="contact-lede">
            Available for contract work. Send an enquiry or reach me directly.
          </p>
        </header>

        <div className="contact-layout">
          <div className="contact-form-col">
            {submitStatus.type === 'success' ? (
              <div className="contact-success surface-2" role="status">
                <h2>Message sent</h2>
                <p>{submitStatus.message}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() =>
                    setSubmitStatus({ type: '', message: '' })
                  }
                >
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="enquiry-form surface-2" noValidate>
                <h2 className="enquiry-title">Leave an enquiry</h2>

                {/* Honeypot — hidden from users */}
                <div className="contact-honeypot" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`form-input ${formErrors.name ? 'error' : ''}`}
                    placeholder="Your name"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(formErrors.name)}
                  />
                  {formErrors.name && (
                    <span className="error-message">{formErrors.name}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email{' '}
                      {!formData.phone && <span className="required">*</span>}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`form-input ${formErrors.email ? 'error' : ''}`}
                      placeholder="you@example.com"
                      disabled={isSubmitting}
                      aria-invalid={Boolean(formErrors.email)}
                    />
                    {formErrors.email && (
                      <span className="error-message">{formErrors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone{' '}
                      {!formData.email && <span className="required">*</span>}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`form-input ${formErrors.phone ? 'error' : ''}`}
                      placeholder="+44 …"
                      disabled={isSubmitting}
                      aria-invalid={Boolean(formErrors.phone)}
                    />
                    {formErrors.phone && (
                      <span className="error-message">{formErrors.phone}</span>
                    )}
                  </div>
                </div>

                {formErrors.contact && (
                  <div className="error-message contact-error">
                    {formErrors.contact}
                  </div>
                )}

                <div className="form-group form-group--paper">
                  <TextareaPaperExpansion
                    id="enquiry"
                    name="enquiry"
                    label={
                      <>
                        Enquiry <span className="required">*</span>
                      </>
                    }
                    placeholder="Tell me about your project or question…"
                    value={formData.enquiry}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    error={Boolean(formErrors.enquiry)}
                    disabled={isSubmitting}
                  />
                  {formErrors.enquiry && (
                    <span className="error-message">{formErrors.enquiry}</span>
                  )}
                </div>

                {submitStatus.type === 'error' && submitStatus.message && (
                  <div className="submit-message error">{submitStatus.message}</div>
                )}

                <Button
                  type="submit"
                  className="rounded-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting…' : 'Submit enquiry'}
                </Button>
              </form>
            )}
          </div>

          <aside className="contact-channels">
            <h2 className="contact-channels-title">Direct channels</h2>
            <ul className="contact-channel-list">
              <li>
                <a href="mailto:Humzabutt1711@hotmail.com" className="contact-channel">
                  <FaEnvelope aria-hidden="true" />
                  <span>
                    <strong>Email</strong>
                    <span className="contact-channel-meta">
                      Humzabutt1711@hotmail.com
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/humza-butt-201057208/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-channel"
                >
                  <FaLinkedin aria-hidden="true" />
                  <span>
                    <strong>LinkedIn</strong>
                    <span className="contact-channel-meta">
                      /in/humza-butt-201057208
                    </span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Hum2a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-channel"
                >
                  <FaGithub aria-hidden="true" />
                  <span>
                    <strong>GitHub</strong>
                    <span className="contact-channel-meta">github.com/Hum2a</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={CV_HREF}
                  download
                  className="contact-channel"
                  onClick={onCvClick}
                >
                  <FaFileDownload aria-hidden="true" />
                  <span>
                    <strong>Download CV</strong>
                    <span className="contact-channel-meta">PDF · 2026</span>
                  </span>
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Contact;
