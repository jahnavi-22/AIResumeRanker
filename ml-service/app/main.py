from fastapi import FastAPI, HTTPException
from typing import List
from app.model import ResumeRequest, ResumeResponse
import app.scorer as scorer

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Resume Ranker ML service is running"}


# Rank resumes based on semantic similarity with the job description
@app.post("/rank", response_model=List[ResumeResponse])
def rank_resumes(request: ResumeRequest):
    jd = request.jobDescription
    resumes = request.resumeTexts

    if not jd or not jd.strip():
        raise HTTPException(status_code=400, detail="Job description is empty or invalid.")

    if not resumes:
        raise HTTPException(status_code=400, detail="All resumes are empty or invalid.")

    total = len(resumes)

    jd_keywords = scorer.get_combined_words(jd)
    scored_resumes = []

    # Score each resume against JD
    for i, resume_text in enumerate(resumes):
        resume_keywords = scorer.get_combined_words(resume_text)
        print(f"Resume {i} keywords:", resume_keywords)
        score, matched_keywords, missing_keywords = scorer.semantic_match_score(jd_keywords, resume_keywords)

        scored_resumes.append({
            "index": i,
            "score": round(score, 2),
            "matched": matched_keywords,
            "missing": missing_keywords
        })

    # Sort resumes by score (highest first)
    sorted_resumes = sorted(scored_resumes, key=lambda x: x["score"], reverse=True)

    top_scores = [r["score"] for r in sorted_resumes[:min(5, total)]]
    index_to_rank = {r["index"]: rank + 1 for rank, r in enumerate(sorted_resumes)}

    # Build final response list
    responses = []
    for r in scored_resumes:
        responses.append(ResumeResponse(
            name=f"Resume {r['index'] + 1}",
            score=r["score"],
            matchedSkills=r["matched"],
            missingSkills=r["missing"],
            rank=index_to_rank[r["index"]],
            total=total,
            topScores=top_scores
        ))

    return responses
