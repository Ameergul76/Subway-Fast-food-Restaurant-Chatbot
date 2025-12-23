import requests
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")
KEY = os.getenv("HUGGINGFACE_API_KEY")

urls = [
    "https://router.huggingface.co/hf-inference/models/gpt2",
    "https://router.huggingface.co/hf-inference/models/google/gemma-2-9b-it"
]
headers = {"Authorization": f"Bearer {KEY}"}

for url in urls:
    try:
        print(f"--- Sending request to {url} ---")
        json_payload = {"inputs": "Hi"}
        response = requests.post(url, headers=headers, json=json_payload, timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:200]}") # Truncate
    except Exception as e:
        print(f"Error: {e}")
