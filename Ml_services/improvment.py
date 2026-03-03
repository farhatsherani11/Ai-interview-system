import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_feedback(resume_text, jd_text):

    prompt = f"""
    Analyze this resume against the job description.

    Job Description:
    {jd_text}

    Resume:
    {resume_text}

    Provide:
    1. Section-wise feedback (Skills, Experience, Projects)
    2. Grammar corrections
    3. Missing skills
    4. Improved bullet rewrites
    5. Overall improvement report
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
    )

    return response.choices[0].message.content