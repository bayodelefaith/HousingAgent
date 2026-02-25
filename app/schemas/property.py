from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from app.schemas.agent import AgentResponse

class PropertyBase(BaseModel):
    title: str
    description: str
    price: float
    location: str
    property_type: str
    bedrooms: int
    bathrooms: int

class PropertyCreate(PropertyBase):
    pass

class PropertyImageResponse(BaseModel):
    id: int
    property_id: int
    file_path: str
    created_at: datetime

    class Config:
        from_attributes = True

class PropertyResponse(PropertyBase):
    id: int
    is_available: bool
    agent_id: int
    created_at: datetime
    agent: Optional[AgentResponse] = None
    images: list[PropertyImageResponse] = []

    class Config:
        from_attributes = True
