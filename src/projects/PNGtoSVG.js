// PNGtoSVG.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import HamburgerMenu from "../components/HamburgerMenu";
import "../styles/PNGtoSVG.css";

const PNGtoSVG = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedSVG, setConvertedSVG] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    setLoading(true);
    
    // Mocking conversion logic for demo
    setTimeout(() => {
      setConvertedSVG(
        `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\">
          <circle cx=\"50\" cy=\"50\" r=\"50\" fill=\"#3498db\" />
        </svg>`
      );
      setLoading(false);
    }, 2000);
  };

  return (
    <div>
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="pngtosvg-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={`${process.env.PUBLIC_URL}/logos/PNGtoSVG.png`}
          alt="PNGtoSVG Logo"
          className="pngtosvg-logo"
          whileHover={{ scale: 1.1 }}
        />

        <h1 className="pngtosvg-title">PNG to SVG Converter</h1>
        <p className="pngtosvg-subtitle">Easily convert PNG images into SVG format.</p>

        <div className="upload-section">
          <input type="file" accept="image/png" onChange={handleFileChange} />
          <button
            className="convert-button"
            onClick={handleConvert}
            disabled={!selectedFile || loading}
          >
            {loading ? "Converting..." : "Convert"}
          </button>
        </div>

        {convertedSVG && (
          <div className="result-section">
            <h2>Converted SVG:</h2>
            <div className="svg-preview" dangerouslySetInnerHTML={{ __html: convertedSVG }} />
            <a
              href={`data:image/svg+xml;base64,${btoa(convertedSVG)}`}
              download="converted.svg"
              className="download-link"
            >
              Download SVG
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PNGtoSVG;
