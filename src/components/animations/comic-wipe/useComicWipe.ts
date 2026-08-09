import { createContext, useContext } from 'react';
import type { NavigateOptions, To } from 'react-router-dom';

export type ComicWipeContextValue = {
  bypassNextNavigation: () => void;
  navigateWithoutWipe: (to: To, options?: NavigateOptions) => void;
};

export const ComicWipeContext = createContext<ComicWipeContextValue | null>(
  null
);

export function useComicWipe(): ComicWipeContextValue {
  const ctx = useContext(ComicWipeContext);
  if (!ctx) {
    throw new Error('useComicWipe must be used within ComicWipeProvider');
  }
  return ctx;
}
