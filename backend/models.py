from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Restaurant(Base):
    __tablename__ = "restaurant_info"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Subway Fast Food")
    owner = Column(String, default="Ameer Gul")
    phone = Column(String, default="03151095812")
    address = Column(String, default="Gulshan-e-Mazdoor, Karachi, Pakistan")
    description = Column(String, default="Best fast food in town!")


class Menu(Base):
    __tablename__ = "menu"

    id = Column(Integer, primary_key=True, index=True)
    item = Column(String, index=True)
    category = Column(String)
    price = Column(Float)
    description = Column(String)

class Category(Base):
    __tablename__ = "categories"

    name = Column(String, primary_key=True, index=True)
    image_url = Column(String)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    tracking_code = Column(String, unique=True, index=True)
    user_details = Column(String) # JSON or simple string for MVP
    total_amount = Column(Float, default=0.0)
    order_status = Column(String, default="Pending") # Pending, Preparing, Ready, Completed, Cancelled
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    item_id = Column(Integer, ForeignKey("menu.id"))
    quantity = Column(Integer, default=1)

    order = relationship("Order", back_populates="items")
    menu_item = relationship("Menu")
