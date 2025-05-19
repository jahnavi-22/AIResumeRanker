from pydantic import BaseModel
from typing import List


class ResumeRequest(BaseModel):
    jobId: str
    jobDescription: str
    resumeTexts: List[str]


class ResumeResponse(BaseModel):
    name: str
    score: str
    matchedSkills: List[str]
    missingSkills: List[str]
    rank: int
    total: int
    topScores: List[float]
