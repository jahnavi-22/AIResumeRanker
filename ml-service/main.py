from fastapi import FastAPI, HTTPException
from typing import List
from model import ResumeRequest, ResumeResponse
import asyncio
import extractor as extractor
import time

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Resume Ranker ML service is running"}


@app.post("/rank", response_model=List[ResumeResponse])
async def rank_resumes(request: ResumeRequest):
    print(("Received request: %s", request))
    jd = request.jobDescription
    resumes = request.resumeTexts

    if not jd or not jd.strip():
        raise HTTPException(status_code=400, detail="Job description is empty or invalid.")

    if not resumes:
        raise HTTPException(status_code=400, detail="All resumes are empty or invalid.")

    total = len(resumes)

    scored_resumes = []
    start_time = time.time()

    # Score each resume against JD
    # Async parallel processing of resumes
    tasks = [extractor.extract_resume_details(resume, jd) for resume in resumes]
    results = await asyncio.gather(*tasks)

    scored_resumes = []
    for i, details in enumerate(results):
        score = details.get("skillMatchScore", 0.0)
        scored_resumes.append({
            "index": i,
            "score": round(score, 2),
            "matched": details.get("matchedSkills", []),
            "missing": details.get("missingSkills", []),
            "details": details
        })


    # Sort resumes by score (highest first)
    sorted_resumes = sorted(scored_resumes, key=lambda x: x["score"], reverse=True)
    top_scores = [r["score"] for r in sorted_resumes[:min(5, total)]]
    index_to_rank = {r["index"]: rank + 1 for rank, r in enumerate(sorted_resumes)}

    # Build final response list
    responses = []
    for r in sorted_resumes:
        d = r["details"]
        responses.append(ResumeResponse(
            name=d.get("name", f"Resume {r['index'] + 1}"),
            score=r["score"],
            rank=index_to_rank[r["index"]],
            total=total,
            topScores=top_scores,
            matchedSkills=r["matched"],
            missingSkills=r["missing"],
            summary=d.get("summary", ""),
            education=d.get("education", []),
            experiences=d.get("experiences", []),
            skills=d.get("skills", []),
            certifications=d.get("certifications", []),
            projects=d.get("projects", []),
            experienceRelevanceScore=d.get("experienceRelevanceScore", 0.0),
            seniorityLevel=d.get("seniorityLevel", ""),
            careerTrajectory=d.get("careerTrajectory", ""),
            experienceHighlights=d.get("experienceHighlights", []),
            impactHighlights=d.get("impactHighlights", []),
            projectHighlights=d.get("projectHighlights", []),
            atsCompatibilityScore=d.get("atsCompatibilityScore", 0.0),
            contact=d.get("contact", {}),
        ))
        
    print(f"Processed {total} resumes in {time.time() - start_time:.2f} seconds")
    return responses
    