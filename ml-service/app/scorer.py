import spacy
from rake_nltk import Rake
from keybert import KeyBERT
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import numpy
import re
import os
from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=openai_api_key)


model_name = 'all-MiniLM-L6-v2'
sentence_transformer_model = SentenceTransformer(model_name)
nlp = spacy.load("en_core_web_sm")
rake = Rake()
kb = KeyBERT(sentence_transformer_model)


def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z\s]', ' ', text)
    text = text.strip()
    return text


def extract_rake_keywords(text: str, max_keywords=15):
    rake.extract_keywords_from_text(text)
    return rake.get_ranked_phrases()[:max_keywords]


def extract_keybert_words(text: str, max_keywords=15):
    keywords = kb.extract_keywords(text, top_n=max_keywords, stop_words='english')
    keyword_list = [keyword for keyword, score in keywords]
    return keyword_list


def extract_spacy_noun_phrases(text: str, max_phrases=15):
    doc = nlp(text)
    noun_phrases = []
    for chunk in doc.noun_chunks:
        if len(chunk.text.split()) > 1:
            noun_phrases.append(chunk.text)
    return noun_phrases[:max_phrases]


def extract_keywords_with_gpt(text: str, max_keywords: int = 15):
    prompt = (
        "Extract the most relevant professional and technical skills or keywords from the following text. "
        f"Return a comma-separated list of up to {max_keywords} keywords. Avoid duplicates.\n\n"
        f"Text:\n{text}\n\nKeywords:"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4",  # Fixed model name
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=150
        )

        print("OpenAI API response:", response)
        keywords_text = response.choices[0].message.content
        keywords = [kw.strip().lower() for kw in keywords_text.split(",") if kw.strip()]
        return normalize_keywords(keywords)

    except Exception as e:
        print(f"[OpenAI Error] {e}")
        return []


def normalize_keywords(keywords):
    normalized = set()
    for kw in keywords:
        doc = nlp(kw.lower())
        # Lemmatize and remove stopwords and non-alpha tokens
        lemma = " ".join([token.lemma_ for token in doc if not token.is_stop and token.is_alpha])
        if len(lemma) > 2:
            normalized.add(lemma)
    return list(normalized)


#Combine keywords from KeyBERT and RAKE and noun phrases from SpaCy into a unique set
def get_combined_words(text: str):
    text = clean_text(text)
    keywords = set()
    
    # Try GPT first
    gpt_keywords = extract_keywords_with_gpt(text)
    if gpt_keywords:
        keywords.update(gpt_keywords)
    else:
        # Fallback to other methods if GPT fails
        keywords.update(extract_keybert_words(text))
        keywords.update(extract_rake_keywords(text))
        keywords.update(extract_spacy_noun_phrases(text))
    
    normalized_keywords = normalize_keywords(list(keywords))
    return normalized_keywords


#Convert list of keywords into vector embeddings using KeyBERT's model
def embed_keywords(keywords: list):
    if not keywords:
        return numpy.array([])
    return sentence_transformer_model.encode(keywords)


# Calculate semantic similarity score between job description keywords and resume keywords
# Returns:
#   - score as percentage of matched keywords
#   - list of matched keywords
#   - list of missing keywords
def semantic_match_score(jd_keywords, resume_keywords, threshold=0.75):
    jd_embeddings = embed_keywords(jd_keywords)
    resume_embeddings = embed_keywords(resume_keywords)

    if jd_embeddings.size == 0 or resume_embeddings.size == 0:
        return 0.0, [], jd_keywords

    similarity_matrix = cosine_similarity(jd_embeddings, resume_embeddings)
    matched_keywords = []
    missing_keywords = []
    total_score = 0

    for i, jd_keyword in enumerate(jd_keywords):
        max_sim = max(similarity_matrix[i])
        if max_sim >= threshold:
            matched_keywords.append(jd_keyword)
            total_score += max_sim
        else:
            missing_keywords.append(jd_keyword)

    if jd_keywords:
        score = (total_score / len(jd_keywords)) * 100
    else:
        score = 0

    return score, matched_keywords, missing_keywords
