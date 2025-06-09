import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Leaderboard from "./pages/Leaderboard";
import "./App.css";
import { Toaster } from 'react-hot-toast';
import clickSoundSrc from "./assets/mouse-click.mp3";

function App() {
  useEffect(() => {
    const clickSound = new Audio(clickSoundSrc);

    const style = document.createElement('style');
    style.textContent = `
      html, body, * {
        cursor: url('/cursor-normal-32.png'), auto !important;
      }
      button, button:hover, button:focus,
      .upload-btn, .upload-btn:hover, .upload-btn:focus,
      [role="button"], [role="button"]:hover, [role="button"]:focus {
        cursor: url('/cursor-click-32.png'), auto !important;
      }
      button:active, .upload-btn:active, [role="button"]:active {
        cursor: url('/cursor-click-32.png'), auto !important;
      }
    `;
    document.head.appendChild(style);

    const handleClick = (e) => {
      if (e.target.closest('button') || e.target.closest('[role="button"]')) {
        clickSound.currentTime = 0;
        clickSound.play();
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'Press Start 2P', monospace",
            background: "#fff",
            color: "#333",
            border: "2px solid #f24e1e",
            boxShadow: "4px 4px 0 #f24e1e",
            fontSize: "11px",
            padding: "12px 16px",
            borderRadius: "8px",
          },
          error: {
            iconTheme: {
              primary: "#f24e1e",
              secondary: "#fff",
            },
          },
        }}
      />

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<ResumeAnalyzer />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
