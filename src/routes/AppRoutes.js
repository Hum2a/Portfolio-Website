import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Homepage from "../pages/Homepage";
import Projects from "../pages/Projects";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Breathapplyser from "../projects/Breathapplyser";
import BiasLens from "../projects/BiasLens";
import LifeSmart from "../projects/LifeSmart";
import NetworthTool from "../projects/NetworthTool";
import Mentage from "../projects/Mentage";
import Therabot from "../projects/Therabot";
import CulinAIry from "../projects/Culinairy";
import DadJokeGenerator from "../projects/DadJokeGenerator";
import DoomScroll from "../projects/Doomscroll";
import Contrarian from "../projects/Contrarian";
import LiberalDemocrats from "../projects/LiberalDemocrats";
import PNGtoSVG from "../projects/PNGtoSVG";
import DoppelganCar from "../projects/DoppelganCar";
import Bgr8 from "../projects/Bgr8";
import Monzo1pChallenge from "../projects/Monzo1pChallenge";
import Recount from "../projects/Recount";
import Imposter from "../projects/Imposter";
import MinistryOfJustice from "../projects/MinistryOfJustice";
import Flashcards from "../projects/Flashcards";
import BruteForcer from "../projects/BruteForcer";
import Gremlins from "../projects/Gremlins";
import FireWatch from "../projects/FireWatch";
import FeatureCards from "../projects/FeatureCards";
import Oche from "../projects/Oche";
import Blitz from "../projects/Blitz";
import Buzzer from "../projects/Buzzer";
import Encore from "../projects/Encore";
import BakesByOlayide from "../projects/BakesByOlayide";
import HumzaLogin from "../pages/HumzaLogin";
import Traffic from "../pages/Traffic";
import GitHub from "../pages/GitHub";
import LinkedIn from "../pages/LinkedIn";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/auth/ProtectedRoute";

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
      </motion.div>
    </AnimatePresence>
  );
};

export default AppRoutes; 