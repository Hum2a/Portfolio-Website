// B8.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import HamburgerMenu from '../components/HamburgerMenu';
import { motion } from 'framer-motion';
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
    { src: '/images/B8/Homepage.png', title: 'B8 Homepage' },
    { src: '/images/B8/Marketing.png', title: 'B8 Marketing' },
    { src: '/images/B8/CarClub.png', title: 'B8 Car Club' },
    { src: '/images/B8/Clothing.png', title: 'B8 Clothing' },
    { src: '/images/B8/League.png', title: 'B8 League' },
    { src: '/images/B8/World.png', title: 'B8 World' },
    { src: '/images/B8/Bgr8.png', title: 'BGr8' },
    { src: '/images/B8/Medical.png', title: 'B8 Medical' },
    { src: '/images/B8/Podcast.png', title: 'B8 Podcast' },
    // Admin Portal Images
    { src: '/images/B8/AdminPortalAnalytics.png', title: 'Admin Portal Analytics' },
    { src: '/images/B8/AdminPortalUsers.png', title: 'Admin Portal Users' },
    { src: '/images/B8/AdminPortalEnquiries.png', title: 'Admin Portal Enquiries' },
    { src: '/images/B8/AdminPortalSettings.png', title: 'Admin Portal Settings' },
  ],
  videos: [
    { src: '/videos/B8/Profile.mp4', title: 'B8 Profile' },
    { src: '/videos/B8/Glitch.mp4', title: 'B8 Glitch Effect' },
  ]
};

export default function B8() {
  const [activeMediaType, setActiveMediaType] = useState('images');
  const [selectedMedia, setSelectedMedia] = useState(null);

  return (
    <div className="page">
      <Navbar />
      <section className="hero">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          Welcome to B8
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5, duration: 1.5 }}
        >
          Unleashing potential through innovation and determination.
        </motion.p>
        <motion.a 
          href="https://b8network.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="network-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter B8 Network
        </motion.a>
      </section>

      <motion.section 
        className="content-section about-b8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>About B8 Network</h2>
        <div className="content-grid">
          <div className="content-text">
            <p>B8 Network is an ambitious venture poised to revolutionize multiple sectors through innovation and community-driven growth. While currently focused on delivering cutting-edge marketing solutions, B8's vision extends across various industries including automotive, fashion, sports, education, and charitable initiatives.</p>
            <p>The network is designed to create synergy between different business verticals, fostering a comprehensive ecosystem where each sector complements and strengthens the others.</p>
          </div>
          <motion.div 
            className="content-highlight"
            whileHover={{ scale: 1.02 }}
          >
            <h3>Current Focus</h3>
            <p>B8 Marketing leads the network's current operations, delivering innovative digital marketing strategies and solutions to clients across various industries.</p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="content-section development"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2>Development Journey</h2>
        <div className="tech-grid">
          <motion.div 
            className="tech-card"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 0, 0, 0.3)" }}
          >
            <h3>Frontend Development</h3>
            <ul>
              <li>Custom UI/UX design implementation</li>
              <li>Responsive layouts across all devices</li>
              <li>Interactive animations and transitions</li>
              <li>Performance-optimized React components</li>
            </ul>
          </motion.div>

          <motion.div 
            className="tech-card"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 0, 0, 0.3)" }}
          >
            <h3>Backend Architecture</h3>
            <ul>
              <li>Robust API development</li>
              <li>Secure authentication system</li>
              <li>Database design and optimization</li>
              <li>Scalable server infrastructure</li>
            </ul>
          </motion.div>

          <motion.div 
            className="tech-card"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 0, 0, 0.3)" }}
          >
            <h3>Custom CMS</h3>
            <ul>
              <li>Dynamic content management</li>
              <li>User-friendly admin interface</li>
              <li>Real-time content updates</li>
              <li>Role-based access control</li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      <section className="business-cards">
        {businesses.map((business, index) => (
          <motion.div
            key={index}
            className="business-card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 0 20px rgba(255, 0, 0, 0.3)"
            }}
          >
            <h3>{business.name}</h3>
            <p>{business.description}</p>
            <a href={business.link}>Explore →</a>
          </motion.div>
        ))}
      </section>

      <section className="media-showcase">
        <motion.div 
          className="media-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            className={`media-button ${activeMediaType === 'images' ? 'active' : ''}`}
            onClick={() => setActiveMediaType('images')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Images
          </motion.button>
          <motion.button
            className={`media-button ${activeMediaType === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveMediaType('videos')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Videos
          </motion.button>
        </motion.div>

        <div className="media-grid">
          {activeMediaType === 'images' && 
            mediaSection.images.map((image, index) => (
              <motion.div
                key={index}
                className="media-item"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedMedia(image)}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)"
                }}
              >
                <img src={image.src} alt={image.title} />
                <div className="media-overlay">
                  <h4>{image.title}</h4>
                </div>
              </motion.div>
            ))
          }
          
          {activeMediaType === 'videos' && 
            mediaSection.videos.map((video, index) => (
              <motion.div
                key={index}
                className="media-item video-item"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <video controls>
                  <source src={video.src} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
                <div className="media-overlay">
                  <h4>{video.title}</h4>
                </div>
              </motion.div>
            ))
          }
        </div>
      </section>

      {selectedMedia && (
        <motion.div 
          className="media-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedMedia(null)}
        >
          <motion.img 
            src={selectedMedia.src} 
            alt={selectedMedia.title}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          />
          <button className="close-button" onClick={() => setSelectedMedia(null)}>×</button>
        </motion.div>
      )}
    </div>
  );
} 
