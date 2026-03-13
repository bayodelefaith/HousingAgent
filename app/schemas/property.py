from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from app.schemas.agent import AgentResponse
from app.schemas.review_and_report import ReportResponse

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

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    location: Optional[str] = None
    property_type: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    is_available: Optional[bool] = None

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
    reports: list[ReportResponse] = []

    class Config:
        from_attributes = True
