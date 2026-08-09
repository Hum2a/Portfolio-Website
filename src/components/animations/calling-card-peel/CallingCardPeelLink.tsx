import React, { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComicWipe } from '../comic-wipe/useComicWipe';
import { CallingCardPeel } from './CallingCardPeel';
import { isPeelBusy, peelCallingCard } from './peelCallingCard';

type Props = {
  to: string;
  className?: string;
  obstructionLabel?: string;
  children: React.ReactElement;
};

function isModifiedClick(event: React.MouseEvent | React.KeyboardEvent) {
  if ('button' in event && event.button !== 0) return true;
  if ('metaKey' in event && (event.metaKey || event.ctrlKey || event.shiftKey)) {
    return true;
  }
  return false;
}

export function CallingCardPeelLink({
  to,
  className = '',
  obstructionLabel = 'CLASSIFIED',
  children,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { bypassNextNavigation } = useComicWipe();

  const navigateToTarget = useCallback(() => {
    bypassNextNavigation();
    navigate(to);
  }, [bypassNextNavigation, navigate, to]);

  const runPeel = useCallback(() => {
    const root = rootRef.current;
    if (!root) {
      navigateToTarget();
      return;
    }
    if (isPeelBusy()) return;

    void peelCallingCard(root, navigateToTarget);
  }, [navigateToTarget]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (isModifiedClick(event)) return;
      event.preventDefault();
      runPeel();
    },
    [runPeel]
  );

  const child = React.Children.only(children);
  const enhancedChild = React.cloneElement(child, {
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      child.props.onClick?.(event);
      if (event.defaultPrevented) return;
      handleClick(event);
    },
  });

  return (
    <CallingCardPeel
      rootRef={rootRef}
      className={className}
      obstructionLabel={obstructionLabel}
    >
      {enhancedChild}
    </CallingCardPeel>
  );
}
