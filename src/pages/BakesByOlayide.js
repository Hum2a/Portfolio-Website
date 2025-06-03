import React from "react";
import "../styles/BakesByOlayide.css";

const BakesByOlayide = () => {
  return (
    <div className="bakesbyolayide-main">
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