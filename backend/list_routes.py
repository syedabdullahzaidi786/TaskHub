
import sys
import os
# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from src.main import app

print("Registered Routes:")
for route in app.routes:
    if hasattr(route, "methods"):
        print(f"{route.methods} {route.path}")
    else:
        print(f"Mount {route.path}")
