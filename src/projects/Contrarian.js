import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/Contrarian.css";

const Contrarian = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const images = [
    { src: `${process.env.PUBLIC_URL}/images/Contrarian/Homepage.png`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/images/Contrarian/Upload.png`, caption: "Upload Your Pitch Deck" },
    { src: `${process.env.PUBLIC_URL}/images/Contrarian/Results.png`, caption: "Analysis Results" },
    { src: `${process.env.PUBLIC_URL}/images/Contrarian/Details.png`, caption: "Detailed Insights" },
  ];

  const [selectedImage, setSelectedImage] = useState(null);

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

      <div className="contrarian-container">
        <img
          src={`${process.env.PUBLIC_URL}/logos/contrarian.png`}
          alt="Contrarian Logo"
          className="contrarian-logo"
        />
        <h1 className="contrarian-title">Contrarian</h1>
        <p className="contrarian-subtitle">
          A pitch deck classifier for investors to analyze startup pitches.
        </p>

        <div className="contrarian-images">
          {images.map((image, index) => (
            <div
              key={index}
              className="image-container"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.caption}
                className="contrarian-image"
              />
              <p className="image-caption">{image.caption}</p>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="modal" onClick={() => setSelectedImage(null)}>
            <div className="modal-content">
              <img
                src={selectedImage.src}
                alt={selectedImage.caption}
                className="modal-image"
              />
              <p className="modal-caption">{selectedImage.caption}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contrarian;
