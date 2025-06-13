import os
import hashlib
import json
from cachetools import LRUCache
from dotenv import load_dotenv
from openai import AsyncOpenAI
from typing import Dict, Any

load_dotenv()
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# In-memory cache
response_cache = LRUCache(maxsize=500)


def clean_gpt_output(text: str) -> str:
    # Remove markdown/code block formatting
    if text.startswith("```") and text.endswith("```"):
        lines = text.splitlines()
        lines = lines[1:] if lines[0].startswith("```") else lines
        lines = lines[:-1] if lines[-1].strip() == "```" else lines
        text = "\n".join(lines)
    return text.strip()


async def extract_resume_details(text: str, jd_text: str) -> dict:
    cache_key = hashlib.sha256((jd_text.strip() + "::" + text.strip()).encode("utf-8")).hexdigest()
    
    if cache_key in response_cache:
        print("Cache hit.")
        return response_cache[cache_key]
    
    prompt = (
        "You are an expert HR analyst and ATS system.\n"
        "Given the resume text and the job description below, do the following:\n\n"
        "1. Extract the candidate details with these exact keys and types:\n"
        "- name: string\n"
        "- contact: dict with keys 'email' (string or null), 'phone' (string or null), 'linkedin' (string or null)\n"
        "- summary: string(final assessment of the candidate)\n"
        "- education: list of strings\n"
        "- experiences: list of strings\n"
        "- skills: list of strings (include all explicit and strongly inferred skills, both hard and soft skills)\n"
        "- certifications: list of strings\n"
        "- projects: list of strings\n"
        "- experienceRelevanceScore: float (1.0 to 10.0)\n"
        "- seniorityLevel: string\n"
        "- careerTrajectory: string\n"
        "- experienceHighlights: list of strings\n"
        "- impactHighlights: list of strings\n"
        "- projectHighlights: list of strings\n"
        "- atsCompatibilityScore: float (1.0 to 10.0)\n\n"
        "2. Extract the top 15 most relevant skills from the job description (explicit and inferred).\n"
        "3. Calculate which skills from the job description are matched by the candidate's skills.\n"
        "4. Calculate which skills from the job description are missing.\n"
        "5. Provide a semantic match score (0-100) reflecting how well the candidate skills match the job description skills.\n\n"
        "Return a Python dictionary literal with these keys:\n"
        "- All keys from candidate details above\n"
        "- jdSkills: list of strings (top 15 job description skills)\n"
        "- matchedSkills: list of strings\n"
        "- missingSkills: list of strings\n"
        "- skillMatchScore: float (0-100)\n\n"
        "Return the entire response as a valid JSON object with double quotes only.\n"
        "Do NOT include single quotes, Python dict syntax, markdown, or code fences.\n"
        "Do NOT add any explanations or extra text.\n"
        f"Job Description Text:\n{jd_text}\n\n"
        f"Resume Text:\n{text}\n\n"
        
    )
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,
            max_tokens=850
        )

        content = response.choices[0].message.content
        result_str = clean_gpt_output(content)
        print("cleaned gpt output: ", result_str)
        result_dict = json.loads(result_str)
        response_cache[cache_key] = result_dict
        return result_dict

    except json.JSONDecodeError as e:
        print("JSON parsing error:", e)
        print("Raw GPT content (truncated):", content[:500])
        return {}
    except Exception as e:
        print("OpenAI error:", e)
        return {}
