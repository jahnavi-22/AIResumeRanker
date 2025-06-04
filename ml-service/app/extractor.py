import ast

from dotenv import load_dotenv
from openai import OpenAI
import os

from sentence_transformers import SentenceTransformer

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

model_name = 'all-MiniLM-L6-v2'
sentence_transformer_model = SentenceTransformer(model_name)


def extract_resume_details(text: str) -> dict:
    prompt = (
        "You are an expert HR analyst. Given the resume text below, extract the following fields.\n\n"
        "Return your answer as a Python dictionary literal containing the keys listed below.\n"
        "Use the exact key names and data types as specified.\n"
        "Do not add any explanations or extra text.\n\n"
        "Fields and expected formats:\n"
        "- contact: dict with keys 'email' (string or null), 'phone' (string or null), 'linkedin' (string or null)\n"
        "- summary: string (brief professional summary)\n"
        "- highlights: list of 3 strings (bullet points)\n"
        "- education: list of strings (each is a degree or qualification)\n"
        "- experiences: list of strings (job titles and durations)\n"
        "- skills: list of strings\n"
        "- certifications: list of strings\n"
        "- projects: list of strings\n"
        "- experienceRelevanceScore: float (scale 1.0 to 10.0)\n"
        "- seniorityLevel: string (e.g., 'Junior Developer', 'Senior Engineer')\n"
        "- careerTrajectory: string (summary of career progression)\n"
        "- experienceHighlights: list of strings\n"
        "- impactHighlights: list of strings\n"
        "- projectHighlights: list of strings\n"
        "- generatedSummary: string (concise resume overview)\n"
        "- atsScore: float (scale 1.0 to 10.0)\n"
        "- atsFeedback: list of strings\n\n"
        f"Resume Text:\n{text}\n\n"
        "Example output:\n"
        "{\n"
        "  'contact': {'email': 'john@example.com', 'phone': '+123456789', 'linkedin': 'linkedin.com/in/johndoe'},\n"
        "  'summary': 'Experienced backend developer...',\n"
        "  'highlights': ['Built scalable API', 'Reduced latency by 30%', 'Led team of 5 engineers'],\n"
        "  'education': ['B.Sc Computer Science, XYZ University, 2018'],\n"
        "  'experiences': ['Software Engineer at ABC Corp (2018-2021)', 'Intern at DEF Inc (2017-2018)'],\n"
        "  'skills': ['Python', 'FastAPI', 'Docker'],\n"
        "  'certifications': ['AWS Certified Developer'],\n"
        "  'projects': ['Real-time chat app', 'Inventory system'],\n"
        "  'experienceRelevanceScore': 8.5,\n"
        "  'seniorityLevel': 'Mid-level Developer',\n"
        "  'careerTrajectory': 'Intern → Junior Developer → Mid-level Developer',\n"
        "  'experienceHighlights': ['Led migration to microservices', 'Implemented CI/CD pipelines'],\n"
        "  'impactHighlights': ['Increased uptime by 20%', 'Cut API response time in half'],\n"
        "  'projectHighlights': ['Designed scalable chat service', 'Optimized database queries'],\n"
        "  'generatedSummary': 'A highly motivated developer with strong backend skills...',\n"
        "  'atsScore': 7.9,\n"
        "  'atsFeedback': ['Use standard section headers', 'Avoid images']\n"
        "}"
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_tokens=600,
    )

    result_str = response.choices[0].message.content.strip()
    try:
        result_dict = ast.literal_eval(result_str)
    except Exception:
        result_dict = {}
    return result_dict


def extract_keywords(text: str) -> list:
    prompt = (
        "Extract the key technical and professional keywords from this text.\n"
        "Return a Python list of keywords, no extra text.\n\n"
        f"Text:\n{text}"
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_tokens=150,
    )

    keywords_str = response.choices[0].message.content.strip()
    try:
        keywords = ast.literal_eval(keywords_str)
    except Exception as e:
        keywords = []
    return keywords
