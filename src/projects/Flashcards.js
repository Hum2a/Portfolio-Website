import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HamburgerMenu from '../components/HamburgerMenu';
import '../styles/Flashcards.css';

const Flashcards = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const cards = [
    {
      id: 1,
      question: "What is React?",
      answer: "A JavaScript library for building user interfaces, particularly single-page applications."
    },
    {
      id: 2,
      question: "What is JSX?",
      answer: "A syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files."
    },
    {
      id: 3,
      question: "What is a component in React?",
      answer: "A reusable piece of code that returns a React element to be rendered to the DOM."
    },
    {
      id: 4,
      question: "What is state in React?",
      answer: "An object that stores a component's dynamic data and determines the component's behavior and rendering."
    },
    {
      id: 5,
      question: "What are props in React?",
      answer: "Properties passed from parent to child components to allow data flow between components."
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsFlipped(!isFlipped);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const nextCard = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsFlipped(false);
      setCurrentCard((prev) => (prev + 1) % cards.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevCard = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsFlipped(false);
      setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <div className="flashcards-container">
      {isMobile ? <HamburgerMenu /> : <Navbar />}
      
      <section className="flashcards-description-section">
        <h1 className="flashcards-main-title">Flashcards</h1>
        <p className="flashcards-description">
          Flashcards is a modern web app designed to help you revise faster and more efficiently. With interactive, beautifully animated flashcards, you can test your knowledge, reinforce key concepts, and track your progress—all in a sleek, distraction-free environment. Whether you're preparing for exams, learning a new subject, or just want to boost your memory, Flashcards makes studying engaging and effective. Enjoy features like spaced repetition, real-time progress tracking, and a mobile-friendly interface—so you can learn anytime, anywhere.
        </p>
      </section>

      <div className="flashcards-content">
        <h1 className="flashcards-title">React Flashcards</h1>
        <p className="flashcards-subtitle">Test your knowledge with these interactive flashcards</p>

        <div className="flashcard-wrapper">
          <div 
            className={`flashcard ${isFlipped ? 'flipped' : ''} ${isAnimating ? 'animating' : ''}`}
            onClick={handleFlip}
          >
            <div className="flashcard-face flashcard-front">
              <div className="flashcard-content">
                <h2>Question</h2>
                <p>{cards[currentCard].question}</p>
              </div>
              <div className="flashcard-hint">Click to flip</div>
            </div>
            <div className="flashcard-face flashcard-back">
              <div className="flashcard-content">
                <h2>Answer</h2>
                <p>{cards[currentCard].answer}</p>
              </div>
              <div className="flashcard-hint">Click to flip back</div>
            </div>
          </div>
        </div>

        <div className="flashcard-controls">
          <button 
            className="flashcard-button prev"
            onClick={prevCard}
            disabled={isAnimating}
          >
            Previous
          </button>
          <span className="flashcard-counter">
            {currentCard + 1} / {cards.length}
          </span>
          <button 
            className="flashcard-button next"
            onClick={nextCard}
            disabled={isAnimating}
          >
            Next
          </button>
        </div>
        <a
          href="https://flashcards-pj01.onrender.com"
          className="flashcard-website-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit the Live Flashcards Website
        </a>
      </div>
      <section className="flashcards-brag-section">
        <h2 className="flashcards-brag-title">Engineering Features</h2>
        <div className="flashcards-brag-grid">
          <div className="flashcards-brag-card"><span className="brag-icon">⚛️</span><strong>Modern Tech Stack</strong><br/>React, TypeScript, Material-UI, Firebase, and PWA support.</div>
          <div className="flashcards-brag-card"><span className="brag-icon">🎨</span><strong>Advanced UI/UX</strong><br/>Beautiful gradients, glassmorphism, dark mode, and smooth animations.</div>
          <div className="flashcards-brag-card"><span className="brag-icon">⚡</span><strong>Performance</strong><br/>GZIP, code splitting, caching, and optimized image loading.</div>
          <div className="flashcards-brag-card"><span className="brag-icon">🔒</span><strong>Security</strong><br/>Secure auth, HTTPS, CSP, XSS protection, and more.</div>
          <div className="flashcards-brag-card"><span className="brag-icon">🛠️</span><strong>Dev Experience</strong><br/>Great docs, clear structure, CI/CD, and automated deployment.</div>
          <div className="flashcards-brag-card"><span className="brag-icon">🚀</span><strong>Advanced Features</strong><br/>Real-time sync, spaced repetition, progress tracking, and notifications.</div>
          <div className="flashcards-brag-card"><span className="brag-icon">♿</span><strong>Accessibility</strong><br/>Semantic HTML, ARIA, keyboard nav, and color contrast compliance.</div>
          <div className="flashcards-brag-card"><span className="brag-icon">📱</span><strong>Mobile Optimization</strong><br/>Touch-friendly, responsive, PWA install, and offline support.</div>
        </div>
      </section>
    </div>
  );
};

export default Flashcards;
