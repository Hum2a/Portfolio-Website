import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/Contrarian.css";

const Contrarian = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const media = [
    { type: "image", src: `${process.env.PUBLIC_URL}/images/Contrarian/Homepage.png`, caption: "Homepage" },
    { type: "image", src: `${process.env.PUBLIC_URL}/images/Contrarian/Round2.png`, caption: "Round 2" },
    { type: "video", src: `${process.env.PUBLIC_URL}/videos/Contrarian/OmniWidget.mp4`, caption: "OmniWidget Demo" },
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

        <div className="contrarian-media">
          {media.map((item, index) => (
            <div
              key={index}
              className="media-container"
              onClick={() =>
                item.type === "image" ? setSelectedImage(item) : setSelectedVideo(item)
              }
            >
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt={item.caption}
                  className="contrarian-image"
                />
              ) : (
                <video className="contrarian-video-preview" src={item.src} />
              )}
              <p className="media-caption">{item.caption}</p>
            </div>
          ))}
        </div>

        {/* Image Modal */}
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

        {/* Video Modal */}
        {selectedVideo && (
          <div className="modal" onClick={() => setSelectedVideo(null)}>
            <div className="modal-content">
              <video
                controls
                className="modal-video"
                autoPlay
                src={selectedVideo.src}
              />
              <p className="modal-caption">{selectedVideo.caption}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contrarian;
