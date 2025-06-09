import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Stars from "../components/Stars";
import Clouds from "../components/Clouds";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="retro-container">
      <div className="retro-bg">
        <Stars/>
        <Clouds />
        <h1 className="title">SKILL QUEST<br /></h1><br /><br />
        <h2 className="subtitle">Helping recruiters find top talent quickly</h2><br /><br />
        <button className="upload-btn" onClick={() => navigate("/analyze")}>
          LET THE GAMES BEGIN
        </button>
        <div className="grass"></div>
      </div>
    </div>
  );
};

export default HomePage;
