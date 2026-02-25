from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RatingBase(BaseModel):
    score: int
    review: Optional[str] = None

class RatingCreate(RatingBase):
    agent_id: int

class RatingResponse(RatingBase):
    id: int
    user_id: int
    agent_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ReportBase(BaseModel):
    reason: str

class ReportCreate(ReportBase):
    agent_id: Optional[int] = None
    property_id: Optional[int] = None

class ReportResponse(ReportBase):
    id: int
    status: str
    user_id: int
    agent_id: Optional[int] = None
    property_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
