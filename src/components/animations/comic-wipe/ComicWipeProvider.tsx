import React, { useCallback, useEffect, useRef } from 'react';
import {
  useBlocker,
  type BlockerFunction,
  type NavigateOptions,
  type To,
  useNavigate,
} from 'react-router-dom';
import { prefetchRoute, prefetchRouteWithin } from '@/utils/prefetchRoute';
import { focusMainContent } from '@/lib/scroll';
import { isComicWipeBusy, runComicWipe } from './comicWipe';
import { ComicWipeContext } from './useComicWipe';

type ComicWipeProviderProps = {
  children: React.ReactNode;
};

const ComicWipeProvider: React.FC<ComicWipeProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const bypassRef = useRef(false);
  const handlingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const bypassNextNavigation = useCallback(() => {
    bypassRef.current = true;
  }, []);

  const navigateWithoutWipe = useCallback(
    (to: To, options?: NavigateOptions) => {
      bypassRef.current = true;
      navigate(to, options);
    },
    [navigate]
  );

  const shouldBlock = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) => {
      if (bypassRef.current) {
        bypassRef.current = false;
        return false;
      }
      return currentLocation.pathname !== nextLocation.pathname;
    },
    []
  );

  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker.state !== 'blocked' || handlingRef.current) return;

    handlingRef.current = true;
    const pathname = blocker.location.pathname;
    // Start loading the target chunk while the panels fly in.
    void prefetchRoute(pathname);
    const controller = new AbortController();
    abortRef.current = controller;

    void runComicWipe(async () => {
      await prefetchRouteWithin(pathname, 900);
      blocker.proceed?.();
    }, controller.signal).then((started) => {
      handlingRef.current = false;
      abortRef.current = null;
      if (!started) {
        if (blocker.state === 'blocked') {
          blocker.reset?.();
        }
        return;
      }
      if (!controller.signal.aborted) focusMainContent();
    });
  }, [blocker]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (blocker.state === 'blocked' && isComicWipeBusy()) {
        blocker.reset?.();
      }
    };
  }, [blocker]);

  return (
    <ComicWipeContext.Provider
      value={{ bypassNextNavigation, navigateWithoutWipe }}
    >
      {children}
    </ComicWipeContext.Provider>
  );
};

export default ComicWipeProvider;
