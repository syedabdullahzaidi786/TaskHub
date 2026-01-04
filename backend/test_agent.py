
import asyncio
import os
import sys
from sqlmodel import Session

# Add parent directory to path so we can import src
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.services.agent import run_agent
from src.database import get_session
from src.models.chat import Message

async def test_agent():
    print("Testing run_agent...")
    
    # Check Env
    key = os.getenv("GEMINI_API_KEY")
    print(f"GEMINI_API_KEY present: {bool(key)}")
    if key:
        print(f"Key length: {len(key)}")
        print(f"Key start: {key[:5]}...")

    # Mock Session
    session_gen = get_session()
    session = next(session_gen)
    
    try:
        user_id = "test-user-id"
        message = "Hello, testing locally."
        history = []
        
        print("Calling run_agent...")
        result = await run_agent(session, user_id, message, history)
        print("Result:", result)
        
    except Exception as e:
        print(f"Error calling run_agent: {e}")
        import traceback
        traceback.print_exc()
    finally:
        session.close()

if __name__ == "__main__":
    asyncio.run(test_agent())
