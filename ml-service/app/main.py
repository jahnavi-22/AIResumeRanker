from fastapi import FastAPI
from typing import List
from app.model import ResumeRequest, ResumeResponse
import app.scorer as scorer

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Resume Ranker ML service is running"}


@app.post("/rank", response_model=List[ResumeResponse])
def rank_resumes(request: ResumeRequest):
    jd = request.jobDescription
    resumes = request.resumeTexts

    jd_keywords = scorer.get_combined_words(jd)
    scored = []

    for i, resume_text in enumerate(resumes):
        resume_keywords = scorer.get_combined_words(resume_text)
        score, matched_keywords, missing_keywords = scorer.semantic_match_score(jd_keywords, resume_keywords)

        scored.append({
            "index": i,
            "score": round(score, 2),
            "matched": matched_keywords,
            "missing": missing_keywords
        })

    sorted_resumes = sorted(scored, key=lambda x: x["score"], reverse=True)

    total = len(resumes)
    top_scores = [r["score"] for r in sorted_resumes[:5]]
    index_to_rank = {r["index"]: rank + 1 for rank, r in enumerate(sorted_resumes)}

    responses = []
    for r in scored:
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
