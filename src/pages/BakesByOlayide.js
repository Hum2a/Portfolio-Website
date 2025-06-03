import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/BakesByOlayide.css";

const BakesByOlayide = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bakesbyolayide-main">
      {/* Conditional rendering for HamburgerMenu or Navbar */}
      {isMobile ? <HamburgerMenu /> : <Navbar />}
      <header className="bakesbyolayide-header">
        <div className="bakesbyolayide-logo-area">
          <img
            src={`${process.env.PUBLIC_URL}/logos/BakesByOlayide.png`}
            alt="BakesByOlayide Logo"
            className="bakesbyolayide-header-logo"
          />
          <span className="bakesbyolayide-header-title">Bakes by Olayide</span>
        </div>
        <nav className="bakesbyolayide-nav">
          <a href="#" className="bakesbyolayide-nav-link">Our Range</a>
          <a href="#" className="bakesbyolayide-nav-link">Guides</a>
          <a href="#" className="bakesbyolayide-nav-link">Our Story</a>
          <a href="#" className="bakesbyolayide-nav-link">Contact Us</a>
        </nav>
      </header>
      <section className="bakesbyolayide-hero-section">
        <div
          className="bakesbyolayide-hero-bg"
          style={{
            background: `url(${process.env.PUBLIC_URL}/logos/BakesByOlayide.png) center/contain no-repeat`
          }}
        ></div>
        <div className="bakesbyolayide-hero-content">
          <h1 className="bakesbyolayide-hero-title">Cakes and Bakes for Every Occasion</h1>
          <p className="bakesbyolayide-hero-desc">
            BakesByOlayide is a modern e-commerce platform for custom cakes and desserts. Order online, browse our range, and enjoy sweet moments delivered to your door.
          </p>
          <a
            href="https://bakesbyolayide.co.uk"
            className="bakesbyolayide-browse-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Browse
          </a>
        </div>
      </section>
      <section className="bakesbyolayide-description-section">
        <h2>About BakesByOlayide</h2>
        <p>
          BakesByOlayide offers a seamless online experience for ordering bespoke cakes and baked goods. Whether you're celebrating a birthday, wedding, or any special event, our platform makes it easy to customize, order, and enjoy delicious treats with just a few clicks.
        </p>
      </section>
      <section className="bakesbyolayide-engineering-section">
        <h2>Engineering Excellence</h2>
        <p className="bakesbyolayide-engineering-intro">
          Our platform is built with industry-leading engineering practices and modern web technologies. Here's what sets us apart:
        </p>
        <div className="bakesbyolayide-brag-grid">
          <div className="bakesbyolayide-brag-card"><span className="brag-icon">🎠</span><strong>Sophisticated Carousel</strong><br/>Custom-built, touch-friendly, hardware-accelerated, and responsive.</div>
          <div className="bakesbyolayide-brag-card"><span className="brag-icon">🎨</span><strong>Advanced CSS Architecture</strong><br/>Responsive, animated, and themable with CSS Grid & Flexbox.</div>
          <div className="bakesbyolayide-brag-card"><span className="brag-icon">⚡</span><strong>Performance Optimizations</strong><br/>Hardware-accelerated, efficient image loading, and smooth transitions.</div>
          <div className="bakesbyolayide-brag-card"><span className="brag-icon">♿</span><strong>Accessibility Features</strong><br/>ARIA labels, semantic HTML, keyboard navigation, and high contrast.</div>
          <div className="bakesbyolayide-brag-card"><span className="brag-icon">🛡️</span><strong>Robust Error Handling</strong><br/>Graceful fallbacks, loading states, and error boundaries.</div>
          <div className="bakesbyolayide-brag-card"><span className="brag-icon">🔄</span><strong>State Management</strong><br/>Efficient, predictable, and clean separation of UI and logic.</div>
          <div className="bakesbyolayide-brag-card"><span className="brag-icon">📦</span><strong>Code Organization</strong><br/>Modular, reusable, and well-documented components.</div>
          <div className="bakesbyolayide-brag-card"><span className="brag-icon">✨</span><strong>User Experience</strong><br/>Smooth transitions, intuitive navigation, and responsive feedback.</div>
          <div className="bakesbyolayide-brag-card"><span className="brag-icon">📱</span><strong>Mobile-First Approach</strong><br/>Touch-friendly, responsive, and optimized for all devices.</div>
          <div className="bakesbyolayide-brag-card"><span className="brag-icon">🛠️</span><strong>Maintainability</strong><br/>DRY principles, consistent styling, and easy to extend.</div>
          <div className="bakesbyolayide-brag-card"><span className="brag-icon">🔒</span><strong>Security</strong><br/>Safe input handling, secure image loading, and protected routes.</div>
          <div className="bakesbyolayide-brag-card"><span className="brag-icon">🧪</span><strong>Testing</strong><br/>Testable, isolated, and predictable component logic.</div>
        </div>
      </section>
      <footer className="bakesbyolayide-footer">
        <div className="bakesbyolayide-footer-content">
          <span className="bakesbyolayide-footer-logo">Bakes by Olayide</span>
          <span className="bakesbyolayide-footer-copy">&copy; {new Date().getFullYear()} BakesByOlayide. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default BakesByOlayide; 