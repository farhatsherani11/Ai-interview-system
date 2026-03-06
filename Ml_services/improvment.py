import os
import json
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
    model = genai.GenerativeModel('models/gemini-2.5-flash')
else:
    print("⚠️ API Key is still MISSING!")
    model = None


def generate_feedback(resume_text, jd_text):
    if not model:
        return {"error": "Gemini API key is missing or model failed to load."}

    prompt = f"""
You are an expert ATS evaluator. Analyze the resume against the job description.
Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{{
  "overall_match": "High/Medium/Low",
  "strengths": ["strength1", "strength2"],
  "grammar_fixes": ["fix1", "fix2"],
  "bullet_rewrites": [
    {{"original": "original bullet text", "improved": "improved bullet text"}}
  ],
  "strategic_advice": "Overall advice as a single paragraph"
}}

Job Description:
{jd_text}

Resume:
{resume_text}
"""

    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)

    except json.JSONDecodeError:
        return {"error": "Gemini returned invalid JSON.", "raw": response.text}
    except Exception as e:
        return {"error": f"Generation failed: {str(e)}"}