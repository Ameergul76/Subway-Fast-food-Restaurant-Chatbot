import requests
import json

def test_chat():
    url = "http://localhost:8000/chat/"
    headers = {"Content-Type": "application/json"}
    data = {"message": "Hello", "session_id": "debug_user"}
    
    try:
        print(f"Sending request to {url}...")
        response = requests.post(url, headers=headers, json=data, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_chat()
