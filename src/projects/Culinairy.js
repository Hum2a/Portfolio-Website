import React from "react";
import "../styles/Culinairy.css";

const CulinAIry = () => {
  const images = [
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Dietary Pref.png`, caption: "Dietary Preferences" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Homepage.png`, caption: "Homepage" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Ingredients.png`, caption: "Ingredients Entry" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Login page.png`, caption: "Login and Register" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Meal Planner.png`, caption: "Meal Planner" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/MealsPlaned.png`, caption: "Planned Meals" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Profile.png`, caption: "Profile Settings" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Recipe Generated.png`, caption: "Recipe Generated" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/Saved Recipes Closed.png`, caption: "Saved Recipes Overview" },
    { src: `${process.env.PUBLIC_URL}/images/Culinairy/SaveD Recipes Expanded.png`, caption: "Saved Recipes Expanded" },
  ];

  return (
    <div className="culinary-container">
      <img
        src={`${process.env.PUBLIC_URL}/logos/Culinairy.png`}
        alt="CulinAIry Logo"
        className="culinairy-logo"
      />
      <h1>CulinAIry</h1>
      <p>An AI-powered recipe generator for personalized meals.</p>
      <div className="culinary-images">
        {images.map((image, index) => (
          <div key={index} className="image-container">
            <img src={image.src} alt={image.caption} className="culinary-image" />
            <p className="image-caption">{image.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CulinAIry;
