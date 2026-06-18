import React, { useState } from 'react';
import ProjectLayout from '../components/projects/ProjectLayout';
import './Flashcards.css';

const FLASHCARDS_URL = 'https://flashcards-pj01.onrender.com';

const terminalLines = [
  "const flashcards = {",
  "  name: 'Flashcards',",
  "  type: 'Web Application',",
  "  description: 'Interactive flashcard application for learning',",
  "  url: 'https://flashcards-pj01.onrender.com'",
  "};",
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

const Flashcards = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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
    <ProjectLayout
      title="Flashcards"
      terminalLines={terminalLines}
      codeSnippet={projectInfo}
      embedUrl={FLASHCARDS_URL}
      embedTitle="Flashcards"
    >
      <div>
        <a
          href={FLASHCARDS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="external-link-button"
        >
          Visit the Website →
        </a>
      </div>

      <section className="project-section">
        <h2 className="section-title">
          <span className="code-comment">{'//'}</span> Interactive Demo
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
      </section>
    </ProjectLayout>
  );
};

export default Flashcards;
