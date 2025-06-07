import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomePage';
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Leaderboard from "./pages/Leaderboard";
import './App.css';
import { Toaster } from 'react-hot-toast';
import clickSoundSrc from "./assets/mouse-click.mp3";

function App() {
  useEffect(() => {
    const clickSound = new Audio(clickSoundSrc);
    const handleClick = (e) => {
      if (e.target.closest("button")) {
        clickSound.currentTime = 0;
        clickSound.play();
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
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
