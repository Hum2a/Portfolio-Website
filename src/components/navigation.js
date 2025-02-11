import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import Projects from "../pages/Projects";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Breathapplyser from "../projects/Breathapplyser";
import BiasLens from "../projects/BiasLens";
import LifeSmart from "../projects/LifeSmart";
import Mentage from "../projects/Mentage";
import Therabot from "../projects/Therabot";
import CulinAIry from "../projects/Culinairy";
import DadJokeGenerator from "../projects/DadJokeGenerator";
import DoomScroll from "../projects/Doomscroll";
import Contrarian from "../projects/Contrarian";
import LiberalDemocrats from "../projects/LiberalDemocrats";
import PNGtoSVG from "../projects/PNGtoSVG";
import DoppelganCar from "../projects/DoppelganCar";
import B8 from "../projects/B8";

const Navigation = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/About" element={<About />} />
      <Route path="/breathapplyser" element={<Breathapplyser />} />
      <Route path="/biaslens" element={<BiasLens />} />
      <Route path="/lifesmart" element={<LifeSmart />} />
      <Route path="/mentage" element={<Mentage />} />
      <Route path="/therabot" element={<Therabot />} />
      <Route path="/culinary" element={<CulinAIry />} />
      <Route path="/dadjokegenerator" element={<DadJokeGenerator />} />
      <Route path="/doomscroll" element={<DoomScroll />} />
      <Route path="/contrarian" element={<Contrarian />} />
      <Route path="/ldmf" element={<LiberalDemocrats />} />
      <Route path="/pngtosvg" element={<PNGtoSVG />} />
      <Route path="/doppelgancar" element={<DoppelganCar />} />
      <Route path="/b8" element={<B8 />} />
    </Routes>
  );
};

export default Navigation;
