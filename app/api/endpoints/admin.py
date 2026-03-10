from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.db.database import get_db
from app.models.user import User
from app.models.agent import Agent
from app.models.verification import VerificationRequest
from app.schemas.admin import UserAdminManagementResponse, VerificationRequestAdminResponse

router = APIRouter()

@router.get("/users", response_model=List[UserAdminManagementResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin),
) -> Any:
    """
    Retrieve all users. Admin only.
    """
    users = db.query(User).all()
    
    result = []
    for user in users:
        has_agent_profile = user.agent_profile is not None
        is_verified = user.agent_profile.is_verified if has_agent_profile else False
            
        result.append({
            "id": user.id,
            "email": user.email,
            "is_active": user.is_active,
            "is_agent": user.is_agent,
            "has_agent_profile": has_agent_profile,
            "is_verified": is_verified,
            "is_admin": user.is_admin,
            "created_at": user.created_at
        })
        
    return result

@router.put("/users/{user_id}/toggle-active", response_model=UserAdminManagementResponse)
def toggle_user_active_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin),
) -> Any:
    """
    Suspend or Activate a user. Admin only.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Toggle active status
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{user_id}", response_model=UserAdminManagementResponse)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin),
) -> Any:
    """
    Delete a user. Admin only.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Don't allow admins to delete themselves easily through this endpoint
    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")

    db.delete(user)
    db.commit()
    return user

@router.get("/verifications", response_model=List[VerificationRequestAdminResponse])
def get_pending_verifications(
    db: Session = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin),
) -> Any:
    """
    Retrieve all pending verification requests. Admin only.
    """
    requests = db.query(VerificationRequest).filter(VerificationRequest.status == "PENDING").all()
    
    result = []
    for req in requests:
        agent = db.query(Agent).filter(Agent.id == req.agent_id).first()
        user_email = ""
        if agent and agent.user:
            user_email = agent.user.email
            
        result.append({
            "id": req.id,
            "agent_id": req.agent_id,
            "user_email": user_email,
            "nin_submitted": req.nin_submitted,
            "phone_submitted": req.phone_submitted,
            "status": req.status,
            "created_at": req.created_at
        })
    return result

@router.put("/verifications/{request_id}/approve", response_model=VerificationRequestAdminResponse)
def approve_verification(
    request_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin),
) -> Any:
    """
    Approve an agent verification request. Admin only.
    """
    req = db.query(VerificationRequest).filter(VerificationRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "PENDING":
        raise HTTPException(status_code=400, detail="Request is not pending")
        
    req.status = "APPROVED"
    db.add(req)
    
    agent = db.query(Agent).filter(Agent.id == req.agent_id).first()
    user_email = ""
    if agent:
        if agent.user:
            user_email = agent.user.email
            agent.user.is_agent = True
            db.add(agent.user)
            
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
    
    return {
        "id": req.id,
        "agent_id": req.agent_id,
        "user_email": user_email,
        "nin_submitted": req.nin_submitted,
        "phone_submitted": req.phone_submitted,
        "status": req.status,
        "created_at": req.created_at
    }

@router.put("/verifications/{request_id}/reject", response_model=VerificationRequestAdminResponse)
def reject_verification(
    request_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(deps.get_current_admin),
) -> Any:
    """
    Reject an agent verification request. Admin only.
    """
    req = db.query(VerificationRequest).filter(VerificationRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "PENDING":
        raise HTTPException(status_code=400, detail="Request is not pending")
        
    req.status = "REJECTED"
    db.add(req)
    
    agent = db.query(Agent).filter(Agent.id == req.agent_id).first()
    user_email = agent.user.email if agent and agent.user else ""

    db.commit()
    db.refresh(req)
    
    return {
        "id": req.id,
        "agent_id": req.agent_id,
        "user_email": user_email,
        "nin_submitted": req.nin_submitted,
        "phone_submitted": req.phone_submitted,
        "status": req.status,
        "created_at": req.created_at
    }
