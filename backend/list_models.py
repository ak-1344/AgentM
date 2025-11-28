import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    # Try to find any google key
    for key, val in os.environ.items():
        if "GOOGLE_API_KEY" in key and val:
            api_key = val
            break

print(f"Using API Key: {api_key[:5]}..." if api_key else "No API Key found")

try:
    client = genai.Client(api_key=api_key)
    print("Listing models...")
    for model in client.models.list():
        print(f"- {model.name} (Display: {model.display_name})")
except Exception as e:
    print(f"Error: {e}")
