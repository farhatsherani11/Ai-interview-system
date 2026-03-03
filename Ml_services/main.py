from fastapi import FastAPI, UploadFile, File, Form
import shutil
import os

from resume_parser import extract_text
from similarity import compute_similarity
from scoring import ats_score, missing_skills
from improvment import generate_feedback

app = FastAPI()

@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):

    temp_path = f"temp_{file.filename}"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume_text = extract_text(temp_path)

    similarity = compute_similarity(resume_text, job_description)
    score = ats_score(similarity)
    missing = missing_skills(job_description, resume_text)
    feedback = generate_feedback(resume_text, job_description)

    os.remove(temp_path)

    return {
        "score": score,
        "similarity": similarity,
        "missing_skills": missing,
        "feedback": feedback
    }