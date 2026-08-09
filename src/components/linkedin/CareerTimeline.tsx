import React, { useRef } from 'react';
import { useInView } from 'framer-motion';
import {
  CensoredText,
  STAGGER_MS,
} from '../animations/content-declassification';
import { formatLinkedInDateRange } from '../../services/linkedinService';
import './CareerTimeline.css';

export type CareerRole = {
  id: string;
  title: string;
  company: string;
  companyUrl?: string | null;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  highlights?: string[];
  tech?: string[];
  clients?: string[];
};

type Props = {
  roles: CareerRole[];
  className?: string;
};

type ItemProps = {
  role: CareerRole;
};

function createCensorSlot() {
  let index = 0;
  return () => {
    const slot = index;
    index += 1;
    return { variantIndex: slot, delayMs: slot * STAGGER_MS };
  };
}

function CareerTimelineItem({ role }: ItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' });
  const nextCensor = createCensorSlot();

  const titleSlot = nextCensor();
  const companySlot = nextCensor();

  return (
    <li ref={ref} className="career-timeline-item">
      <div className="career-timeline-gutter">
        <time className="career-timeline-dates">
          {formatLinkedInDateRange(
            role.startDate,
            role.endDate,
            role.current
          )}
        </time>
      </div>
      <div className="career-timeline-rail" aria-hidden="true">
        <span className="career-timeline-dot" />
      </div>
      <div className="career-timeline-body cdc-host">
        <h3 className="career-timeline-title">
          <CensoredText active={isInView} {...titleSlot}>
            {role.title}
          </CensoredText>
        </h3>
        <p className="career-timeline-company">
          {role.companyUrl ? (
            <a
              href={role.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CensoredText active={isInView} {...companySlot}>
                {role.company}
              </CensoredText>
            </a>
          ) : (
            <CensoredText active={isInView} {...companySlot}>
              {role.company}
            </CensoredText>
          )}
        </p>
        {role.clients && role.clients.length > 0 && (
          <ul className="career-timeline-clients" aria-label="Enterprise clients">
            {role.clients.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        )}
        {role.highlights?.[0] && (
          <p className="career-timeline-prose">
            <CensoredText active={isInView} {...nextCensor()}>
              {role.highlights[0]}
            </CensoredText>
          </p>
        )}
        {role.highlights && role.highlights.length > 1 && (
          <ul className="career-timeline-highlights">
            {role.highlights.slice(1).map((h) => (
              <li key={h.slice(0, 40)}>
                <CensoredText active={isInView} {...nextCensor()}>
                  {h}
                </CensoredText>
              </li>
            ))}
          </ul>
        )}
        {role.tech && role.tech.length > 0 && (
          <ul className="career-timeline-tech" aria-label="Technologies">
            {role.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

/**
 * Brittany Chiang–style timeline: mono date gutter, rail + dots, no card borders.
 */
const CareerTimeline: React.FC<Props> = ({ roles, className = '' }) => {
  if (!roles.length) return null;

  return (
    <ol className={`career-timeline ${className}`.trim()}>
      {roles.map((role) => (
        <CareerTimelineItem key={role.id} role={role} />
      ))}
    </ol>
  );
};

export default CareerTimeline;
