// B8.js
import React from 'react';
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

export default function B8() {
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
    </div>
  );
} 
