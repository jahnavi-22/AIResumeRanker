import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeCard from "../components/ResumeCard";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import star from "../assets/star.png";
import cloud from "../assets/cloud.png";
import "./ResumeAnalyzer.css";


const ResumeAnalyzer = () => {
  const navigate = useNavigate();

  const [jobId, setJobId] = useState("");

  const [jdType, setJdType] = useState("file");
  const [jdText, setJdText] = useState("");
  const [jdFile, setJdFile] = useState(null);
  const [jdUrl, setJdUrl] = useState("");

  const [resumeType, setResumeType] = useState("file");
  const [resumeFiles, setResumeFiles] = useState([]);
  const [resumeUrls, setResumeUrls] = useState([""]);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

 const MAX_FILE_SIZE_MB = 1;
 const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

 const handleResumeTypeChange = (type) => {
   setResumeType(type);
   // Clear other input type when switching
   if (type === "file") {
     setResumeUrls([""]);
   } else if (type === "url") {
     setResumeFiles([]);
   }
 };

 const handleRemoveResumeFile = (index) => {
   setResumeFiles((prev) => prev.filter((_, i) => i !== index));
 };

 const handleResumeFileChange = (e) => {
   const newFiles = Array.from(e.target.files);
   const validFiles = [];
   newFiles.forEach((file) => {
     if (file.size > MAX_FILE_SIZE_BYTES) {
       toast.error(`${file.name} exceeds the 1MB limit and was not added.`);
     } else {
       validFiles.push(file);
     }
   });

   if (validFiles.length > 0) {
     setResumeFiles((prev) => [...prev, ...validFiles]);
   }

   e.target.value = "";
 };

const handleJdFileChange = (e) => {
  const file = e.target.files[0];
  if (file.size > MAX_FILE_SIZE_BYTES) {
    toast.error(`${file.name} exceeds the 1MB limit and was not added.`);
    e.target.value = "";
  } else {
    setJdFile(file);
  }
};

const handleJdTypeChange = (type) => {
  setJdType(type);
  // Clear other inputs when type changes
  if (type === "text") {
    setJdFile(null);
    setJdUrl("");
  } else if (type === "file") {
    setJdText("");
    setJdUrl("");
  } else if (type === "url") {
    setJdText("");
    setJdFile(null);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobId.trim()) {
      toast.error("Please enter a Job ID.");
      return;
    }


  const isJdProvided =
    (jdType === "text" && jdText.trim()) ||
    (jdType === "file" && jdFile) ||
    (jdType === "url" && jdUrl.trim());

  const isResumeProvided =
    (resumeType === "file" && resumeFiles.length > 0) ||
    (resumeType === "url" && resumeUrls.some((url) => url.trim() !== ""));

  if (!isJdProvided) {
    toast.error("Please provide a job description (text, file, or URL).");
    return;
  }

  if (jdType == "text" && jdText.length < 10) {
    toast.error("Job description must be at least 10 characters long.");
    return;
  }

  if (!isResumeProvided) {
    toast.error("Please provide at least one resume (file or URL).");
    return;
  }

    const formData = new FormData();
    formData.append("jobId", jobId);
    if (jdType === "text") formData.append("jdText", jdText);
    else if (jdType === "file" && jdFile) formData.append("jdFile", jdFile);
    else if (jdType === "url") formData.append("jdUrl", jdUrl);

    if (resumeType === "file") {
        resumeFiles.forEach((file) => formData.append("resumeFiles", file));
    } else {
        resumeUrls.forEach((url) => {
            if (url.trim()) formData.append("resumeUrls", url);
          });
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      const resultsWithNames = data.map((result) => ({
        ...result
      }));

      navigate("/leaderboard", {
          state: { jobId, results: resultsWithNames },
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/resume/download?jobId=${jobId}`, {
        method: "GET",
      });

      if (!res.ok) throw new Error("Failed to download file");

      const blob = await res.blob();
      saveAs(blob, `Results-ID-${jobId}.pdf`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
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
        <h1>SKILL QUEST</h1><br/>
        <p className="subtitle"> Helping recruiters find top talent quickly</p>
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
              <div>
               <label><input type="radio" value="text" checked={jdType === "text"} onChange={() => handleJdTypeChange("text")} /> Text</label>
               <label><input type="radio" value="file" checked={jdType === "file"} onChange={() => handleJdTypeChange("file")} /> File</label>
               <label><input type="radio" value="url" checked={jdType === "url"} onChange={() => handleJdTypeChange("url")} /> URL</label>
              </div><br/>
              {jdType === "text" && <textarea value={jdText} onChange={(e) => setJdText(e.target.value)} className="form-input" />}
              {jdType === "file" && <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleJdFileChange} className="form-input pixel-btn"
              title="Max size: 1 MB" />}
              {jdType === "url" && <input type="text" value={jdUrl} onChange={(e) => setJdUrl(e.target.value)} className="form-input retro-file" />}
          </div>

          <div className="form-group">
           <label className="form-label">Resumes</label>
           <div>
            <label><input type="radio" value="file" checked={resumeType === "file"} onChange={() => handleResumeTypeChange("file")} /> Files</label>
            <label><input type="radio" value="url" checked={resumeType === "url"} onChange={() => handleResumeTypeChange("url")} /> URLs</label>
           </div><br/>
            {resumeType === "file" && (
             <>
             <input type="file" multiple accept=".pdf,.doc,.docx,.txt" onChange={handleResumeFileChange} className="form-input pixel-btn"
               title="Max size: 1 MB per file"/>

             <div className="file-list-scrollable">
               <ul className="file-list">
                 {resumeFiles.map((file, i) => (
                   <li key={i} className="file-item">
                     {file.name}
                     <button type="button" className="remove-btn" onClick={() => handleRemoveResumeFile(i)}>×</button>
                   </li>
                 ))}
               </ul>
               </div>
             </>
            )}

            {resumeType === "url" && (
             <>
              {resumeUrls.map((url, idx) => (
                <div key={idx} className="resume-url-container">
                  <input type="text" value={url} onChange={(e) => { const updated = [...resumeUrls]; updated[idx] = e.target.value; setResumeUrls(updated); }}
                    className="form-input" placeholder={`Resume URL ${idx + 1}`} />
                  <button type="button" className="remove-btn" onClick={() => {
                     setResumeUrls(resumeUrls.filter((_, i) => i !== idx)); }}  aria-label="Remove URL" > × </button>
                 </div>
                  ))}
                   <button type="button" className="add-url-btn" onClick={() => setResumeUrls([...resumeUrls, ""])}>
                              + Add URL </button>
               </>
              )}
             </div>

          <button type="submit" className={`submit-button ${loading ? "loading" : ""}`} disabled={loading} >
            {loading ? ( <span className="loading-spinner"></span> ) : ( "Analyze Resumes" )}
          </button>
        </form>

      </main>
    </div>
  );
};

export default ResumeAnalyzer;
