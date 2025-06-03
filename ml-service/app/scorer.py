from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import numpy

model_name = 'all-MiniLM-L6-v2'
sentence_transformer_model = SentenceTransformer(model_name)


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
def semantic_match_score(jd_keywords, resume_keywords, threshold=0.85):
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
