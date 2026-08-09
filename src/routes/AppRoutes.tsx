import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Homepage from '../pages/Homepage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import RouteFallback from '../components/layout/RouteFallback';
import NavigateWithoutWipe from '../components/animations/comic-wipe/NavigateWithoutWipe';
import { getProjectRoutePaths } from '../data/projects';

const Projects = lazy(() => import('../pages/Projects'));
const Contact = lazy(() => import('../pages/Contact'));
const About = lazy(() => import('../pages/About'));
const ProjectCaseStudyPage = lazy(() => import('../pages/ProjectCaseStudyPage'));
const HumzaLogin = lazy(() => import('../pages/HumzaLogin'));
const Traffic = lazy(() => import('../pages/Traffic'));
const GitHub = lazy(() => import('../pages/GitHub'));
const LinkedIn = lazy(() => import('../pages/LinkedIn'));
const NotFound = lazy(() => import('../pages/NotFound'));

const projectPaths = getProjectRoutePaths();

const AppRoutes = () => {
  const location = useLocation();
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes location={location}>
        <Route path="/" element={<Homepage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        {projectPaths.map((path) => (
          <Route
            key={path}
            path={path}
            element={<ProjectCaseStudyPage />}
          />
        ))}
        <Route path="/humza-login" element={<HumzaLogin />} />
        <Route path="/github" element={<GitHub />} />
        <Route path="/career" element={<LinkedIn />} />
        <Route path="/linkedin" element={<NavigateWithoutWipe to="/career" />} />
        <Route
          path="/traffic"
          element={
            <ProtectedRoute requiredRole="humza">
              <Traffic />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
