import React, { useLayoutEffect } from 'react';
import { Navigate, type To } from 'react-router-dom';
import { useComicWipe } from './useComicWipe';

type NavigateWithoutWipeProps = {
  to: To;
  replace?: boolean;
};

const NavigateWithoutWipe: React.FC<NavigateWithoutWipeProps> = ({
  to,
  replace = true,
}) => {
  const { bypassNextNavigation } = useComicWipe();

  useLayoutEffect(() => {
    bypassNextNavigation();
  }, [bypassNextNavigation]);

  return <Navigate to={to} replace={replace} />;
};

export default NavigateWithoutWipe;
