from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.agent import Agent
from app.models.verification import VerificationRequest
from app.schemas.agent import AgentResponse, AgentCreate
from app.schemas.verification import VerificationRequestCreate, VerificationRequestResponse
from app.api.deps import get_current_user, get_current_active_user, get_current_agent

router = APIRouter()

@router.post("/register", response_model=AgentResponse)
def register_as_agent(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)) -> Any:
    # Check if already an agent
    if current_user.is_agent:
        raise HTTPException(status_code=400, detail="User is already an agent")
    
    agent = Agent(user_id=current_user.id)
    db.add(agent)
    
    # Update user role
    current_user.is_agent = True
    db.add(current_user)
    
    db.commit()
    db.refresh(agent)
    return agent

@router.post("/verify/submit", response_model=VerificationRequestResponse)
def submit_verification(
    verification_in: VerificationRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_agent)
) -> Any:
    # Need to check if there is a pending request already
    agent = db.query(Agent).filter(Agent.user_id == current_user.id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent profile not found")
        
    pending = db.query(VerificationRequest).filter(
        VerificationRequest.agent_id == agent.id, 
        VerificationRequest.status == "PENDING"
    ).first()
    
    if pending:
        raise HTTPException(status_code=400, detail="You already have a pending verification request")

    req = VerificationRequest(
        agent_id=agent.id,
        nin_submitted=verification_in.nin_submitted,
        phone_submitted=verification_in.phone_submitted
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return req

@router.put("/verify/approve/{request_id}", response_model=VerificationRequestResponse)
def approve_verification(
    request_id: int,
    db: Session = Depends(get_db)
    # Admin dependency could be added here in a real scenario
) -> Any:
    req = db.query(VerificationRequest).filter(VerificationRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "PENDING":
        raise HTTPException(status_code=400, detail="Request is not pending")
        
    req.status = "APPROVED"
    db.add(req)
    
    # Upgrade agent level
    agent = db.query(Agent).filter(Agent.id == req.agent_id).first()
    if agent:
        if req.nin_submitted:
            agent.nin = req.nin_submitted
            agent.verification_level = 2
            agent.is_verified = True
        elif req.phone_submitted:
            agent.phone_number = req.phone_submitted
            if agent.verification_level < 1:
                agent.verification_level = 1
                
        db.add(agent)
        
    db.commit()
    db.refresh(req)
    return req
