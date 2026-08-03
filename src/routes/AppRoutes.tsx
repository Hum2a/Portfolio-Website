import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Homepage from '../pages/Homepage';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import RouteFallback from '../components/layout/RouteFallback';

const Projects = lazy(() => import('../pages/Projects'));
const Contact = lazy(() => import('../pages/Contact'));
const About = lazy(() => import('../pages/About'));
const Breathapplyser = lazy(() => import('../projects/Breathapplyser'));
const BiasLens = lazy(() => import('../projects/BiasLens'));
const LifeSmart = lazy(() => import('../projects/LifeSmart'));
const NetworthTool = lazy(() => import('../projects/NetworthTool'));
const Mentage = lazy(() => import('../projects/Mentage'));
const Therabot = lazy(() => import('../projects/Therabot'));
const CulinAIry = lazy(() => import('../projects/Culinairy'));
const DadJokeGenerator = lazy(() => import('../projects/DadJokeGenerator'));
const DoomScroll = lazy(() => import('../projects/Doomscroll'));
const Contrarian = lazy(() => import('../projects/Contrarian'));
const LiberalDemocrats = lazy(() => import('../projects/LiberalDemocrats'));
const PNGtoSVG = lazy(() => import('../projects/PNGtoSVG'));
const DoppelganCar = lazy(() => import('../projects/DoppelganCar'));
const Bgr8 = lazy(() => import('../projects/Bgr8'));
const Monzo1pChallenge = lazy(() => import('../projects/Monzo1pChallenge'));
const Recount = lazy(() => import('../projects/Recount'));
const Imposter = lazy(() => import('../projects/Imposter'));
const MinistryOfJustice = lazy(() => import('../projects/MinistryOfJustice'));
const Flashcards = lazy(() => import('../projects/Flashcards'));
const BruteForcer = lazy(() => import('../projects/BruteForcer'));
const Gremlins = lazy(() => import('../projects/Gremlins'));
const FireWatch = lazy(() => import('../projects/FireWatch'));
const FeatureCards = lazy(() => import('../projects/FeatureCards'));
const Oche = lazy(() => import('../projects/Oche'));
const Blitz = lazy(() => import('../projects/Blitz'));
const Buzzer = lazy(() => import('../projects/Buzzer'));
const Encore = lazy(() => import('../projects/Encore'));
const BaseerPortfolio = lazy(() => import('../projects/BaseerPortfolio'));
const Docket = lazy(() => import('../projects/Docket'));
const DocketBaseer = lazy(() => import('../projects/DocketBaseer'));
const BakesByOlayide = lazy(() => import('../projects/BakesByOlayide'));
const HumzaLogin = lazy(() => import('../pages/HumzaLogin'));
const Traffic = lazy(() => import('../pages/Traffic'));
const GitHub = lazy(() => import('../pages/GitHub'));
const LinkedIn = lazy(() => import('../pages/LinkedIn'));
const NotFound = lazy(() => import('../pages/NotFound'));

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = { duration: 0.25, ease: [0.4, 0, 0.2, 1] };

const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        style={{ minHeight: '100%' }}
      >
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Homepage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/breathapplyser" element={<Breathapplyser />} />
            <Route path="/breathapplyser-v2" element={<Breathapplyser />} />
            <Route path="/biaslens" element={<BiasLens />} />
            <Route path="/lifesmart" element={<LifeSmart />} />
            <Route path="/networth-tool" element={<NetworthTool />} />
            <Route path="/mentage" element={<Mentage />} />
            <Route path="/therabot" element={<Therabot />} />
            <Route path="/culinary" element={<CulinAIry />} />
            <Route path="/dadjokegenerator" element={<DadJokeGenerator />} />
            <Route path="/doomscroll" element={<DoomScroll />} />
            <Route path="/contrarian" element={<Contrarian />} />
            <Route path="/ldmf" element={<LiberalDemocrats />} />
            <Route path="/pngtosvg" element={<PNGtoSVG />} />
            <Route path="/doppelgancar" element={<DoppelganCar />} />
            <Route path="/bgr8" element={<Bgr8 />} />
            <Route path="/monzo1pchallenge" element={<Monzo1pChallenge />} />
            <Route path="/recount" element={<Recount />} />
            <Route path="/imposter" element={<Imposter />} />
            <Route path="/ministryofjustice" element={<MinistryOfJustice />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/bruteforcer" element={<BruteForcer />} />
            <Route path="/gremlins" element={<Gremlins />} />
            <Route path="/firewatch" element={<FireWatch />} />
            <Route path="/feature-cards" element={<FeatureCards />} />
            <Route path="/oche" element={<Oche />} />
            <Route path="/blitz" element={<Blitz />} />
            <Route path="/buzzer" element={<Buzzer />} />
            <Route path="/encore" element={<Encore />} />
            <Route path="/baseer-portfolio" element={<BaseerPortfolio />} />
            <Route path="/docket" element={<Docket />} />
            <Route path="/docket-baseer" element={<DocketBaseer />} />
            <Route path="/bakesbyolayide" element={<BakesByOlayide />} />
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
