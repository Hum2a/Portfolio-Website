import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/LiberalDemocrats.css";

const LiberalDemocrats = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const images = [
    { src: `${process.env.PUBLIC_URL}/images/LiberalDemocrats/Homepage.png`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/images/LiberalDemocrats/About.png`, caption: "About Us" },
    { src: `${process.env.PUBLIC_URL}/images/LiberalDemocrats/Policy.png`, caption: "Policy Overview" },
    { src: `${process.env.PUBLIC_URL}/images/LiberalDemocrats/Contact.png`, caption: "Contact Page" },
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

      <div className="liberal-democrats-container">
        <img
          src={`${process.env.PUBLIC_URL}/logos/LDMF.png`}
          alt="Liberal Democrats Logo"
          className="liberal-democrats-logo"
        />
        <h1 className="liberal-democrats-title">Liberal Democrats</h1>
        <p className="liberal-democrats-subtitle">
          Informative website for the Liberal Democrats Movement Foundation (LDMF).
        </p>

        <div className="liberal-democrats-images">
          {images.map((image, index) => (
            <div
              key={index}
              className="image-container"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.caption}
                className="liberal-democrats-image"
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

export default LiberalDemocrats;
