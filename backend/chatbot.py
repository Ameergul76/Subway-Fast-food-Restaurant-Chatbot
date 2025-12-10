from sqlalchemy.orm import Session
from sqlalchemy import func
from . import crud, schemas, models
import re
from rapidfuzz import fuzz, process
import os
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load .env from backend directory
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    logger.error("GOOGLE_API_KEY not found in environment variables")

genai.configure(api_key=GOOGLE_API_KEY)

# Initialize Gemini model
# Using 1.5 Flash for better stability
gemini_model = genai.GenerativeModel('gemini-1.5-flash')

# In-memory history storage
conversation_history = {}

def get_local_fallback_response(message: str, menu_items):
    """
    Fallback ONLY when API is dead.
    User explicitly requested NO hardcoded answers.
    So we just give an error message.
    """
    return "⏳ API Quota Exceeded. The AI is tired and cannot chat right now. Please wait a minute and try again."

def query_gemini_llm(system_prompt, user_message, menu_items, retries=3, delay=2):
    """Query Google Gemini for AI responses with retry logic"""
    for attempt in range(retries):
        try:
            response = gemini_model.generate_content(system_prompt)
            return response.text
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Gemini API Error (Attempt {attempt+1}/{retries}): {error_msg}")
            
            if "429" in error_msg or "Resource has been exhausted" in error_msg or "quota" in error_msg.lower():
                # Exponential backoff
                if attempt < retries - 1:
                    sleep_time = delay * (2 ** attempt)
                    time.sleep(sleep_time)
                    continue
                
                return get_local_fallback_response(user_message, menu_items)
            
            # Other errors
            if attempt < retries - 1:
                 time.sleep(delay)
                 continue
                 
    return get_local_fallback_response(user_message, menu_items)

def find_menu_items_fuzzy(message: str, menu_items, threshold=70):
    """
    Find menu items using fuzzy string matching.
    Returns list of matched items with their scores.
    """
    message_lower = message.lower()
    matched_items = []
    
    for item in menu_items:
        item_name_lower = item.item.lower()
        
        # Direct substring match
        if item_name_lower in message_lower:
            matched_items.append((item, 100))
            continue
        
        # Fuzzy match on full name
        score = fuzz.partial_ratio(item_name_lower, message_lower)
        if score >= threshold:
            matched_items.append((item, score))
            continue
        
        # Check individual words
        for word in item_name_lower.split():
            if len(word) > 3:  # Only check words longer than 3 chars
                word_score = fuzz.ratio(word, message_lower)
                if word_score >= threshold:
                    matched_items.append((item, word_score))
                    break
    
    # Sort by score descending and remove duplicates
    seen = set()
    unique_matches = []
    for item, score in sorted(matched_items, key=lambda x: x[1], reverse=True):
        if item.id not in seen:
            seen.add(item.id)
            unique_matches.append((item, score))
    
    return unique_matches

def extract_quantities(message: str):
    """
    Extract quantities from message.
    Returns dict of {position: quantity}
    """
    quantities = {}
    # Match patterns like "2 pizzas", "3x burger", "five salads"
    number_words = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    }
    
    # Find numeric quantities
    for match in re.finditer(r'(\d+)\s*(?:x|of|pieces?)?', message.lower()):
        quantities[match.start()] = int(match.group(1))
    
    # Find word quantities
    for word, num in number_words.items():
        if word in message.lower():
            pos = message.lower().find(word)
            quantities[pos] = num
    
    return quantities

def parse_multi_item_order(message: str, menu_items):
    """
    Parse message for multiple items and quantities.
    Returns list of (item, quantity) tuples.
    """
    message_lower = message.lower()
    order_items = []
    
    # Split by common separators
    separators = [' and ', ' & ', ', ', ' plus ', ' with ']
    parts = [message_lower]
    
    for sep in separators:
        new_parts = []
        for part in parts:
            new_parts.extend(part.split(sep))
        parts = new_parts
    
    # Extract quantities
    quantities = extract_quantities(message)
    
    # Try to match each part to menu items
    for part in parts:
        part = part.strip()
        if len(part) < 3:
            continue
        
        matches = find_menu_items_fuzzy(part, menu_items, threshold=60)
        if matches:
            item = matches[0][0]  # Best match
            
            # Find quantity for this item
            quantity = 1
            for pos, qty in quantities.items():
                # Check if quantity appears near the item mention
                if pos < len(message) and abs(message.lower().find(part) - pos) < 20:
                    quantity = qty
                    break
            
            order_items.append((item, quantity))
    
    return order_items

