import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import { FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
import Terminal from "../components/animations/Terminal";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "../styles/Contact.css";

const Contact = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enquiry: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const validateForm = () => {
    const errors = {};
    
    // Name is mandatory
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    // Email or Phone is mandatory (at least one)
    if (!formData.email.trim() && !formData.phone.trim()) {
      errors.contact = "Either email or phone number is required";
    }
    
    // Validate email format if provided
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }
    
    // Validate phone format if provided (basic validation)
    if (formData.phone.trim()) {
      const phoneRegex = /^[\d\s\-+()]+$/;
      if (!phoneRegex.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
        errors.phone = "Please enter a valid phone number";
      }
    }
    
    // Enquiry is mandatory
    if (!formData.enquiry.trim()) {
      errors.enquiry = "Enquiry message is required";
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Clear contact error if either email or phone is being filled
    if ((name === "email" || name === "phone") && formErrors.contact) {
      setFormErrors(prev => ({
        ...prev,
        contact: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });
    
    try {
      // Add enquiry to Firestore
      await addDoc(collection(db, "enquiries"), {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        enquiry: formData.enquiry.trim(),
        timestamp: serverTimestamp(),
        status: "new"
      });
      
      // Success
      setSubmitStatus({
        type: "success",
        message: "Thank you! Your enquiry has been submitted successfully. I'll get back to you soon!"
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        enquiry: ""
      });
      setFormErrors({});
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: "", message: "" });
      }, 5000);
      
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      setSubmitStatus({
        type: "error",
        message: "Sorry, there was an error submitting your enquiry. Please try again or contact me directly via email."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const contactMethods = [
    {
      icon: <FaEnvelope />,
      title: "Email",
      description: "Reach out via email",
      link: "mailto:Humzabutt1711@hotmail.com",
      buttonText: "Send Email",
      code: "mailto:Humzabutt1711@hotmail.com",
    },
    {
      icon: <FaLinkedin />,
      title: "LinkedIn",
      description: "Connect on LinkedIn",
      link: "https://www.linkedin.com/in/humza-butt-201057208/",
      buttonText: "View Profile",
      code: "linkedin.com/in/humza-butt-201057208",
    },
    {
      icon: <FaGithub />,
      title: "GitHub",
      description: "Check out my repositories",
      link: "https://github.com/Hum2a",
      buttonText: "View GitHub",
      code: "github.com/Hum2a",
    },
    // {
    //   icon: <FaPhone />,
    //   title: "Phone",
    //   description: "Give me a call",
    //   link: "tel:+447450251281",
    //   buttonText: "Call Me",
    //   code: "+44 7450 251281",
    // },
  ];

  return (
    <div className="contact-page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="contact-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="contact-header" variants={itemVariants}>
          <h1 className="contact-title">
            <span className="code-comment">{'//'}</span> Get in Touch
          </h1>
          <Terminal
            lines={[
              "const contact = {",
              "  message: 'I'd love to hear from you!',",
              "  methods: ['email', 'linkedin', 'github', 'phone']",
              "};"
            ]}
            prompt=">"
            typingSpeed={35}
            autoStart={true}
            className="contact-terminal"
            title="contact.js"
          />
        </motion.div>

        <div className="contact-methods">
          {contactMethods.map((method, index) => (
            <motion.div
              className="contact-card"
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="contact-card-header">
                <div className="contact-icon">{method.icon}</div>
                <h2 className="contact-card-title">{method.title}</h2>
              </div>
              <p className="contact-card-description">{method.description}</p>
              <div className="contact-code">
                <span className="code-keyword">const</span>{" "}
                <span className="code-variable">{method.title.toLowerCase()}</span> = "
                <span className="code-string">{method.code}</span>";
              </div>
              <a
                href={method.link}
                target={method.link.startsWith("http") ? "_blank" : undefined}
                rel={method.link.startsWith("http") ? "noopener noreferrer" : undefined}
                className="contact-link"
              >
                <button className="contact-button">
                  <span>{method.buttonText}</span>
                  <span className="button-arrow">→</span>
                </button>
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div className="enquiry-section" variants={itemVariants}>
          <h2 className="enquiry-title">
            <span className="code-comment">{'//'}</span> Leave an Enquiry
          </h2>
          <form onSubmit={handleSubmit} className="enquiry-form">
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
                className={`form-input ${formErrors.name ? 'error' : ''}`}
                placeholder="Your name"
                disabled={isSubmitting}
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
                  className={`form-input ${formErrors.email ? 'error' : ''}`}
                  placeholder="your.email@example.com"
                  disabled={isSubmitting}
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
                  className={`form-input ${formErrors.phone ? 'error' : ''}`}
                  placeholder="+44 1234 567890"
                  disabled={isSubmitting}
                />
                {formErrors.phone && (
                  <span className="error-message">{formErrors.phone}</span>
                )}
              </div>
            </div>

            {formErrors.contact && (
              <div className="error-message contact-error">{formErrors.contact}</div>
            )}

            <div className="form-group">
              <label htmlFor="enquiry" className="form-label">
                Enquiry <span className="required">*</span>
              </label>
              <textarea
                id="enquiry"
                name="enquiry"
                value={formData.enquiry}
                onChange={handleInputChange}
                className={`form-input form-textarea ${formErrors.enquiry ? 'error' : ''}`}
                placeholder="Tell me about your enquiry..."
                rows="5"
                disabled={isSubmitting}
              />
              {formErrors.enquiry && (
                <span className="error-message">{formErrors.enquiry}</span>
              )}
            </div>

            {submitStatus.message && (
              <div className={`submit-message ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit Enquiry'}</span>
              {!isSubmitting && <span className="button-arrow">→</span>}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;
