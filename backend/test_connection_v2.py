
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

candidates = [
    "gemini-2.0-flash-exp",   # Control: Should work (or 429)
    "models/gemini-1.5-flash", # Explicit prefix
    "gemini-flash-latest",    # Different alias
    "gemini-1.5-flash-001"    # Specific version
]

print("Testing V2...")

for name in candidates:
    print(f"\n--- Testing {name} ---")
    try:
        model = genai.GenerativeModel(name)
        response = model.generate_content("Hi")
        print("SUCCESS")
        print(response.text[:50])
    except Exception as e:
        print("FAILED")
        print(e)
