import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import cloud from "../assets/cloud.png";
import star from "../assets/star.png";
import clickCursor from "../assets/cursor-click.png";

const HomePage = () => {
  const navigate = useNavigate();

  const rows = 6;
  const cols = 7;
  const stars = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const left = `${col * (100 / cols) + Math.random() * (100 / cols)}%`;
      const top = `${row * (100 / rows) + Math.random() * (100 / rows)}%`;
      const delay = `${Math.random() * 2}s`;
      const size = Math.random() > 0.5 ? 16 : 8;

      stars.push(
        <img
          key={`${row}-${col}`}
          src={star}
          alt="star"
          className="star"
          style={{
            left,
            top,
            animationDelay: delay,
            width: `${size}px`,
            height: `${size}px`,
          }}
        />
      );
    }
  }

//    useEffect(() => {
//      const style = document.createElement("style");
//      style.innerHTML = `
//        body {
//          cursor: url(${cursor}) 4 4, auto;
//        }
//        body:active {
//          cursor: url(${clickCursor}) 4 4, auto;
//        }
//      `;
//      document.head.appendChild(style);
//
//      return () => {
//        document.head.removeChild(style);
//      };
//    }, []);



  return (
    <div className="retro-container">
      <div className="retro-bg">
        {stars}
        <img src={cloud} alt="cloud" className="cloud" style={{ top: '-2%', animationDelay: '-13s' }} />
        <img src={cloud} alt="cloud" className="cloud" style={{ top: '10%', animationDelay: '-20s' }} />
        <img src={cloud} alt="cloud" className="cloud" style={{ top: '10%', animationDelay: '-5s'}} />
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
