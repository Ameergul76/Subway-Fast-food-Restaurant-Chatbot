
# In-memory history storage
conversation_history = {}  # Global history dictionary

def test_chatbot_interactive():
    print("--- Testing Chatbot with Hugging Face ---")
    
    # Mock database session (not used for LLM only test, but needed for signature)
    # In a real test we might mock crud.get_menu(db)
    
    # But to test strictly the connection, we can mock the DB to return some items
    from unittest.mock import MagicMock
    db = MagicMock()
    
    # Mock menu items
    mock_items = []
    # We can skip DB mocking if we just want to test process_chat_message LLM path
    # process_chat_message calls crud.get_menu(db). We should mock that.
    
    import sys
    sys.modules['backend.crud'] = MagicMock()
    sys.modules['backend.crud'].get_menu.return_value = [
        MagicMock(item="Pizza", price=1000, category="Fast Food", description="Cheesy pizza", id=1),
        MagicMock(item="Burger", price=500, category="Fast Food", description="Beef burger", id=2)
    ]
    
    # We also need to mock crud.create_order to avoid errors if logic goes there
    sys.modules['backend.crud'].create_order.return_value = MagicMock(id=123, total_amount=1000)
    
    from backend.chatbot import process_chat_message
    
    while True:
        user_input = input("\nUser: ")
        if user_input.lower() in ["exit", "quit"]:
            break
            
        response = process_chat_message(user_input, db)
        print(f"Bot: {response}")

if __name__ == "__main__":
    test_chatbot_interactive()
