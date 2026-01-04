
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found in .env")
    exit(1)

genai.configure(api_key=api_key)

candidates = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-8b",
    "gemini-pro" 
]

print(f"Testing models with API Key: {api_key[:5]}...")

for model_name in candidates:
    print(f"\nTesting {model_name}...")
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Hello")
        print(f"SUCCESS: {model_name}")
        print(f"Response: {response.text}")
        break  # Found a working one
    except Exception as e:
        print(f"FAILED: {model_name}")
        print(f"Error: {e}")
