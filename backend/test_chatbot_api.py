
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_chat(message):
    print(f"\nUser: {message}")
    try:
        response = requests.post(f"{BASE_URL}/chat/", json={"message": message, "session_id": "test_user_1"})
        if response.status_code == 200:
            print(f"Bot: {response.json()['response']}")
        else:
            print(f"Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    print("--- Testing Chatbot Logic ---")
    
    # 1. Test Order (Should trigger LOCAL deterministic logic)
    # We use a fuzzy match that we know works or generic "order" keyword
    test_chat("I want to order 2 pizzas") 

    # 2. Test Greeting (Should trigger LLM)
    test_chat("Hello!")

    # 3. Test Knowledge (Should trigger LLM)
    test_chat("Who is the owner of this place?")
    
    # 4. Test Menu Info (Should trigger LLM)
    test_chat("What is the price of a burger?")
