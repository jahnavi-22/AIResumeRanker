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

    document.body.style.cursor = `url('/cursor-big.png'), auto`;

    const setClickCursors = () => {
      const elements = document.querySelectorAll(
        'button, [role="button"], .upload-btn, input[type="file"], input[type="radio"], label:has(input[type="radio"]), .pixel-btn'
      );
      elements.forEach(element => {
        element.style.cursor = `url('/cursor-clicks--final-1.png') 0 0, auto`;
      });

      const style = document.createElement('style');
      style.textContent = `
        .pixel-btn::file-selector-button {
          cursor: url('/cursor-clicks--final-1.png') 0 0, auto !important;
        }
      `;
      document.head.appendChild(style);
    };

    // Initial setup
    setClickCursors();

    // Handle clicks
    window.addEventListener("click", (e) => {
      if (e.target.closest('button') || e.target.closest('[role="button"]') ||
        e.target.closest('input[type="file"]') || e.target.closest('input[type="radio"]') ||
        e.target.closest('label:has(input[type="radio"])') || e.target.closest('.pixel-btn')) {
        clickSound.currentTime = 0;
        clickSound.play();
      }
    });

    // Watch for new elements
    const observer = new MutationObserver(setClickCursors);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
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
