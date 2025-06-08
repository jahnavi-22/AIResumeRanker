import React from "react";
import { useLocation } from "react-router-dom";
import ResumeCard from "../components/ResumeCard";
import cloud from "../assets/cloud.png";
import star from "../assets/star.png";
import { saveAs } from "file-saver";
import "./Leaderboard.css";

const Leaderboard = () => {
  const { state } = useLocation();
  const { jobId, results } = state || {};


//download results
  const handleDownload = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/resume/download?jobId=${jobId}`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      saveAs(blob, `Results-ID-${jobId}.pdf`);
    } catch (err) {
      alert(err.message);
    }
  };

  const stars = Array.from({ length: 30 }).map((_, i) => {
    const left = `${Math.random() * 100}%`;
    const top = `${Math.random() * 100}%`;
    const size = Math.random() > 0.5 ? 16 : 8;
    const delay = `${Math.random() * 2}s`;
    return (
      <img
        key={i}
        src={star}
        alt="star"
        className="star"
        style={{ left, top, width: `${size}px`, height: `${size}px`, animationDelay: delay }}
      />
    );
  });

  return (
    <div className="app-container">
      {stars}
       <img src={cloud} alt="cloud" className="cloud" style={{ top: '5%', animationDelay: '-10s' }} />
       <img src={cloud} alt="cloud" className="cloud" style={{ top: '15%', animationDelay: '-22s' }} />
       <img src={cloud} alt="cloud" className="cloud" style={{ top: '30%', animationDelay: '-5s' }} />
      <div className="grass"></div>

      <header className="app-header">
        <h1>Leaderboard</h1><br/><br/>
        <p className="subtitle">Quest #{jobId}: The arena’s verdict. Full ranking below.</p><br/>
      </header>

      <main className="main-content">
          <div className="blue-table">
            <div className="results-grid">
              <div className="results-header">
                <span className="header-details">Rank</span>
                <span className="header-details">Name</span>
                <span className="header-details">Hits</span>
                <span className="header-details">Misses</span>
                <span className="header-details">Score</span>
                <span className="header-details">Details</span>
              </div>
              <div className="results-scroll-container">
                {results?.map((result, index) => (
                  <ResumeCard key={index} result={result} />
                ))}
              </div>
            </div>
          </div>
          <div className="download-button-container">
              <button className="download-button" onClick={handleDownload}>
                Download Results PDF
              </button>
          </div>
      </main>
    </div>
  );
};

export default Leaderboard;
