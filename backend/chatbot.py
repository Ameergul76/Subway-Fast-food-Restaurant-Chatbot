from sqlalchemy.orm import Session
from . import crud, schemas
import re

def process_chat_message(message: str, db: Session):
    message_lower = message.lower()
    
    # Greeting detection (use word boundaries to avoid false matches)
    greetings = ["hello", "hey", "good morning", "good afternoon", "good evening"]
    # Check for "hi" as a standalone word
    if any(greeting in message_lower for greeting in greetings) or re.search(r'\bhi\b', message_lower):
        return "Hello! Welcome to our restaurant! 🍕\n\nI can help you with:\n- View our menu (say 'menu' or 'show menu')\n- Place an order (say 'order pizza' or 'I want chicken')\n- Check categories (say 'show pizzas' or 'what desserts do you have')\n\nWhat would you like to do?"
    
    # Help detection
    if "help" in message_lower:
        return "I'm here to help! 😊\n\nYou can:\n- Say 'menu' to see all items\n- Say 'order [item name]' to place an order\n- Say 'show [category]' to see items by category\n- Ask about specific items like 'tell me about pizza'\n\nWhat would you like to do?"
    
    # Menu display - broader detection
    if any(word in message_lower for word in ["menu", "list", "show all", "what do you have", "what's available", "items"]):
        menu_items = crud.get_menu(db)
        if not menu_items:
            return "The menu is currently empty."
        
        # Group by category
        categories = {}
        for item in menu_items:
            if item.category not in categories:
                categories[item.category] = []
            categories[item.category].append(item)
        
        response = "🍽️ **Our Menu**\n\n"
        for category, items in categories.items():
            response += f"**{category}:**\n"
            for item in items:
                response += f"  • {item.item} - ${item.price:.2f}\n    {item.description}\n"
            response += "\n"
        
        response += "To order, just say 'order [item name]' or 'I want [item name]'!"
        return response
    
    # Order detection - much broader (CHECK THIS FIRST before category browsing)
    order_keywords = ["order", "buy", "want", "get", "purchase", "i'll have", "i'd like", "can i get", "give me"]
    if any(keyword in message_lower for keyword in order_keywords):
        menu_items = crud.get_menu(db)
        found_items = []
        
        # Try to find menu items mentioned in the message
        for item in menu_items:
            item_name_lower = item.item.lower()
            # Check for full name or partial matches
            if item_name_lower in message_lower or any(word in message_lower for word in item_name_lower.split()):
                found_items.append(item)
        
        if found_items:
            # Create an actual order
            try:
                # Extract quantity if mentioned
                quantity = 1
                quantity_match = re.search(r'(\d+)\s*(?:x|of|pieces?)?', message_lower)
                if quantity_match:
                    quantity = int(quantity_match.group(1))
                
                # Use the first found item
                item = found_items[0]
                
                # Create order
                order_items = [schemas.OrderItemCreate(item_id=item.id, quantity=quantity)]
                order_data = schemas.OrderCreate(
                    user_details="Chat Customer",
                    items=order_items
                )
                
                order = crud.create_order(db=db, order=order_data)
                
                response = f"✅ **Order Placed Successfully!**\n\n"
                response += f"Order #{order.id}\n"
                response += f"• {quantity}x {item.item} - ${item.price * quantity:.2f}\n"
                response += f"**Total: ${order.total_amount:.2f}**\n\n"
                response += f"Your order is being prepared! You can check the status on the dashboard."
                
                return response
                
            except Exception as e:
                return f"Sorry, I had trouble placing your order. Error: {str(e)}"
        else:
            # Suggest items
            return "I'd love to help you order! Could you tell me which item you'd like? Say 'menu' to see all available items, or try saying 'order pizza' or 'I want chicken sandwich'."
    
    # Category-specific queries (only if not ordering)
    categories_keywords = {
        "pizza": ["pizza", "pizzas"],
        "pasta": ["pasta", "spaghetti", "noodles"],
        "salad": ["salad", "salads"],
        "sandwich": ["sandwich", "sandwiches", "burger"],
        "sides": ["sides", "side", "fries"],
        "dessert": ["dessert", "desserts", "sweet", "cake"],
        "beverage": ["beverage", "drink", "drinks", "soda"]
    }
    
    # Check if asking about a category (not ordering)
    if any(word in message_lower for word in ["show", "what", "list", "see", "have"]):
        for category, keywords in categories_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                menu_items = crud.get_menu(db)
                category_items = [item for item in menu_items if item.category.lower() == category]
                
                if category_items:
                    response = f"🍽️ **{category.title()} Menu:**\n\n"
                    for item in category_items:
                        response += f"• {item.item} - ${item.price:.2f}\n  {item.description}\n\n"
                    response += f"To order, say 'order {category_items[0].item}' or 'I want {category_items[0].item}'!"
                    return response
                else:
                    return f"Sorry, we don't have any {category} items right now."
    
    # Price inquiry
    if "price" in message_lower or "cost" in message_lower or "how much" in message_lower:
        menu_items = crud.get_menu(db)
        for item in menu_items:
            if item.item.lower() in message_lower:
                return f"The {item.item} costs ${item.price:.2f}. Would you like to order it?"
        return "Which item would you like to know the price of? Say 'menu' to see all items and prices."
    
    # Item description inquiry
    if any(word in message_lower for word in ["tell me about", "what is", "describe", "info about", "information"]):
        menu_items = crud.get_menu(db)
        for item in menu_items:
            if item.item.lower() in message_lower:
                return f"**{item.item}** (${item.price:.2f})\n{item.description}\n\nWould you like to order it? Just say 'order {item.item}'!"
        return "Which item would you like to know about? Say 'menu' to see all available items."
    
    # Status check
    if "status" in message_lower or "track" in message_lower or "my order" in message_lower:
        orders = crud.get_orders(db, limit=5)
        if orders:
            response = "📋 **Recent Orders:**\n\n"
            for order in orders[:3]:
                response += f"Order #{order.id} - {order.order_status}\n"
                response += f"Total: ${order.total_amount:.2f}\n\n"
            return response
        return "You don't have any recent orders. Would you like to place one? Say 'menu' to see what we have!"
    
    # Thank you
    if "thank" in message_lower or "thanks" in message_lower:
        return "You're welcome! 😊 Is there anything else I can help you with?"
    
    # Goodbye
    if any(word in message_lower for word in ["bye", "goodbye", "see you", "later"]):
        return "Goodbye! Thanks for visiting our restaurant. Come back soon! 👋"
    
    # Default response - more helpful
    return "I'm not sure I understood that. 🤔\n\nI can help you:\n- View the menu (say 'menu')\n- Order food (say 'order pizza' or 'I want salad')\n- Check prices (say 'how much is the pizza')\n- Get info about items (say 'tell me about the chicken sandwich')\n\nWhat would you like to do?"
