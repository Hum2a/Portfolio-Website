import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
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
