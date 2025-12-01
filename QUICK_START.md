# Quick Start Guide

## Your Restaurant AI Chatbot is Ready! 🚀

Both servers are currently running:

### 🔧 Backend Server
- **URL**: http://localhost:8000
- **Status**: ✅ Running
- **API Docs**: http://localhost:8000/docs (FastAPI auto-generated)

### 🎨 Frontend Server
- **URL**: http://localhost:5173
- **Status**: ✅ Running

## Access the Application

### 1. Admin Dashboard
Open your browser and go to:
```
http://localhost:5173
```

Features:
- View all orders in real-time
- Update order status
- See weekly analytics

### 2. Customer Chat Interface
Open your browser and go to:
```
http://localhost:5173/chat
```

Try these commands:
- "show menu" - Display all menu items
- "order pizza" - Test order intent
- "status" - Check order status

## Sample Menu Items

The database has been seeded with:
- 🍕 Margherita Pizza - $12.99
- 🍕 Pepperoni Pizza - $14.99
- 🥗 Caesar Salad - $8.99
- 🍝 Spaghetti Carbonara - $13.99
- 🥪 Grilled Chicken Sandwich - $10.99
- 🍟 French Fries - $4.99
- 🍰 Chocolate Cake - $6.99
- 🥤 Coca Cola - $2.99

## Testing the API

### Get Menu Items
```bash
curl http://localhost:8000/menu/
```

### Send Chat Message
```bash
curl -X POST http://localhost:8000/chat/ -H "Content-Type: application/json" -d "{\"message\":\"show menu\"}"
```

### Get Orders
```bash
curl http://localhost:8000/orders/
```

## Stopping the Servers

To stop the servers, press `CTRL+C` in each terminal window.

## Restarting the Application

### Option 1: Use the Batch Script (Windows)
Double-click `start_all.bat`

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
python run_backend.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Project Structure

```
📁 Restaurant AI Chatbot
├── 📁 backend/          # FastAPI backend
│   ├── main.py          # API endpoints
│   ├── models.py        # Database models
│   ├── schemas.py       # Data validation
│   ├── crud.py          # Database operations
│   └── chatbot.py       # Chatbot logic
├── 📁 frontend/         # React frontend
│   └── 📁 src/
│       ├── App.jsx      # Main app
│       ├── api.js       # API client
│       └── 📁 components/
│           ├── ChatInterface.jsx
│           ├── OrderList.jsx
│           └── AnalyticsChart.jsx
├── run_backend.py       # Backend starter
├── seed_database.py     # Database seeder
└── restaurant.db        # SQLite database
```

## Need Help?

- Check `README.md` for detailed documentation
- Check `FIXES_APPLIED.md` for technical details
- Visit http://localhost:8000/docs for API documentation

## Next Steps

1. ✅ Explore the chat interface
2. ✅ Try creating an order through the API
3. ✅ View orders in the dashboard
4. ✅ Update order status
5. 🔜 Customize the chatbot logic
6. 🔜 Add more menu items
7. 🔜 Integrate with a real LLM

Enjoy your Restaurant AI Chatbot! 🎉
