from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class VerificationRequestBase(BaseModel):
    nin_submitted: Optional[str] = None
    phone_submitted: Optional[str] = None

class VerificationRequestCreate(VerificationRequestBase):
    pass

class VerificationRequestResponse(VerificationRequestBase):
    id: int
    agent_id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
