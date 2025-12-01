from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from . import models, schemas

# Menu CRUD
def get_menu(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Menu).offset(skip).limit(limit).all()

def create_menu_item(db: Session, menu: schemas.MenuCreate):
    db_menu = models.Menu(**menu.dict())
    db.add(db_menu)
    db.commit()
    db.refresh(db_menu)
    return db_menu

def get_menu_item_by_name(db: Session, name: str):
    return db.query(models.Menu).filter(models.Menu.item.ilike(f"%{name}%")).all()

# Order CRUD
def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).options(
        joinedload(models.Order.items).joinedload(models.OrderItem.menu_item)
    ).order_by(models.Order.created_at.desc()).offset(skip).limit(limit).all()

def create_order(db: Session, order: schemas.OrderCreate):
    # Calculate total amount
    total_amount = 0.0
    db_items = []
    
    # Create Order object first
    db_order = models.Order(
        user_details=order.user_details,
        order_status="Pending"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Process items
    for item in order.items:
        menu_item = db.query(models.Menu).filter(models.Menu.id == item.item_id).first()
        if menu_item:
            total_amount += menu_item.price * item.quantity
            db_item = models.OrderItem(
                order_id=db_order.id,
                item_id=item.item_id,
                quantity=item.quantity
            )
            db.add(db_item)
    
    # Update total amount
    db_order.total_amount = total_amount
    db.commit()
    db.refresh(db_order)
    return db_order

def update_order_status(db: Session, order_id: int, status: str):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order:
        db_order.order_status = status
        db.commit()
        db.refresh(db_order)
    return db_order

def get_analytics_data(db: Session):
    # Query to sum quantity * price for each menu item
    results = db.query(
        models.Menu.item,
        func.sum(models.OrderItem.quantity * models.Menu.price).label("total_income")
    ).join(models.OrderItem, models.Menu.id == models.OrderItem.item_id)\
     .group_by(models.Menu.item).all()
    
    return [{"name": r[0], "income": r[1]} for r in results]
