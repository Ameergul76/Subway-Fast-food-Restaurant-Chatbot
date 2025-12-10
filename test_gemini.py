import google.generativeai as genai

# Direct API key configuration
API_KEY = "AIzaSyATZk_XkmU0k12Awe_y_Ny1b5kPl07SzX4"
genai.configure(api_key=API_KEY)

try:
    # List available models first
    print("Available models:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"  - {m.name}")
    
    # Try with gemini-1.5-flash
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello! Say hi back in one short sentence.")
    print(f"\nGemini Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
