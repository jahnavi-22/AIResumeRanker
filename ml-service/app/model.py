from pydantic import BaseModel, Field
from typing import List


class ResumeRequest(BaseModel):
    jobId: str
    jobDescription: str = Field(..., min_length=10, description="Job description cannot be empty.")
    resumeTexts: List[str] = Field(..., description="Must provide at least one resume.")


class ResumeResponse(BaseModel):
    name: str
    score: float
    matchedSkills: List[str]
    missingSkills: List[str]
    rank: int
    total: int
    topScores: List[float]
