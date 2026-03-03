from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

def compute_similarity(resume_text, jd_text):
    emb1 = model.encode([resume_text])
    emb2 = model.encode([jd_text])
    score = cosine_similarity(emb1, emb2)[0][0]
    return float(score)