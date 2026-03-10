from typing import Optional
from pydantic import BaseModel
from app.schemas.user import UserResponse

class AgentBase(BaseModel):
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    phone_number: Optional[str] = None
    nin: Optional[str] = None
    nin_image: Optional[str] = ""

class AgentCreate(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    nin: str
    nin_image: str

class AgentResponse(AgentBase):
    id: int
    user_id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    nin_image: Optional[str] = None
    verification_level: int
    is_verified: bool
    average_rating: float
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True
