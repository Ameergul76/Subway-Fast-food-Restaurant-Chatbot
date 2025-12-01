# Quick Setup Guide (New Machine)

## Prerequisites
- Python 3.8+ (https://python.org)
- Node.js 16+ (https://nodejs.org)

## Setup (5 Minutes)

### 1. Install Backend Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Create Database
```bash
python seed_database.py
```

### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

## Run

### Windows
```bash
start_all.bat
```

### Mac/Linux
**Terminal 1:**
```bash
python run_backend.py
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

## Access
- Dashboard: http://localhost:5173
- Chat: http://localhost:5173/chat
- API: http://localhost:8000

## Test
1. Go to http://localhost:5173/chat
2. Type: "show menu"
3. Type: "order pizza"
4. Check dashboard at http://localhost:5173

Done! 🎉

---

**Need help?** See `SETUP_NEW_MACHINE.md` for detailed instructions.
