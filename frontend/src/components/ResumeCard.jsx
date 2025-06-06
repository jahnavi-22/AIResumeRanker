import React, { useState } from "react";
import "./ResumeCardStyle.css";

const ResumeCard = ({ result }) => {
  const [expanded, setExpanded] = useState(false);

  const renderSection = (title, content) => {
    if (!content) return null;

    if (typeof content === "object" && !Array.isArray(content)) {
      return (
        <div className="nested-expandable">
          <h4 className="section-title">{title}</h4>
          <div className="section-content">
            {Object.entries(content).map(([key, value]) => {
              const displayValue =
                value === null || value === undefined || value === ""
                  ? "Not provided"
                  : String(value);
              return (
                <div key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                  {displayValue}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const contentStr =
      content === null || content === undefined || content === ""
        ? "Not provided"
        : Array.isArray(content)
        ? content.join("\n")
        : String(content);

    return (
      <div className="nested-expandable">
        <h4 className="section-title">{title}</h4>
        <div className="section-content">
          {contentStr.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>
    );
  };




  const renderSkillSection = (title, skills, type) => {
    if (!skills || skills.length === 0) return null;
    return (
      <div className="nested-expandable">
        <h4 className="section-title">{title}</h4>
        <div className="skills-section">
          {skills.map((skill, idx) => (
            <span key={idx} className={`skill-tag ${type}`}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="resume-card">
      <div className="card-header">
        <div className="header-grid">
          <span className="rank">#{result.rank}</span>
          <span className="name">{result.name}</span>
          <span className="score">{result.score}</span>
          <button className="expand-button" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Know Less" : "Know More"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="expandable-section">
          {renderSection("Summary", result.summary)}
          {renderSkillSection("Matched Skills", result.matchedSkills, "matched")}
          {renderSkillSection("Missing Skills", result.missingSkills, "missing")}
          {renderSection("Contact", result.contact)}
          {renderSection("Education", result.education)}
          {renderSection("Experiences", result.experiences)}
          {renderSkillSection("Skills", result.skills)}
          {renderSection("Certifications", result.certifications)}
          {renderSection("Projects", result.projects)}
          {renderSection("Project Highlights", result.projectHighlights)}
          {renderSection("Seniority Level", result.seniorityLevel)}
          {renderSection("Career Trajectory", result.careerTrajectory)}
          {renderSection("Experience Relevance Score", result.experienceRelevanceScore)}
          {renderSection("Experience Highlights", result.experienceHighlights)}
          {renderSection("Impact Highlights", result.impactHighlights)}
          {renderSection("ATS Compatibility Score", result.atsCompatibilityScore)}
        </div>
      )}
    </div>
  );
};

export default ResumeCard;