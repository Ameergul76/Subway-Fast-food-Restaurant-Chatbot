import requests
import json

def test_chat():
    url = "http://127.0.0.1:8000/chat/"
    headers = {"Content-Type": "application/json"}
    
    # Test case 1: General query (should go to LLM)
    payload = {"message": "What do you recommend for a vegetarian?"}
    try:
        response = requests.post(url, headers=headers, json=payload)
        print(f"User: {payload['message']}")
        print(f"Bot: {response.json()['response']}\n")
    except Exception as e:
        print(f"Error: {e}")

    # Test case 2: Specific menu query (might go to LLM or rule-based depending on implementation)
    payload = {"message": "tell me about the pizza"}
    try:
        response = requests.post(url, headers=headers, json=payload)
        print(f"User: {payload['message']}")
        print(f"Bot: {response.json()['response']}\n")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_chat()
