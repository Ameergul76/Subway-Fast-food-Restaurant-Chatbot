# Chatbot Usage Guide

## 🤖 Enhanced Chatbot Features

The chatbot has been significantly improved and can now understand natural language and actually place orders!

## What You Can Do

### 1. View the Menu
Try any of these:
- "menu"
- "show menu"
- "what do you have"
- "list items"
- "what's available"

### 2. View Specific Categories
- "show pizzas"
- "what desserts do you have"
- "show me salads"
- "what drinks do you have"

### 3. Place Orders (NEW! 🎉)
The chatbot can now actually place orders! Try:
- "order pizza"
- "I want chicken sandwich"
- "get me a salad"
- "I'd like 2 pizzas"
- "can I get french fries"
- "buy chocolate cake"

The chatbot will:
- Find the item you mentioned
- Create a real order in the system
- Give you an order number
- Show the total price

### 4. Get Item Information
- "tell me about the pizza"
- "what is the chicken sandwich"
- "describe the salad"
- "info about chocolate cake"

### 5. Check Prices
- "how much is the pizza"
- "price of salad"
- "what does the cake cost"

### 6. Check Order Status
- "status"
- "my orders"
- "track my order"

### 7. Get Help
- "help"
- "what can you do"

### 8. Greetings
- "hi"
- "hello"
- "good morning"

## Example Conversations

### Example 1: Quick Order
```
You: hi
Bot: Hello! Welcome to our restaurant! 🍕 ...

You: order pizza
Bot: ✅ Order Placed Successfully!
     Order #1
     • 1x Margherita Pizza - $12.99
     Total: $12.99
     Your order is being prepared!
```

### Example 2: Browse Then Order
```
You: show menu
Bot: 🍽️ Our Menu
     [Shows full menu with categories]

You: tell me about the chicken sandwich
Bot: Grilled Chicken Sandwich ($10.99)
     Grilled chicken breast with lettuce, tomato, and mayo
     Would you like to order it?

You: yes, I want 2
Bot: ✅ Order Placed Successfully!
     Order #2
     • 2x Grilled Chicken Sandwich - $21.98
     Total: $21.98
```

### Example 3: Category Browse
```
You: what desserts do you have
Bot: 🍽️ Dessert Menu:
     • Chocolate Cake - $6.99
       Rich chocolate cake with chocolate frosting

You: order chocolate cake
Bot: ✅ Order Placed Successfully! ...
```

## Features

✅ Natural language understanding  
✅ Multiple ways to phrase requests  
✅ Actual order placement  
✅ Quantity detection (e.g., "2 pizzas")  
✅ Category filtering  
✅ Item descriptions  
✅ Price inquiries  
✅ Order status checking  
✅ Helpful suggestions  

## View Your Orders

After placing orders through the chat:
1. Go to the Dashboard: http://localhost:5173
2. You'll see all orders including those placed via chat
3. Orders from chat show "Chat Customer" as the customer name
4. You can update order status from the dashboard

## Tips

- Be natural! The bot understands many ways to phrase things
- You can mention quantities: "2 pizzas", "3 salads"
- The bot will suggest items if it doesn't understand
- All orders are real and appear in the dashboard
- Try different phrasings - the bot is flexible!

## Technical Details

The chatbot now:
- Uses pattern matching for intent detection
- Searches menu items by name and keywords
- Creates actual database orders
- Extracts quantities from messages
- Provides formatted, helpful responses
- Handles errors gracefully

Enjoy your improved chatbot! 🎉
