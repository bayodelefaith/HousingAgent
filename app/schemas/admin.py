from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class AdminBase(BaseModel):
    user_id: int

class AdminCreate(AdminBase):
    pass

class AdminResponse(AdminBase):
    id: int

    class Config:
        from_attributes = True

class UserAdminManagementResponse(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    is_agent: bool
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True
