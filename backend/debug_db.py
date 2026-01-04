
import sys
import os
from sqlmodel import select

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from src.database import get_session
from src.models.todo import Todo

def test_fetch_todos():
    print("Connecting to DB...")
    # Manually get session generator
    session_gen = get_session()
    session = next(session_gen)
    
    try:
        print("Fetching todos...")
        statement = select(Todo).limit(5)
        results = session.exec(statement).all()
        print(f"Successfully fetched {len(results)} todos.")
        for t in results:
            print(f"Todo: {t.title}, Priority: {t.priority} ({type(t.priority)})")
            
    except Exception as e:
        print(f"Error fetching todos: {e}")
        import traceback
        traceback.print_exc()
    finally:
        session.close()

if __name__ == "__main__":
    test_fetch_todos()
