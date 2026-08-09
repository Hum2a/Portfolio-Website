import React, { useCallback, useEffect, useRef } from 'react';
import {
  useBlocker,
  type BlockerFunction,
  type NavigateOptions,
  type To,
  useNavigate,
} from 'react-router-dom';
import { isComicWipeBusy, runComicWipe } from './comicWipe';
import { ComicWipeContext } from './useComicWipe';

type ComicWipeProviderProps = {
  children: React.ReactNode;
};

const ComicWipeProvider: React.FC<ComicWipeProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const bypassRef = useRef(false);
  const handlingRef = useRef(false);

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

    void runComicWipe(() => {
      blocker.proceed?.();
    }).then((started) => {
      handlingRef.current = false;
      if (!started) {
        if (blocker.state === 'blocked') {
          blocker.reset?.();
        }
      }
    });
  }, [blocker]);

  useEffect(() => {
    return () => {
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
