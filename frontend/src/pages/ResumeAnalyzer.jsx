import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Stars from "../components/Stars";
import Clouds from "../components/Clouds";
import "./ResumeAnalyzer.css";


const ResumeAnalyzer = () => {
  const navigate = useNavigate();

  const [jobId, setJobId] = useState("");

  const [jdType, setJdType] = useState({type: "file", text: "", file: null, url: ""});
  const [resumeType, setResumeType] = useState({type: "file", files: [], urls: [""]});

//   const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

 const MAX_FILE_SIZE_MB = 1;
 const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;


const handleJdTypeChange = (type) => {
  setJdType({...jdType, type, text: "", file: null, url: ""});
};

const handleJdTextChange = (e) => {
    setJdType({...jdType, text: e.target.value});
};

const handleJdFileChange = (e) => {
  const file = e.target.files[0];
  if (file.size > MAX_FILE_SIZE_BYTES) {
    toast.error(`${file.name} exceeds the 1MB limit and was not added.`);
    e.target.value = "";
  } else {
    setJdType({...jdType, file});
  }
};

const handleJdUrlChange = (e) => {
    setJdType({...jdType, url: e.target.value});
};


const isValidUrl = (url) => {
  const regex = /^(https?:\/\/)[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
  return regex.test(url);
};


 const handleResumeTypeChange = (type) => {
   setResumeType({...resumeType,type, ...(type === "file" ? { files: [] } : { urls: [] })})
 };


 const handleRemoveResumeFile = (index) => {
   setResumeType((prev) => ({...prev, files: prev.files.filter((_, i) => i !== index),}));
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
     setResumeType((prev) => ({...prev, files: [...prev.files, ...validFiles],}));
   }
   e.target.value = "";
 };

 const handleResumeUrlChange = (e, idx) => {
   const updated = [...resumeType.urls];
   updated[idx] = e.target.value;
   setResumeType({ ...resumeType, urls: updated });
}

 const addResumeUrl = () => {
     setResumeType((prev) => ({ ...prev, urls: [...prev.urls, ""] }));
 };

 const removeResumeUrl = (idx) => {
     setResumeType((prev) => ({...prev,urls: prev.urls.filter((_, i) => i !== idx),}));
 };


// let user submit only if passes these checks
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobId.trim()) {
      toast.error("Please enter a Job ID.");
      return;
    }


//mandatory check for jd
  const isJdProvided =
    (jdType.type === "text" && jdType.text.trim()) ||
    (jdType.type === "file" && jdType.file) ||
    (jdType.type  === "url" && jdType.url.trim());

  if (!isJdProvided) {
    toast.error("Please provide a job description (text, file, or URL).");
    return;
  }

  if (jdType.type === "text" && jdType.text.length < 10) {
    toast.error("Job description must be at least 10 characters long.");
    return;
  }

  if (jdType.type === "url" && jdType.url.trim() && !isValidUrl(jdType.url)) {
      toast.error(`The job description URL is invalid.`);
      return;
    }


//mandatory check for resume
  const isResumeProvided =
    (resumeType.type === "file" && resumeType.files.length > 0) ||
    (resumeType.type === "url" && resumeType.urls.some((url) => url.trim() !== ""));

  if (!isResumeProvided) {
    toast.error("Please provide at least one resume (file or URL).");
    return;
  }

  if (resumeType.type === "url") {
      for (let i = 0; i < resumeType.urls.length; i++) {
        if (resumeType.urls[i].trim() && !isValidUrl(resumeType.urls[i])) {
          toast.error(`Resume URL ${i + 1} is invalid.`);
          return;
        }
      }
    }

//send uploaded data to backend, navigate to leaderboard if successful els throw err
    const formData = new FormData();
    formData.append("jobId", jobId);
    if (jdType.type === "text") formData.append("jdText", jdType.text);
    else if (jdType.type === "file" && jdType.file) formData.append("jdFile", jdType.file);
    else if (jdType.type === "url") formData.append("jdUrl", jdType.url);

    if (resumeType.type === "file") {
        resumeType.files.forEach((file) => formData.append("resumeFiles", file));
    } else {
        resumeType.urls.forEach((url) => {
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

      toast.success("Upload successful!");
      navigate("/leaderboard", {
          state: { jobId, results: resultsWithNames },
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="app-container">
        <Stars/>
        <Clouds />
        <div className="grass"></div>
      <header className="app-header">
        <h1>SKILL QUEST</h1><br/><br/>
        <p className="subtitle"> Enter the game plan. Upload the heroes. We’ll crown the champion.</p>
      </header><br/>

      <main className="blue-content">
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
            />
          </div>

          <div className="form-group">
              <label className="form-label">Job Description</label>
              <div>
               <label><input type="radio" value="text" checked={jdType.type === "text"} onChange={() => handleJdTypeChange("text")} /> Text</label>
               <label><input type="radio" value="file" checked={jdType.type === "file"} onChange={() => handleJdTypeChange("file")} /> File</label>
               <label><input type="radio" value="url" checked={jdType.type === "url"} onChange={() => handleJdTypeChange("url")} /> URL</label>
              </div><br/>

              {jdType.type === "text" && (<textarea value={jdType.text} onChange={handleJdTextChange} className="form-input" /> )}
              {jdType.type === "file" && (<input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleJdFileChange} className="form-input pixel-btn" title="Max size: 1 MB" /> )}
              {jdType.type === "url" && (<input type="text" value={jdType.url} onChange={handleJdUrlChange} className="form-input retro-file" /> )}
          </div>

          <div className="form-group">
           <label className="form-label">Resumes</label>
           <div>
            <label><input type="radio" value="file" checked={resumeType.type === "file"} onChange={() => handleResumeTypeChange("file")} /> Files</label>
            <label><input type="radio" value="url" checked={resumeType.type === "url"} onChange={() => handleResumeTypeChange("url")} /> URLs</label>
           </div><br/>
            {resumeType.type === "file" && (
             <>
             <input type="file" multiple accept=".pdf,.doc,.docx,.txt" onChange={handleResumeFileChange} className="form-input pixel-btn"
               title="Max size: 1 MB per file"/>

             <div className="file-list-scrollable">
               <ul className="file-list">
                 {resumeType.files.map((file, i) => (
                   <li key={i} className="file-item">
                     {file.name}
                     <button type="button" className="remove-btn"  onClick={() => handleRemoveResumeFile(i)}>×</button>
                   </li>
                  ))}
               </ul>
               </div>
             </>
            )}

            {resumeType.type === "url" && (
             <>
              {resumeType.urls.map((url, idx) => (
                <div key={idx} className="resume-url-container">
                  <input type="text" value={url} onChange={(e) => handleResumeUrlChange(e, idx)} className="form-input" placeholder={`Resume URL ${idx + 1}`} />
                  <button type="button" className="remove-btn" onClick={() => removeResumeUrl(idx)} aria-label="Remove URL" > × </button>
                 </div>
                  ))}
                   <button type="button" className="add-url-btn" onClick={addResumeUrl}>+ Add URL </button>
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