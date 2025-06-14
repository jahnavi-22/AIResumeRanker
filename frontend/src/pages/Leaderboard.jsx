import React from "react";
import { useLocation } from "react-router-dom";
import ResumeCard from "../components/ResumeCard";
import Stars from "../components/Stars";
import Clouds from "../components/Clouds";
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


  return (
    <div className="app-container">
      <Stars />
      <Clouds />
      <div className="grass"></div>

      <header className="app-header">
        <h1>Leaderboard</h1><br /><br />
        <p className="subtitle">Quest #{jobId}: The arena’s verdict. Full ranking below.</p><br />
      </header>

      <main className="main-content">
        <div className="blue-table">
          <div className="results-grid">
            <div className="results-scroll-wrapper">
              <div className="results-table">
                <div className="results-header">
                  <span className="header-details">Rank</span>
                  <span className="header-details">Name</span>
                  <span className="header-details">Hits</span>
                  <span className="header-details">Misses</span>
                  <span className="header-details">Score</span>
                  <span className="header-details">Details</span>
                </div>
                {results?.map((result, index) => (
                  <ResumeCard key={index} result={result} />
                ))}
              </div>
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
