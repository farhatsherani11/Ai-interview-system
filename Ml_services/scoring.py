def ats_score(similarity):
    return round(similarity * 100, 2)

def missing_skills(jd_text, resume_text):
    jd_words = set(jd_text.lower().split())
    resume_words = set(resume_text.lower().split())
    missing = jd_words - resume_words
    return list(missing)[:20]