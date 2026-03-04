import os
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

# 1. Setup Path to Root .env.local
base_dir = Path(__file__).resolve().parent.parent
env_file = base_dir / ".env.local"

# 2. Load the file
if env_file.exists():
    load_dotenv(dotenv_path=env_file)
    print(f"✅ Loaded .env.local from: {base_dir}")
else:
    print(f"❌ Could not find .env.local at: {env_file}")

# 3. Get the Key
api_key = os.getenv("GEMINI_API_KEY") 

if api_key:
    genai.configure(api_key=api_key)
    print(f"🔑 API Key found: {api_key[:5]}...{api_key[-4:]}")
    
    # --- FIX: INITIALIZE THE MODEL HERE ---
    model = genai.GenerativeModel('models/gemini-2.5-flash')
else:
    print("⚠️ API Key is still MISSING!")
    model = None



def generate_feedback(resume_text, jd_text):
    if not model:
        return "Error: AI Model not initialized. Check API Key."

    prompt = f"""
    You are an expert ATS and HR evaluator.
    Analyze the resume against the job description.

    Job Description:
    {jd_text}

    Resume:
    {resume_text}

    Provide:
    1. Section-wise feedback (Skills, Experience, Projects)
    2. Grammar corrections
    3. Missing skills
    4. Improved bullet rewrites
    5. Overall improvement report with actionable suggestions

    Be structured and professional.
    """

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error during generation: {str(e)}"
    
    