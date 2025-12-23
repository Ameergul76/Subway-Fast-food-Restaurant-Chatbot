print("🔥 NEW CHATBOT FILE LOADED")

from sqlalchemy.orm import Session
import re
import os
import logging
from pathlib import Path
from dotenv import load_dotenv
from rapidfuzz import fuzz
import google.generativeai as genai

from . import crud, schemas

# ------------------ LOGGING ------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ------------------ ENV ------------------
env_path = Path(__file__).parent / ".env"
if not env_path.exists():
    logger.warning(f".env file not found at {env_path}")
load_dotenv(dotenv_path=env_path)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise RuntimeError("❌ GOOGLE_API_KEY missing in .env file")

# ------------------ GEMINI CONFIG ------------------
genai.configure(api_key=GOOGLE_API_KEY)

def get_available_model(preferred_model="gemini-1.5"):
    """Tries preferred model, falls back to first available generative model."""
    try:
        # Try preferred model first
        model = genai.GenerativeModel(preferred_model)
        logger.info(f"Using preferred model: {preferred_model}")
        return model
    except Exception as e:
        logger.warning(f"Preferred model not available: {e}")
        # List all available models
        available_models = genai.list_models()
        for m in available_models:
            if "generateContent" in m.available_methods:
                logger.info(f"Using fallback model: {m.name}")
                return genai.GenerativeModel(m.name)
        raise RuntimeError("❌ No available generative model found.")

model = get_available_model()  # Automatically chooses working model

# ------------------ MEMORY ------------------
conversation_history = {}

# ------------------ LLM CALL ------------------
def query_llm(system_prompt: str, user_message: str) -> str:
    if not model:
        return "⚠️ AI model currently unavailable."

    try:
        prompt = f"{system_prompt}\n\nUser: {user_message}"
        response = model.generate_content(prompt)
        logger.debug(f"Raw Gemini response: {response}")

        if hasattr(response, "text") and response.text:
            return response.text.strip()
        elif hasattr(response, "candidates") and len(response.candidates) > 0:
            part = response.candidates[0].content.parts
            if part and len(part) > 0:
                return part[0].text.strip()

        return "⚠️ AI is temporarily unavailable. (Empty response)"

    except Exception as e:
        logger.error(f"Gemini Error: {e}")
        return f"⚠️ AI is temporarily unavailable. ({e})"

# ------------------ FUZZY MATCH ------------------
def find_menu_items(message: str, menu_items, threshold=70):
    results = []
    msg = message.lower()
    for item in menu_items:
        score = fuzz.partial_ratio(item.item.lower(), msg)
        if score >= threshold:
            results.append(item)
    return results

# ------------------ MAIN CHAT HANDLER ------------------
def process_chat_message(
    message: str,
    db: Session,
    session_id: str = "default"
):
    try:
        msg_lower = message.lower()
        menu_items = crud.get_menu(db)

        # ---------- ORDER INTENT ----------
        order_keywords = ["order", "buy", "purchase", "give me", "i'll have"]
        is_order_intent = any(k in msg_lower for k in order_keywords)
        matched_items = find_menu_items(message, menu_items)

        if is_order_intent and matched_items:
            item = matched_items[0]
            qty = 1
            qty_match = re.search(r"(\d+)", msg_lower)
            if qty_match:
                qty = int(qty_match.group(1))

            order_data = schemas.OrderCreate(
                user_details="Chat Customer",
                items=[schemas.OrderItemCreate(item_id=item.id, quantity=qty)]
            )
            order = crud.create_order(db, order_data)

            return (
                f"✅ **Order Placed!**\n\n"
                f"🍽 Item: {item.item}\n"
                f"🔢 Quantity: {qty}\n"
                f"💰 Total: ${order.total_amount:.2f}\n\n"
                f"📦 Tracking Code: **{order.tracking_code}**"
            )

        # ---------- TRACK ORDER ----------
        if "track" in msg_lower:
            code_match = re.search(r"\b[A-Z0-9]{6}\b", message.upper())
            if not code_match:
                return "📦 Please provide your **6-digit tracking code**."
            order = crud.get_order_by_tracking_code(db, code_match.group())
            if not order:
                return "❌ Order not found."
            return (
                f"📦 **Order Status**\n\n"
                f"Status: **{order.order_status}**\n"
                f"Total: ${order.total_amount:.2f}"
            )

        # ---------- AI MODE ----------
        if session_id not in conversation_history:
            conversation_history[session_id] = []

        conversation_history[session_id] = conversation_history[session_id][-6:]
        history_text = "\n".join(
            [f"{r}: {t}" for r, t in conversation_history[session_id]]
        )

        restaurant = crud.get_restaurant_info(db)
        system_prompt = f"""
You are a restaurant AI assistant.

Restaurant Name: {restaurant.name if restaurant else "Fast Food"}
Owner: {restaurant.owner if restaurant else "Ameer Gul"}
Phone: {restaurant.phone if restaurant else "03151095812"}
Address: {restaurant.address if restaurant else "Karachi"}

MENU:
{[item.item + " ($" + str(item.price) + ")" for item in menu_items]}

RULES:
- Reply in SAME language as user (English / Urdu / Roman Urdu)
- Be friendly
- Do NOT place order unless user clearly wants to buy
- Use emojis 🍕🍔

Conversation:
{history_text}
"""

        ai_reply = query_llm(system_prompt, message)
        conversation_history[session_id].append(("User", message))
        conversation_history[session_id].append(("Assistant", ai_reply))

        return ai_reply

    except Exception as e:
        logger.error(f"Chat Error: {e}")
        return f"⚠️ Something went wrong. ({e})"
