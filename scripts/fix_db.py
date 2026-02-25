import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import SessionLocal
from app.models.user import User

def fix_null_is_admin():
    db = SessionLocal()
    try:
        users = db.query(User).filter(User.is_admin.is_(None)).all()
        count = 0
        for user in users:
            user.is_admin = False
            count += 1
        db.commit()
        print(f"Fixed {count} users with NULL is_admin.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    fix_null_is_admin()
