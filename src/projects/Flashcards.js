import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import HamburgerMenu from '../components/HamburgerMenu';
import Terminal from '../components/animations/Terminal';
import CodeBlock from '../components/animations/CodeBlock';
import '../styles/project-shared.css';
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

  const projectInfo = `const flashcards = {
  name: "Flashcards",
  type: "Web Application",
  description: "Interactive flashcard application for learning React concepts",
  technologies: [
    "React",
    "CSS3",
    "HTML5"
  ],
  features: [
    "Interactive flashcard flipping",
    "Multiple card sets",
    "Progress tracking",
    "Mobile-friendly interface"
  ]
};`;

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
    <div className="project-page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="project-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="project-header">
          <h1 className="project-title">
            <span className="code-comment">//</span> Flashcards
          </h1>
          <Terminal
            lines={[
              "const flashcards = {",
              "  name: 'Flashcards',",
              "  type: 'Web Application',",
              "  description: 'Interactive flashcard application for learning',",
              "  url: 'https://flashcards-pj01.onrender.com'",
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
              href="https://flashcards-pj01.onrender.com"
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
              <span className="code-comment">//</span> Interactive Demo
            </h2>
            <p className="section-description">
              Test your knowledge with these interactive React flashcards:
            </p>
            <div className="flashcard-wrapper">
              <div 
                className={`flashcard ${isFlipped ? 'flipped' : ''} ${isAnimating ? 'animating' : ''}`}
                onClick={handleFlip}
              >
                <div className="flashcard-face flashcard-front">
                  <div className="flashcard-content">
                    <h3>Question</h3>
                    <p>{cards[currentCard].question}</p>
                  </div>
                  <div className="flashcard-hint">Click to flip</div>
                </div>
                <div className="flashcard-face flashcard-back">
                  <div className="flashcard-content">
                    <h3>Answer</h3>
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
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcards;
