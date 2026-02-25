import sys
import os

# Adjust path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User
from app.models.admin import Admin
from app.core.security import get_password_hash

def seed_admin():
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin_email = "admin@luxehousing.com"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        
        if existing_admin:
            if not existing_admin.is_admin:
                existing_admin.is_admin = True
                db.commit()
                print(f"Updated existing user {admin_email} to be an admin.")
            else:
                print(f"Admin user {admin_email} already exists.")
            return

        # Create new admin user
        new_user = User(
            email=admin_email,
            hashed_password=get_password_hash("AdminPassword123!"),
            is_active=True,
            is_agent=False,
            is_admin=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Create Admin profile
        new_admin = Admin(user_id=new_user.id)
        db.add(new_admin)
        db.commit()
        
        print(f"Successfully created admin user: {admin_email} with password: AdminPassword123!")

    except Exception as e:
        print(f"Error seeding admin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_admin()
