import spacy
from rake_nltk import Rake
from keybert import KeyBERT
from sklearn.metrics.pairwise import cosine_similarity
import numpy
import re

nlp = spacy.load("en_core_web_sm")
rake = Rake()
kb = KeyBERT()


def clean_text(text: str) -> str:
    text: re.sub(r'[^a-z\s]', ' ', text)
    return text.lower()


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


def get_combined_words(text: str):
    text = clean_text(text)
    keywords = set()
    keywords.update(extract_keybert_words(text))
    keywords.update(extract_keybert_words(text))
    keywords.update(extract_spacy_noun_phrases(text))
    return list(keywords)


def embed_keywords(keywords: list):
    if not keywords:
        return numpy.array([])
    return kb.model.encode(keywords)


def semantic_match_score(jd_keywords, resume_keywords, threshold=0.75):
    jd_embeddings = embed_keywords(jd_keywords)
    resume_embeddings = embed_keywords(resume_keywords)

    if jd_embeddings.size == 0 or resume_embeddings.size == 0:
        return 0.0, [], jd_keywords

    similarity_matrix = cosine_similarity(jd_embeddings, resume_embeddings)
    matched_keywords = []
    missing_keywords = []

    for i, jd_keyword in enumerate(jd_keywords):
        if any(similarity_matrix[i] >= threshold):
            matched_keywords.append(jd_keyword)
        else:
            missing_keywords.append(jd_keyword)

    if jd_keywords:
        score = (len(matched_keywords) / len(jd_keywords)) * 100
    else:
        score = 0

    return score, matched_keywords, missing_keywords
