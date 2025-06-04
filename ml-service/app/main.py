from fastapi import FastAPI, HTTPException
from typing import List
from app.model import ResumeRequest, ResumeResponse
import app.scorer as scorer
import app.extractor as extractor

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Resume Ranker ML service is running"}


# # Rank resumes based on semantic similarity with the job description
# @app.post("/rank", response_model=List[ResumeResponse])
# def rank_resumes(request: ResumeRequest):
#     jd = request.jobDescription
#     resumes = request.resumeTexts
#
#     if not jd or not jd.strip():
#         raise HTTPException(status_code=400, detail="Job description is empty or invalid.")
#
#     if not resumes:
#         raise HTTPException(status_code=400, detail="All resumes are empty or invalid.")
#
#     total = len(resumes)
#
#     jd_keywords = extractor.extract_keywords(jd)
#     scored_resumes = []
#
#     # Score each resume against JD
#     for i, resume_text in enumerate(resumes):
#         resume_keywords = extractor.extract_keywords(resume_text)
#         resume_details = extractor.extract_resume_details(resume_text)
#         print(f"Resume {i} keywords:", resume_keywords)
#         score, matched_keywords, missing_keywords = scorer.semantic_match_score(jd_keywords, resume_keywords)
#
#         scored_resumes.append({
#             "index": i,
#             "score": round(score, 2),
#             "matched": matched_keywords,
#             "missing": missing_keywords,
#             "details": resume_details
#         })
#
#     # Sort resumes by score (highest first)
#     sorted_resumes = sorted(scored_resumes, key=lambda x: x["score"], reverse=True)
#
#     top_scores = [r["score"] for r in sorted_resumes[:min(5, total)]]
#     index_to_rank = {r["index"]: rank + 1 for rank, r in enumerate(sorted_resumes)}
#
#     # Build final response list
#     responses = []
#     for r in scored_resumes:
#         d = r["details"]
#         responses.append(ResumeResponse(
#             name=d.get("name", f"Resume {r['index'] + 1}"),
#             score=r["score"],
#             rank=index_to_rank[r["index"]],
#             total=total,
#             topScores=top_scores,
#             matchedSkills=r["matched"],
#             missingSkills=r["missing"],
#             summary=d.get("summary", ""),
#             education=d.get("education", []),
#             experiences=d.get("experiences", []),
#             skills=d.get("skills", []),
#             certifications=d.get("certifications", []),
#             projects=d.get("projects", []),
#             experienceRelevanceScore=d.get("experienceRelevanceScore", 0.0),
#             seniorityLevel=d.get("seniorityLevel", ""),
#             careerTrajectory=d.get("careerTrajectory", ""),
#             experienceHighlights=d.get("experienceHighlights", []),
#             impactHighlights=d.get("impactHighlights", []),
#             projectHighlights=d.get("projectHighlights", []),
#             atsScore=d.get("atsScore", 0.0),
#             atsFeedback=d.get("atsFeedback", []),
#             contact=d.get("contact", {}),
#         ))
#
#     return responses


@app.post("/rank", response_model=List[ResumeResponse])
def rank_resumes(request: ResumeRequest):
    # Hardcoded mock response
    return [
        ResumeResponse(
            name="Alice Johnson",
            score=8.9,
            rank=1,
            total=2,
            topScores=[8.9, 7.5],
            matchedSkills=["Python", "Spring Boot", "Docker"],
            missingSkills=["Kubernetes", "CI/CD"],
            summary="Experienced Java backend developer with cloud deployment experiences.",
            education=["B.Tech in Computer Science, ABC University"],
            experiences=["Backend Engineer at X Corp (2021–Present)", "Intern at Y Corp (2020–2021)"],
            skills=["Java", "Spring Boot", "MySQL", "Docker"],
            certifications=["Oracle Certified Java Programmer"],
            projects=["Billing System", "Customer Management Portal"],
            experienceRelevanceScore=9.2,
            seniorityLevel="Mid-level Developer",
            careerTrajectory="Intern → Junior Dev → Backend Engineer",
            experienceHighlights=["Deployed services to AWS", "Reduced DB latency by 40%"],
            impactHighlights=["Cut costs by 30%", "Improved uptime by 15%"],
            projectHighlights=["Optimized report generation", "Migrated legacy app"],
            atsScore=8.4,
            atsFeedback=["Use standard formatting", "Avoid graphics"],
            contact={
                "email": "alice@example.com",
                "phone": "+1234567890",
                "linkedin": "linkedin.com/in/alicejohnson"
            }
        ),
        ResumeResponse(
            name="Bob Kumar",
            score=7.5,
            rank=2,
            total=2,
            topScores=[8.9, 7.5],
            matchedSkills=["Java", "Hibernate"],
            missingSkills=["Spring Boot", "Docker"],
            summary="Java developer with experiences in ORM and backend systems.",
            education=["B.E in Information Technology, XYZ Institute"],
            experiences=["Java Developer at Z Corp (2019–Present)"],
            skills=["Java", "Hibernate", "SQL"],
            certifications=[],
            projects=["Leave Management System"],
            experienceRelevanceScore=7.0,
            seniorityLevel="Junior Developer",
            careerTrajectory="Graduate → Junior Dev",
            experienceHighlights=["Built automation scripts"],
            impactHighlights=["Reduced manual work by 50%"],
            projectHighlights=["Integrated third-party API"],
            atsScore=7.1,
            atsFeedback=["Improve keyword density", "Add summary section"],
            contact={
                "email": "bob@example.com",
                "phone": "+1987654321",
                "linkedin": None
            }
        )
    ]