def process_chat_message(message: str, db: Session, session_id: str = "default"):
    message_lower = message.lower()
    
    # --- ACTION DETECTION (Deterministic Logic for Orders) ---
    order_keywords = ["order", "buy", "want", "get", "purchase", "i'll have", "i'd like", "can i get", "give me", "i need"]
    if any(re.search(r'\b' + re.escape(keyword) + r'\b', message_lower) for keyword in order_keywords):
        menu_items = crud.get_menu(db)
        
        # Try multi-item parsing
        order_items = parse_multi_item_order(message, menu_items)
        
        if not order_items:
            matches = find_menu_items_fuzzy(message, menu_items, threshold=65)
            if matches:
                 item = matches[0][0]
                 quantity = 1
                 qty_match = re.search(r'(\d+)', message_lower)
                 if qty_match:
                     quantity = int(qty_match.group(1))
                 order_items = [(item, quantity)]

        if order_items:
            try:
                # Create order
                order_item_schemas = []
                for item, qty in order_items:
                    order_item_schemas.append(schemas.OrderItemCreate(item_id=item.id, quantity=qty))
                
                order_data = schemas.OrderCreate(
                    user_details="Chat Customer",
                    items=order_item_schemas
                )
                order = crud.create_order(db=db, order=order_data)
                
                response = f"✅ **Order Placed Successfully!**\n\nOrder #{order.id}\n"
                for item, qty in order_items:
                    response += f"• {qty}x {item.item} - ${item.price * qty:.2f}\n"
                response += f"\n**Total: ${order.total_amount:.2f}**\n\nYour food is on the way! 🚀"
                return response
            except Exception as e:
                logger.error(f"Order error: {e}")
                return "I tried to place that order but ran into a system error. Please try again or contact support."

    # 2. Status Check
    if "status" in message_lower or "track" in message_lower or "my order" in message_lower:
        orders = crud.get_orders(db, limit=5)
        if orders:
            response = "📋 **Recent Orders:**\n\n"
            for order in orders[:3]:
                response += f"Order #{order.id} - {order.order_status}\nTotal: ${order.total_amount:.2f}\n\n"
            return response

    # --- LLM HANDLING (Pure AI) ---
    
    menu_items = crud.get_menu(db)
    
    # 1. Build Menu Context
    menu_context = "current_menu = [\n"
    for item in menu_items:
        menu_context += f"  {{'name': '{item.item}', 'price': {item.price}, 'category': '{item.category}', 'description': '{item.description}'}},\n"
    menu_context += "]"

    # 2. History Management
    if session_id not in conversation_history:
        conversation_history[session_id] = []
    
    if len(conversation_history[session_id]) > 20:
        conversation_history[session_id] = conversation_history[session_id][-10:]

    history_text = "\n".join([f"{role}: {text}" for role, text in conversation_history[session_id]])

    # 3. System Prompt - Injected Knowledge
    system_prompt = f"""
You are the official AI assistant for **Subway Fast Food**.

**RESTAURANT DETAILS (Memorize this)**:
- **Name**: Subway Fast Food
- **Owner**: Ameer Gul (03151095812)
- **Address**: Gulshan-e-Mazdoor, Karachi, Pakistan
- **Opening Hours**: Open 7 days a week.

**MENU DATA**:
{menu_context}

**YOUR JOB**:
- Answer questions by looking at the RESTAURANT DETAILS and MENU DATA.
- If asking for "Owner", say "Ameer Gul".
- If asking for "Price", look up the item in MENU DATA.
- Guide users to order by saying "I want [Item]".
- Be friendly, polite, and use emojis 🍕.

**CONVERSATION HISTORY**:
{history_text}

**USER MESSAGE**:
{message}

**RESPONSE**:
"""
    
    # Call LLM
    llm_response = query_gemini_llm(system_prompt, message, menu_items)
    
    # Update History
    conversation_history[session_id].append(("User", message))
    conversation_history[session_id].append(("Assistant", llm_response))
    
    return llm_response
