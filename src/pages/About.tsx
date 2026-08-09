import React, { useCallback, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Seo from '../components/seo/Seo';
import './About.css';

/** Narrative blurbs; six are chosen at random per visit. */
const PROFESSIONAL_JOURNEY_SPOTLIGHTS = [
  {
    name: 'Breathapplyser',
    description: 'Android and iOS app tracking alcohol intake',
    metaLabel: 'features',
    metaItems: ['Real-time BAC calculation', 'Drink tracking'],
  },
  {
    name: 'TheraBot',
    description: 'Conversational AI mental health support chatbot',
    metaLabel: 'platforms',
    metaItems: ['WhatsApp', 'React Web'],
  },
  {
    name: 'CulinAIry',
    description: 'AI-powered recipe generator for personalized meals',
    metaLabel: 'tech',
    metaItems: ['AI', 'React', 'Firebase'],
  },
  {
    name: 'BiasLens',
    description: 'News aggregator analyzing sentiment and political bias',
    metaLabel: 'tech',
    metaItems: ['NLP', 'Next.js', 'Python'],
  },
  {
    name: 'LifeSmart',
    description: 'Financial literacy tools with stock market simulators',
    metaLabel: 'features',
    metaItems: ['Asset simulators', 'Educational tools'],
  },
  {
    name: 'Gremlins',
    description:
      'Playful Windows tray companion with configurable gremlins and quiet hours',
    metaLabel: 'tech',
    metaItems: ['C#', '.NET', 'WPF', 'React'],
  },
  {
    name: 'Recount',
    description: 'Productivity suite: extension and dashboard for time and focus',
    metaLabel: 'tech',
    metaItems: ['Chrome MV3', 'Next.js', 'Supabase'],
  },
  {
    name: 'Brute-forcer',
    description: 'Client-side password entropy and crack-time estimator',
    metaLabel: 'features',
    metaItems: ['Privacy-first', 'Live demo'],
  },
];

const JOURNEY_VISIBLE_COUNT = 6;

/** CV stack list verbatim (audit §7.3) */
const SKILL_GROUPS = [
  {
    label: 'Frontend',
    items: [
      'TypeScript',
      'JavaScript',
      'React',
      'React Native',
      'Vue',
      'Vite',
      'Tailwind',
    ],
  },
  {
    label: 'Backend',
    items: [
      'Node.js',
      'Express',
      'Hono',
      'Python',
      'Flask',
      'C#',
      'REST APIs',
    ],
  },
  {
    label: 'Data',
    items: [
      'PostgreSQL',
      'SQL',
      'SQLite',
      'Firebase/Firestore',
      'ETL pipelines',
    ],
  },
  {
    label: 'Cloud',
    items: [
      'AWS',
      'Azure',
      'Cloudflare Workers',
      'Docker',
      'CI/CD',
      'GitHub Actions',
    ],
  },
  {
    label: 'Practices',
    items: [
      'Agile/Scrum',
      'unit & integration testing',
      'code review',
      'documentation',
    ],
  },
];

function shuffleCopy(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const About = () => {
  const [journeySpotlights] = useState(() =>
    shuffleCopy(PROFESSIONAL_JOURNEY_SPOTLIGHTS).slice(0, JOURNEY_VISIBLE_COUNT)
  );
  const [selectedJourney, setSelectedJourney] = useState(0);
  const journeyTabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const journeyId = useId().replace(/:/g, '');

  const selectJourney = useCallback(
    (index: number, focus = true) => {
      if (index < 0 || index >= journeySpotlights.length) return;
      setSelectedJourney(index);
      if (focus) journeyTabRefs.current[index]?.focus();
    },
    [journeySpotlights.length]
  );

  const onJourneyKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    i: number
  ) => {
    const key = event.key;
    if (
      key !== 'ArrowRight' &&
      key !== 'ArrowLeft' &&
      key !== 'ArrowDown' &&
      key !== 'ArrowUp' &&
      key !== 'Home' &&
      key !== 'End'
    ) {
      return;
    }
    event.preventDefault();
    const count = journeySpotlights.length;
    let next = i;
    if (key === 'ArrowRight' || key === 'ArrowDown') next = (i + 1) % count;
    if (key === 'ArrowLeft' || key === 'ArrowUp') next = (i - 1 + count) % count;
    if (key === 'Home') next = 0;
    if (key === 'End') next = count - 1;
    selectJourney(next);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="about-page">
      <Seo
        title="About"
        description="About Humza Butt — Software Engineer, Full Stack & Platform Configuration. Background, skills and approach."
        path="/about"
      />

      <motion.div
        className="about-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header className="about-header" variants={itemVariants}>
          <h1 className="about-title">About</h1>
          <p className="about-lede">
            Software Engineer, Full Stack &amp; Platform Configuration. I build
            SaaS platforms, APIs and real-time systems — and configure enterprise
            platforms for Shell, the BBC, the NHS and the Home Office.
          </p>
        </motion.header>

        <motion.section className="about-section" variants={itemVariants}>
          <h2 className="section-title">Professional journey</h2>
          <p className="section-description">
            A rotating sample of shipped work — six at a time (refresh to
            reshuffle). Select a card to bring it forward:
          </p>
          <div
            className="about-spotlight-list"
            role="tablist"
            aria-label="Professional journey"
          >
            {journeySpotlights.map((spotlight, i) => {
              const active = i === selectedJourney;
              return (
                <div
                  key={spotlight.name}
                  ref={(el) => {
                    journeyTabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`${journeyId}-tab-${i}`}
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  className="about-spotlight surface-1"
                  onClick={() => selectJourney(i, false)}
                  onKeyDown={(event) => onJourneyKeyDown(event, i)}
                >
                  <h3 className="about-spotlight-name">{spotlight.name}</h3>
                  <p className="about-spotlight-desc">{spotlight.description}</p>
                  <ul className="about-spotlight-meta">
                    {spotlight.metaItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </motion.section>

        <motion.section className="about-section" variants={itemVariants}>
          <h2 className="section-title">Technical expertise</h2>
          <div className="about-skills">
            {SKILL_GROUPS.map((group) => (
              <div key={group.label} className="about-skill-group">
                <h3 className="about-skill-label">{group.label}</h3>
                <ul className="about-skill-pills">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section className="about-section" variants={itemVariants}>
          <h2 className="section-title">Beyond coding</h2>
          <div className="beyond-coding">
            <div className="activity-item">
              <h3 className="activity-heading">Leadership</h3>
              <p>
                Social Secretary for Japanese &amp; Self Defence Societies at
                University of Portsmouth — nominated for Most Improved Society of
                the Year.
              </p>
            </div>
            <div className="activity-item">
              <h3 className="activity-heading">Sports</h3>
              <p>
                Badminton since age 7; kickboxing 2021–2023; BUCS 22/23 Champions
                with UoP Dodgeball.
              </p>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default About;
