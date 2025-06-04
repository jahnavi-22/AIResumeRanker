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
            {Object.entries(content).map(([key, value]) => (
              <div key={key}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                {String(value)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    const contentStr = Array.isArray(content) ? content.join("\n") : String(content);

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
        <span className="rank">#{result.rank}</span>
        <span className="name">{result.name}</span>
        <span className="score">Score: {result.score}</span>
        <button className="expand-button" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Hide Details" : "View Details"}
        </button>
      </div>

      {expanded && (
        <div className="expandable-section">
          {renderSection("Summary", result.summary)}
          {renderSkillSection("Matched Skills", result.matchedSkills, "matched")}
          {renderSkillSection("Missing Skills", result.missingSkills, "missing")}
          {renderSection("Contact", result.contact)}
          {renderSection("Education", result.education)}
          {renderSection("Experiences", result.experiences)}
          {renderSection("Skills", result.skills)}
          {renderSection("Certifications", result.certifications)}
          {renderSection("Projects", result.projects)}
          {renderSection("Relevance", result.relevance)}
          {renderSection("Experience Highlights", result.experienceHighlights)}
          {renderSection("Impact Highlights", result.impactHighlights)}
          {renderSection("Project Highlights", result.projectHighlights)}
          {renderSection("ATS Feedback", result.atsFeedback)}
        </div>
      )}
    </div>
  );
};

export default ResumeCard;