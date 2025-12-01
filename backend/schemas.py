from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

# Menu Schemas
class MenuBase(BaseModel):
    item: str
    category: str
    price: float
    description: str

class MenuCreate(MenuBase):
    pass

class Menu(MenuBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int

# Order Schemas
class OrderItemBase(BaseModel):
    item_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    order_id: int
    menu_item: Optional[Menu] = None  # Include menu item details

class OrderCreate(BaseModel):
    user_details: str
    items: List[OrderItemCreate]

class OrderUpdateStatus(BaseModel):
    order_status: str

class Order(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    user_details: str
    total_amount: float
    order_status: str
    created_at: datetime
    items: List[OrderItem] = []
