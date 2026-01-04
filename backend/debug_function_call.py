
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Define a simple tool
tools_decl = {
    "name": "get_weather",
    "description": "Get weather",
    "parameters": {
        "type": "object",
        "properties": {
            "location": {"type": "string"}
        },
        "required": ["location"]
    }
}

model = genai.GenerativeModel(
    model_name='gemini-flash-latest',
    tools=[tools_decl]
)

print("Generating tool call...")
response = model.generate_content("What is the weather in London?")

print("\n--- Inspecting Parts ---")
for i, part in enumerate(response.parts):
    print(f"\nPart {i}:")
    print(f"Has function_call attribute: {hasattr(part, 'function_call')}")
    
    if hasattr(part, 'function_call'):
        print(f"part.function_call (raw): {part.function_call}")
        print(f"Bool check (if part.function_call): {bool(part.function_call)}")
    
    try:
        print(f"part.text: {part.text}")
    except Exception as e:
        print(f"part.text access failed: {e}")

print("\n--- End items ---")
