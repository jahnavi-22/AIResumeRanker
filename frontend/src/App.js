import React, { useState } from "react";
import "./App.css";

function App() {
  const [jobId, setJobId] = useState("");
  const [jdFile, setJdFile] = useState(null);
  const [resumeFiles, setResumeFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobId.trim()) {
      alert("Please enter a Job ID.");
      return;
    }

    if (!jdFile || resumeFiles.length === 0) {
      alert("Upload JD and at least one resume file.");
      return;
    }

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("jdFile", jdFile);
    resumeFiles.forEach((file) => formData.append("resumeFiles", file));

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      // Map the results to include the original file names
      const resultsWithNames = data.map((result, index) => ({
        ...result,
        name: resumeFiles[index]?.name || `Resume ${index + 1}`
      }));
      
      setResults(resultsWithNames);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Resume Ranker</h1>
        <p className="subtitle">Intelligent Resume Analysis & Ranking</p>
      </header>

      <main className="main-content">
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="jobId" className="form-label">
              Job ID
            </label>
            <input
              id="jobId"
              type="text"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="form-input"
              placeholder="Enter Job ID"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Job Description</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="jdFile"
                onChange={(e) => setJdFile(e.target.files[0])}
                className="file-input"
                accept=".pdf,.doc,.docx,.txt"
                required
              />
              <label htmlFor="jdFile" className="file-upload-label">
                {jdFile ? (
                  <span className="file-name">{jdFile.name}</span>
                ) : (
                  <span className="upload-placeholder">
                    <i className="upload-icon">📄</i>
                    Choose Job Description File
                  </span>
                )}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Resumes</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="resumeFiles"
                onChange={(e) => setResumeFiles(Array.from(e.target.files))}
                className="file-input"
                accept=".pdf,.doc,.docx,.txt"
                multiple
                required
              />
              <label htmlFor="resumeFiles" className="file-upload-label">
                {resumeFiles.length > 0 ? (
                  <span className="file-name">
                    {resumeFiles.length} file(s) selected
                  </span>
                ) : (
                  <span className="upload-placeholder">
                    <i className="upload-icon">📄</i>
                    Choose Resume Files
                  </span>
                )}
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={`submit-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              "Analyze Resumes"
            )}
          </button>
        </form>

        {results.length > 0 && (
          <section className="results-section">
            <h2>Analysis Results</h2>
            <div className="results-grid">
              {results.map((result, index) => (
                <div key={index} className="result-card">
                  <div className="result-header">
                    <h3>{result.name}</h3>
                    <div className="score-badge">
                      Score: {result.score}%
                    </div>
                  </div>
                  <div className="result-details">
                    <div className="detail-item">
                      <span className="detail-label">Rank:</span>
                      <span className="detail-value">
                        {result.rank}/{result.total}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Matched Skills:</span>
                      <div className="skills-list">
                        {result.matchedSkills.map((skill, i) => (
                          <span key={i} className="skill-tag matched">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Missing Skills:</span>
                      <div className="skills-list">
                        {result.missingSkills.map((skill, i) => (
                          <span key={i} className="skill-tag missing">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
