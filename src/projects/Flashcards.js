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
      
      <div className="flashcards-content">
        <h1 className="flashcards-title">React Flashcards</h1>
        <p className="flashcards-subtitle">Test your knowledge with these interactive flashcards</p>

        <div className="flashcard-wrapper">
          <div 
            className={`flashcard ${isFlipped ? 'flipped' : ''} ${isAnimating ? 'animating' : ''}`}
            onClick={handleFlip}
          >
            <div className="flashcard-front">
              <h2>Question</h2>
              <p>{cards[currentCard].question}</p>
              <div className="flashcard-hint">Click to flip</div>
            </div>
            <div className="flashcard-back">
              <h2>Answer</h2>
              <p>{cards[currentCard].answer}</p>
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
    </div>
  );
};

export default Flashcards;
