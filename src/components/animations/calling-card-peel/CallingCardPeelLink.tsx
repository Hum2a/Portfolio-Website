import React, { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComicWipe } from '../comic-wipe/useComicWipe';
import { CallingCardPeel } from './CallingCardPeel';
import { isPeelBusy, peelCallingCard } from './peelCallingCard';
import { prefetchRoute } from '@/utils/prefetchRoute';
import { playPageEnter } from '@/lib/scroll';

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
    playPageEnter();
  }, [bypassNextNavigation, navigate, to]);

  const runPeel = useCallback(() => {
    const root = rootRef.current;
    if (!root) {
      navigateToTarget();
      return;
    }
    if (isPeelBusy(root)) return;

    void prefetchRoute(to);
    // Navigate as the release begins; the incoming page fades in over the tail.
    void peelCallingCard(root, undefined, { onRelease: navigateToTarget });
  }, [navigateToTarget, to]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (isModifiedClick(event)) return;
      event.preventDefault();
      runPeel();
    },
    [runPeel]
  );

  const prefetch = useCallback(() => {
    void prefetchRoute(to);
  }, [to]);

  const handlePointerDown = useCallback(() => {
    prefetch();
    rootRef.current?.classList.add('ccp--pressed');
  }, [prefetch]);

  const clearPressed = useCallback(() => {
    rootRef.current?.classList.remove('ccp--pressed');
  }, []);

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
      onPointerEnter={prefetch}
      onFocus={prefetch}
      onPointerDown={handlePointerDown}
      onPointerUp={clearPressed}
      onPointerLeave={clearPressed}
      onPointerCancel={clearPressed}
    >
      {enhancedChild}
    </CallingCardPeel>
  );
}
