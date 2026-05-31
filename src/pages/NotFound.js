import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const NotFound = () => {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "3rem", margin: 0 }}>404</h1>
        <p style={{ fontSize: "1.25rem", marginTop: "0.5rem" }}>
          Page not found
        </p>
        <Link to="/" style={{ marginTop: "1.5rem", textDecoration: "underline" }}>
          Back to home
        </Link>
      </main>
    </>
  );
};

export default NotFound;
