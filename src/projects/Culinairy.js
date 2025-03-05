import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/Culinairy.css";

const CulinAIry = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const images = [
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Homepage.png`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Recipe Generated.png`, caption: "Recipe Generated" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Login page.png`, caption: "Login and Register" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Meal Planner.png`, caption: "Meal Planner" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/MealsPlaned.png`, caption: "Planned Meals" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Profile.png`, caption: "Profile Settings" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Saved Recipes Closed.png`, caption: "Saved Recipes Overview" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/SaveD Recipes Expanded.png`, caption: "Saved Recipes Expanded" },
  ];

  // Handle screen size change for navbar and hamburger menu
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      {/* Conditional rendering for HamburgerMenu or Navbar */}
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <div className="culinairy-container">
        <img
          src={`${process.env.PUBLIC_URL}/logos/Culinairy.png`}
          alt="CulinAIry Logo"
          className="culinairy-logo"
        />
        <h1 className="culinairy-title">CulinAIry</h1>
        <p className="culinairy-subtitle">An AI-powered recipe generator for personalized meals.</p>

        {/* Visit Website Button */}
        <a
          href="https://culinairy-239n.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          className="culinairy-website-link"
        >
          Visit the Website
        </a>

        <div className="culinairy-images-grid">
          {images.map((image, index) => (
            <div
              key={index}
              className="culinairy-image-container"
              onClick={() => setSelectedImage(image)}
            >
              <img src={image.src} alt={image.caption} className="culinairy-image" />
              <p className="culinairy-image-caption">{image.caption}</p>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="culinairy-modal" onClick={() => setSelectedImage(null)}>
            <div className="culinairy-modal-content">
              <img src={selectedImage.src} alt={selectedImage.caption} className="culinairy-modal-image" />
              <p className="culinairy-modal-caption">{selectedImage.caption}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CulinAIry;
