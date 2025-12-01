# Deployment Guide

## Prerequisites
- Python 3.8+
- Node.js 14+
- Git

## Local Deployment

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend will run on `http://localhost:8000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Production Deployment (Suggested)

### Backend (Render / Railway)
1. Create a `requirements.txt` (already done).
2. Push code to GitHub.
3. Connect repository to Render/Railway.
4. Set build command: `pip install -r backend/requirements.txt`.
5. Set start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`.

### Frontend (Vercel / Netlify)
1. Push code to GitHub.
2. Connect repository to Vercel.
3. Set root directory to `frontend`.
4. Set build command: `npm run build`.
5. Set output directory: `dist`.
6. Add environment variable `VITE_API_URL` pointing to your deployed backend URL.

## Database
- For MVP, SQLite is used (file-based).
- For production, switch `SQLALCHEMY_DATABASE_URL` in `backend/database.py` to a PostgreSQL URL.
