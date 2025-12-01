# Setup Guide for New Machine

This guide will help you set up and run the Restaurant AI Chatbot project on a new computer.

## Prerequisites

Before you start, make sure you have these installed:

### Required Software
1. **Python 3.8 or higher**
   - Download from: https://www.python.org/downloads/
   - During installation, check "Add Python to PATH"

2. **Node.js 16 or higher**
   - Download from: https://nodejs.org/
   - This includes npm (Node Package Manager)

3. **Git** (optional, for cloning the project)
   - Download from: https://git-scm.com/

## Step-by-Step Setup

### Step 1: Get the Project Files

**Option A: If you have the project folder**
- Copy the entire project folder to your new machine

**Option B: If using Git**
```bash
git clone <your-repository-url>
cd restaurant-ai-chatbot
```

### Step 2: Backend Setup

1. **Open Terminal/Command Prompt** in the project folder

2. **Install Python Dependencies**
```bash
pip install -r backend/requirements.txt
```

If you get permission errors, try:
```bash
pip install --user -r backend/requirements.txt
```

3. **Seed the Database** (only needed first time)
```bash
python seed_database.py
```

This creates the database and adds sample menu items.

### Step 3: Frontend Setup

1. **Navigate to Frontend Folder**
```bash
cd frontend
```

2. **Install Node Dependencies**
```bash
npm install
```

This will take a few minutes to download all packages.

3. **Go Back to Project Root**
```bash
cd ..
```

### Step 4: Start the Application

You have two options:

#### Option A: Use the Batch Script (Windows Only)
Double-click `start_all.bat` - this starts both servers automatically!

#### Option B: Manual Start (Works on All Systems)

**Terminal 1 - Start Backend:**
```bash
python run_backend.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v7.2.4  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 5: Access the Application

Open your web browser and go to:
- **Dashboard**: http://localhost:5173
- **Chat Interface**: http://localhost:5173/chat
- **API Docs**: http://localhost:8000/docs

## Troubleshooting

### Python Issues

**Problem**: `python` command not found
**Solution**: Try `python3` instead, or reinstall Python and check "Add to PATH"

**Problem**: Module not found errors
**Solution**: Make sure you installed dependencies:
```bash
pip install fastapi uvicorn sqlalchemy pydantic python-multipart
```

### Node/NPM Issues

**Problem**: `npm` command not found
**Solution**: Reinstall Node.js from https://nodejs.org/

**Problem**: Permission errors during `npm install`
**Solution**: 
- Windows: Run terminal as Administrator
- Mac/Linux: Use `sudo npm install` (not recommended) or fix npm permissions

**Problem**: Port 5173 already in use
**Solution**: Kill the process using that port or change the port in `vite.config.js`

### Database Issues

**Problem**: Database file missing
**Solution**: Run `python seed_database.py` to create it

**Problem**: Empty menu
**Solution**: Run `python seed_database.py` again

### Backend Won't Start

**Problem**: Port 8000 already in use
**Solution**: 
1. Find and kill the process using port 8000
2. Or change the port in `run_backend.py`:
```python
uvicorn.run("backend.main:app", host="0.0.0.0", port=8001, reload=True)
```

### Frontend Won't Start

**Problem**: Dependencies not installed
**Solution**: 
```bash
cd frontend
npm install
```

**Problem**: Build errors
**Solution**: Delete `node_modules` and reinstall:
```bash
cd frontend
rm -rf node_modules
npm install
```

## Quick Reference

### Start Commands

**Backend:**
```bash
python run_backend.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Both (Windows):**
```bash
start_all.bat
```

### Stop Commands

- Press `Ctrl+C` in each terminal window
- Or close the terminal windows

### Reset Database

If you want to start fresh:
```bash
# Delete the database
rm restaurant.db  # Mac/Linux
del restaurant.db  # Windows

# Recreate and seed it
python seed_database.py
```

### Add More Menu Items

Edit `seed_database.py` and add items to the `menu_items` list, then run:
```bash
python seed_database.py
```

## File Structure

```
restaurant-ai-chatbot/
├── backend/              # Python FastAPI backend
│   ├── main.py          # API endpoints
│   ├── models.py        # Database models
│   ├── schemas.py       # Data validation
│   ├── crud.py          # Database operations
│   ├── chatbot.py       # Chatbot logic
│   ├── database.py      # Database config
│   └── requirements.txt # Python dependencies
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx      # Main app
│   │   └── api.js       # API client
│   ├── package.json     # Node dependencies
│   └── vite.config.js   # Build config
├── run_backend.py       # Backend starter script
├── seed_database.py     # Database seeder
├── start_all.bat        # Start both servers (Windows)
├── restaurant.db        # SQLite database
└── README.md            # Full documentation
```

## Testing the Setup

After starting both servers, test:

1. **Backend API**: http://localhost:8000
   - Should show: `{"message":"Restaurant AI Chatbot Backend is Running"}`

2. **Menu API**: http://localhost:8000/menu/
   - Should show list of menu items

3. **Frontend**: http://localhost:5173
   - Should show the dashboard

4. **Chat**: http://localhost:5173/chat
   - Try: "show menu" or "order pizza"

## Next Steps

Once everything is running:
1. Try the chat interface
2. Place some orders
3. View orders in the dashboard
4. Update order status
5. Customize the menu items
6. Modify the chatbot responses

## Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Read `README.md` for detailed documentation
3. Check `QUICK_START.md` for quick reference
4. Look at error messages in the terminal

## Summary Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Project files copied/cloned
- [ ] Backend dependencies installed (`pip install -r backend/requirements.txt`)
- [ ] Frontend dependencies installed (`cd frontend && npm install`)
- [ ] Database seeded (`python seed_database.py`)
- [ ] Backend started (`python run_backend.py`)
- [ ] Frontend started (`cd frontend && npm run dev`)
- [ ] Tested at http://localhost:5173

That's it! Your Restaurant AI Chatbot should now be running! 🎉
