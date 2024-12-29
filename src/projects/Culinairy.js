import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/Culinairy.css";

const CulinAIry = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const images = [
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Dietary Pref.png`, caption: "Dietary Preferences" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Homepage.png`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Ingredients.png`, caption: "Ingredients Entry" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Login page.png`, caption: "Login and Register" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Meal Planner.png`, caption: "Meal Planner" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/MealsPlaned.png`, caption: "Planned Meals" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Profile.png`, caption: "Profile Settings" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Recipe Generated.png`, caption: "Recipe Generated" },
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

      <div className="culinary-container">
        <img
          src={`${process.env.PUBLIC_URL}/logos/Culinairy.png`}
          alt="CulinAIry Logo"
          className="culinairy-logo"
        />
        <h1>CulinAIry</h1>
        <p>An AI-powered recipe generator for personalized meals.</p>
        <div className="culinary-images">
          {images.map((image, index) => (
            <div
              key={index}
              className="image-container"
              onClick={() => setSelectedImage(image)}
            >
              <img src={image.src} alt={image.caption} className="culinary-image" />
              <p className="image-caption">{image.caption}</p>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="modal" onClick={() => setSelectedImage(null)}>
            <div className="modal-content">
              <img src={selectedImage.src} alt={selectedImage.caption} className="modal-image" />
              <p className="modal-caption">{selectedImage.caption}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CulinAIry;
