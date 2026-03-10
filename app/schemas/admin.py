from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class VerificationRequestAdminResponse(BaseModel):
    id: int
    agent_id: int
    user_email: str
    nin_submitted: Optional[str] = None
    phone_submitted: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

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
    has_agent_profile: bool = False
    is_verified: bool = False
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True
