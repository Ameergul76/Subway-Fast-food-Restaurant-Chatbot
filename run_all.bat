@echo off
REM Activate Python virtual environment
call .venv\Scripts\activate

REM Start FastAPI backend
start cmd /k "uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

REM Change to frontend directory and start Vite dev server
cd frontend
start cmd /k "npm run dev"
