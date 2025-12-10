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

def delete_menu_item(db: Session, item_id: int):
    db_item = db.query(models.Menu).filter(models.Menu.id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
        return True
    return False

def get_menu_item_by_name(db: Session, name: str):
    return db.query(models.Menu).filter(models.Menu.item.ilike(f"%{name}%")).all()

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()

def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(name=category.name, image_url=category.image_url)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

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
        func.sum(models.OrderItem.quantity * models.Menu.price).label("total_income"),
        func.sum(models.OrderItem.quantity).label("total_quantity")
    ).join(models.OrderItem, models.Menu.id == models.OrderItem.item_id)\
     .group_by(models.Menu.item).all()
    
    return [{"name": r[0], "income": r[1], "quantity": r[2]} for r in results]

def delete_order(db: Session, order_id: int):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order:
        # Delete associated order items first (if cascade is not set up, though usually handled by DB)
        # But for safety in this simple setup:
        db.query(models.OrderItem).filter(models.OrderItem.order_id == order_id).delete()
        db.delete(db_order)
        db.commit()
        return True
    return False

def get_order_statistics(db: Session):
    """Get order count by status"""
    pending = db.query(models.Order).filter(models.Order.order_status == "Pending").count()
    preparing = db.query(models.Order).filter(models.Order.order_status == "Preparing").count()
    ready = db.query(models.Order).filter(models.Order.order_status == "Ready").count()
    completed = db.query(models.Order).filter(models.Order.order_status == "Completed").count()
    cancelled = db.query(models.Order).filter(models.Order.order_status == "Cancelled").count()
    total = db.query(models.Order).count()
    
    return {
        "pending": pending,
        "preparing": preparing,
        "ready": ready,
        "completed": completed,
        "cancelled": cancelled,
        "total": total
    }

