import React from 'react';
import { cn } from '@/lib/utils';
import ComingSoonTape from './ComingSoonTape';
import './coming-soon-tape-host.css';

type ComingSoonLockedSurfaceProps = {
  locked?: boolean;
  className?: string;
  children: React.ReactNode;
};

const ComingSoonLockedSurface: React.FC<ComingSoonLockedSurfaceProps> = ({
  locked = false,
  className,
  children,
}) => {
  if (!locked) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn('coming-soon-locked', className)}
      aria-disabled="true"
    >
      <span className="sr-only">Coming soon</span>
      <ComingSoonTape />
      <div className="coming-soon-locked__content coming-soon-locked__content--dimmed">
        {children}
      </div>
    </div>
  );
};

export default ComingSoonLockedSurface;
