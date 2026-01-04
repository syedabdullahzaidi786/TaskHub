
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Test 1: Lowercase (Expected Failure)
print("\n--- Testing Lowercase 'object' ---")
try:
    tools_lower = [{
        "name": "test_lower",
        "description": "test",
        "parameters": {
            "type": "object",
            "properties": {"foo": {"type": "string"}} 
        }
    }]
    model = genai.GenerativeModel('gemini-flash-latest', tools=tools_lower)
    print("Lowercase initialization SUCCESS")
except Exception as e:
    print(f"Lowercase initialization FAILED: {e}")

# Test 2: Uppercase (Expected Success)
print("\n--- Testing Uppercase 'OBJECT' ---")
try:
    tools_upper = [{
        "name": "test_upper",
        "description": "test",
        "parameters": {
            "type": "OBJECT",
            "properties": {"foo": {"type": "STRING"}}
        }
    }]
    model = genai.GenerativeModel('gemini-flash-latest', tools=tools_upper)
    print("Uppercase initialization SUCCESS")
except Exception as e:
    print(f"Uppercase initialization FAILED: {e}")
