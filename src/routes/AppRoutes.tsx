import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Homepage from '../pages/Homepage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import RouteFallback from '../components/layout/RouteFallback';
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

const pageTransition = { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const };

const projectPaths = getProjectRoutePaths();

const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={pageTransition}
        style={{ minHeight: '100%' }}
      >
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
            <Route path="/linkedin" element={<Navigate to="/career" replace />} />
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
      </motion.div>
    </AnimatePresence>
  );
};

export default AppRoutes;
