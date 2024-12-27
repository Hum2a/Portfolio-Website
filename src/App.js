import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import Navigation from "./components/navigation";

const App = () => {
  return (
    <Router>
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        <Navigation />
      </div>
    </Router>
  );
};

export default App;
