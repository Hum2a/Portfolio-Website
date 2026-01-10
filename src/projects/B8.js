// B8.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import HamburgerMenu from '../components/HamburgerMenu';
import Terminal from '../components/animations/Terminal';
import CodeBlock from '../components/animations/CodeBlock';
import useMediaTracking from '../hooks/useMediaTracking';
import '../styles/project-shared.css';
import '../styles/B8.css';

const businesses = [
  { name: 'B8 Marketing', description: 'Innovative marketing strategies for your brand.', link: '/b8-marketing' },
  { name: 'BGr8', description: 'Community-focused growth and empowerment programs.', link: '/bgr8' },
  { name: 'B8 Car Club', description: 'Exclusive car events, showcases, and clubs.', link: '/b8-car-club' },
  { name: 'B8 Clothing', description: 'Modern and stylish apparel for every occasion.', link: '/b8-clothing' },
  { name: 'B8 Football Club', description: 'Fostering football talent through community and passion.', link: '/b8-football-club' },
  { name: 'B8 Charity', description: 'Making a difference through impactful charity initiatives.', link: '/b8-charity' },
  { name: 'B8 Education', description: 'Empowering the next generation through education.', link: '/b8-education' },
  { name: 'B8 Careers', description: 'Join our team to grow and innovate with us.', link: '/b8-careers' },
];

const mediaSection = {
  images: [
    { src: `${process.env.PUBLIC_URL}/images/B8/Homepage.png`, title: 'B8 Homepage' },
    { src: `${process.env.PUBLIC_URL}/images/B8/Marketing.png`, title: 'B8 Marketing' },
    { src: `${process.env.PUBLIC_URL}/images/B8/CarClub.png`, title: 'B8 Car Club' },
    { src: `${process.env.PUBLIC_URL}/images/B8/Clothing.png`, title: 'B8 Clothing' },
    { src: `${process.env.PUBLIC_URL}/images/B8/League.png`, title: 'B8 League' },
    { src: `${process.env.PUBLIC_URL}/images/B8/World.png`, title: 'B8 World' },
    { src: `${process.env.PUBLIC_URL}/images/B8/Bgr8.png`, title: 'BGr8' },
    { src: `${process.env.PUBLIC_URL}/images/B8/Medical.png`, title: 'B8 Medical' },
    { src: `${process.env.PUBLIC_URL}/images/B8/Podcast.png`, title: 'B8 Podcast' },
    { src: `${process.env.PUBLIC_URL}/images/B8/AdminPortalAnalytics.png`, title: 'Admin Portal Analytics' },
    { src: `${process.env.PUBLIC_URL}/images/B8/AdminPortalUsers.png`, title: 'Admin Portal Users' },
    { src: `${process.env.PUBLIC_URL}/images/B8/AdminPortalEnquiries.png`, title: 'Admin Portal Enquiries' },
    { src: `${process.env.PUBLIC_URL}/images/B8/AdminPortalSettings.png`, title: 'Admin Portal Settings' },
  ],
  videos: [
    { src: `${process.env.PUBLIC_URL}/videos/B8/Profile.mp4`, title: 'B8 Profile' },
    { src: `${process.env.PUBLIC_URL}/videos/B8/Glitch.mp4`, title: 'B8 Glitch Effect' },
  ]
};

export default function B8() {
  const [activeMediaType, setActiveMediaType] = useState('images');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { trackMediaClick } = useMediaTracking();

  const projectInfo = `const b8 = {
  name: "B8 Network",
  type: "Marketing Firm & Business Network",
  description: "Unleashing potential through innovation and determination",
  technologies: [
    "React.js",
    "Vite",
    "Stripe",
    "Google Pay API",
    "Google Maps API",
    "React-Globe.gl",
    "Custom CMS",
    "Firebase",
    "Render"
  ],
  businesses: [
    "B8 Marketing",
    "BGr8",
    "B8 Car Club",
    "B8 Clothing",
    "B8 Football Club",
    "B8 Charity",
    "B8 Education",
    "B8 Careers"
  ]
};`;

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
    <div className="project-page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="project-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="project-header">
          <motion.img
            src={`${process.env.PUBLIC_URL}/logos/B8.png`}
            alt="B8 Logo"
            className="project-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="project-title">
            <span className="code-comment">//</span> B8 Network
          </h1>
          <Terminal
            lines={[
              "const b8 = {",
              "  name: 'B8 Network',",
              "  type: 'Marketing Firm & Business Network',",
              "  description: 'Unleashing potential through innovation',",
              "  url: 'https://b8network.com'",
              "};"
            ]}
            prompt=">"
            typingSpeed={80}
            autoStart={true}
            className="project-terminal"
            title="project.js"
          />
        </div>

        <div className="project-content">
          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Project Information
            </h2>
            <CodeBlock
              code={projectInfo}
              language="javascript"
              showLineNumbers={true}
              copyable={false}
            />
            <a
              href="https://b8network.com"
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button"
            >
              Visit the Website →
            </a>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> About B8 Network
            </h2>
            <p className="section-description">
              B8 Network is an ambitious venture poised to revolutionize multiple sectors through innovation and community-driven growth. While currently focused on delivering cutting-edge marketing solutions, B8's vision extends across various industries including automotive, fashion, sports, education, and charitable initiatives.
            </p>
            <p className="section-description">
              The network is designed to create synergy between different business verticals, fostering a comprehensive ecosystem where each sector complements and strengthens the others.
            </p>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Business Verticals
            </h2>
            <div className="business-grid">
              {businesses.map((business, index) => (
                <motion.div
                  key={index}
                  className="business-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <h3 className="business-name">{business.name}</h3>
                  <p className="business-description">{business.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="project-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="section-title">
              <span className="code-comment">//</span> Media Showcase
            </h2>
            <div className="media-controls">
              <button
                className={`media-button ${activeMediaType === 'images' ? 'active' : ''}`}
                onClick={() => setActiveMediaType('images')}
              >
                Images
              </button>
              <button
                className={`media-button ${activeMediaType === 'videos' ? 'active' : ''}`}
                onClick={() => setActiveMediaType('videos')}
              >
                Videos
              </button>
            </div>
            <div className="project-media">
              {activeMediaType === 'images' &&
                mediaSection.images.map((image, index) => (
                  <motion.div
                    key={index}
                    className="media-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    whileHover={{ y: -5 }}
                    onClick={() => {
                      trackMediaClick('image', image.src, image.title);
                      setSelectedMedia(image);
                    }}
                  >
                    <img src={image.src} alt={image.title} className="project-image" />
                    <p className="media-caption">{image.title}</p>
                  </motion.div>
                ))}
              {activeMediaType === 'videos' &&
                mediaSection.videos.map((video, index) => (
                  <motion.div
                    key={index}
                    className="media-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => {
                      trackMediaClick('video', video.src, video.title);
                    }}
                  >
                    <video controls className="project-video-preview">
                      <source src={video.src} type="video/mp4" />
                      Your browser does not support video playback.
                    </video>
                    <p className="media-caption">{video.title}</p>
                  </motion.div>
                ))}
            </div>
          </motion.section>
        </div>

        {selectedMedia && (
          <div className="modal" onClick={() => setSelectedMedia(null)}>
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedMedia(null)}>
                ×
              </button>
              <img
                src={selectedMedia.src}
                alt={selectedMedia.title}
                className="modal-image"
              />
              <p className="modal-caption">{selectedMedia.title}</p>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
