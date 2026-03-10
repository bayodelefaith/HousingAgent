from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    is_active: bool
    is_agent: bool
    is_admin: bool
    is_verified: bool = False
    created_at: datetime
    has_agent_profile: bool = False

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str
