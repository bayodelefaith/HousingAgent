from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.db.database import get_db
from app.models.user import User
from app.schemas.admin import UserAdminManagementResponse

router = APIRouter()

@router.get("/users", response_model=List[UserAdminManagementResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin),
) -> Any:
    """
    Retrieve all users. Admin only.
    """
    users = db.query(User).all()
    return users

@router.put("/users/{user_id}/toggle-active", response_model=UserAdminManagementResponse)
def toggle_user_active_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin),
) -> Any:
    """
    Suspend or Activate a user. Admin only.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Toggle active status
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{user_id}", response_model=UserAdminManagementResponse)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin),
) -> Any:
    """
    Delete a user. Admin only.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Don't allow admins to delete themselves easily through this endpoint
    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")

    db.delete(user)
    db.commit()
    return user
