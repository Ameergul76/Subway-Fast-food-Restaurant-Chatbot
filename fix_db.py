import sqlite3
import os

DB_PATH = "restaurant.db"

def fix_db():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check current columns
        cursor.execute("PRAGMA table_info(orders)")
        columns = [info[1] for info in cursor.fetchall()]
        print(f"Current columns in 'orders': {columns}")
        
        if "tracking_code" not in columns:
            print("Adding missing column 'tracking_code'...")
            cursor.execute("ALTER TABLE orders ADD COLUMN tracking_code VARCHAR")
            conn.commit()
            print("Column added successfully.")
        else:
            print("Column 'tracking_code' already exists.")
            
        conn.close()
        print("Database fix complete.")
        
    except Exception as e:
        print(f"Error fixing database: {e}")

if __name__ == "__main__":
    fix_db()
