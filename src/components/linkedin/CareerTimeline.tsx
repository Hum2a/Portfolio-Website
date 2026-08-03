import React from 'react';
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

/**
 * Brittany Chiang–style timeline: mono date gutter, rail + dots, no card borders.
 */
const CareerTimeline: React.FC<Props> = ({ roles, className = '' }) => {
  if (!roles.length) return null;

  return (
    <ol className={`career-timeline ${className}`.trim()}>
      {roles.map((role) => (
        <li key={role.id} className="career-timeline-item">
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
          <div className="career-timeline-body">
            <h3 className="career-timeline-title">{role.title}</h3>
            <p className="career-timeline-company">
              {role.companyUrl ? (
                <a
                  href={role.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {role.company}
                </a>
              ) : (
                role.company
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
              <p className="career-timeline-prose">{role.highlights[0]}</p>
            )}
            {role.highlights && role.highlights.length > 1 && (
              <ul className="career-timeline-highlights">
                {role.highlights.slice(1).map((h) => (
                  <li key={h.slice(0, 40)}>{h}</li>
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
      ))}
    </ol>
  );
};

export default CareerTimeline;
