from typing import List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from . import crud, models, schemas, chatbot
from .database import engine, SessionLocal

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Restaurant AI Chatbot API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Restaurant AI Chatbot Backend is Running"}

# Menu Endpoints
@app.post("/menu/", response_model=schemas.Menu)
def create_menu_item(menu: schemas.MenuCreate, db: Session = Depends(get_db)):
    return crud.create_menu_item(db=db, menu=menu)

@app.get("/menu/", response_model=List[schemas.Menu])
def read_menu(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_menu(db, skip=skip, limit=limit)

# Order Endpoints
@app.post("/orders/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db=db, order=order)

@app.get("/orders/", response_model=List[schemas.Order])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_orders(db, skip=skip, limit=limit)

# Analytics Endpoint
@app.get("/analytics/", response_model=List[dict])
def get_analytics(db: Session = Depends(get_db)):
    return crud.get_analytics_data(db)

@app.put("/orders/{order_id}/status", response_model=schemas.Order)
def update_order_status(order_id: int, status: schemas.OrderUpdateStatus, db: Session = Depends(get_db)):
    db_order = crud.update_order_status(db, order_id=order_id, status=status.order_status)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

# Chat Endpoint
class ChatRequest(BaseModel):
    message: str

@app.post("/chat/")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    response = chatbot.process_chat_message(request.message, db)
    return {"response": response}
