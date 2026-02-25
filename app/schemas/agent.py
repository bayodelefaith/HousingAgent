from typing import Optional
from pydantic import BaseModel
from app.schemas.user import UserResponse

class AgentBase(BaseModel):
    phone_number: Optional[str] = None
    nin: Optional[str] = None

class AgentCreate(AgentBase):
    pass

class AgentResponse(AgentBase):
    id: int
    user_id: int
    verification_level: int
    is_verified: bool
    average_rating: float
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True
