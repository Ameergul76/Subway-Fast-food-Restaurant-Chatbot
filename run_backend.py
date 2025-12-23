"""
Script to run the FastAPI backend server
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,  # Changed port back to 8000 to match frontend
        reload=False,  # Disable reloader to isolate issues
        log_level="debug"  # Enable detailed debug logging
    )
