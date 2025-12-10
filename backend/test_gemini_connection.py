
import os
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GOOGLE_API_KEY")
print(f"API Key Found: {'Yes' if api_key else 'No'}")

if api_key:
    # Partial hide
    print(f"API Key (first 5): {api_key[:5]}...")
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        print("Model configured. Sending request...")
        response = model.generate_content("Hello, this is a test.")
        print("Response received!")
        print(f"Response text: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("ERROR: GOOGLE_API_KEY not found in .env")
