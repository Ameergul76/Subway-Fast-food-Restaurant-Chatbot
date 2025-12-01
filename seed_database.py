"""
Script to seed the database with sample menu items
"""
from backend.database import SessionLocal, engine
from backend import models

# Create tables
models.Base.metadata.create_all(bind=engine)

def seed_menu():
    db = SessionLocal()
    
    # Check if menu already has items
    existing_items = db.query(models.Menu).count()
    if existing_items > 0:
        print(f"Database already has {existing_items} menu items. Skipping seed.")
        db.close()
        return
    
    # Sample menu items
    menu_items = [
        {
            "item": "Margherita Pizza",
            "category": "Pizza",
            "price": 12.99,
            "description": "Classic pizza with tomato sauce, mozzarella, and basil"
        },
        {
            "item": "Pepperoni Pizza",
            "category": "Pizza",
            "price": 14.99,
            "description": "Pizza topped with pepperoni and mozzarella cheese"
        },
        {
            "item": "Caesar Salad",
            "category": "Salad",
            "price": 8.99,
            "description": "Fresh romaine lettuce with Caesar dressing and croutons"
        },
        {
            "item": "Spaghetti Carbonara",
            "category": "Pasta",
            "price": 13.99,
            "description": "Pasta with creamy sauce, bacon, and parmesan"
        },
        {
            "item": "Grilled Chicken Sandwich",
            "category": "Sandwich",
            "price": 10.99,
            "description": "Grilled chicken breast with lettuce, tomato, and mayo"
        },
        {
            "item": "French Fries",
            "category": "Sides",
            "price": 4.99,
            "description": "Crispy golden french fries"
        },
        {
            "item": "Chocolate Cake",
            "category": "Dessert",
            "price": 6.99,
            "description": "Rich chocolate cake with chocolate frosting"
        },
        {
            "item": "Coca Cola",
            "category": "Beverage",
            "price": 2.99,
            "description": "Refreshing soft drink"
        }
    ]
    
    for item_data in menu_items:
        menu_item = models.Menu(**item_data)
        db.add(menu_item)
    
    db.commit()
    print(f"Successfully added {len(menu_items)} menu items to the database!")
    db.close()

if __name__ == "__main__":
    seed_menu()
