from typing import Any, List
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.agent import Agent
from app.models.verification import VerificationRequest
from app.schemas.agent import AgentResponse, AgentCreate
from app.schemas.verification import VerificationRequestCreate, VerificationRequestResponse
from app.api.deps import get_current_user, get_current_active_user, get_current_agent
from app.core.config import settings

# Configure cloudinary
if settings.CLOUDINARY_CLOUD_NAME:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET
    )

router = APIRouter()

@router.post("/register", response_model=AgentResponse)
def register_as_agent(agent_in: AgentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)) -> Any:
    # Check if already an agent
    if current_user.is_agent:
        raise HTTPException(status_code=400, detail="User is already an agent")
    
    agent = Agent(
        user_id=current_user.id,
        first_name=agent_in.first_name,
        last_name=agent_in.last_name,
        nin=agent_in.nin,
        nin_image=agent_in.nin_image,
        phone_number=agent_in.phone_number
    )
    db.add(agent)
    
    db.flush() # Need agent.id for verification request
    
    req = VerificationRequest(
        agent_id=agent.id,
        nin_submitted=agent_in.nin,
        phone_submitted=agent_in.phone_number,
        status="PENDING"
    )
    db.add(req)

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



@router.get("/me", response_model=AgentResponse)
def get_my_agent_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_agent)) -> Any:
    agent = db.query(Agent).filter(Agent.user_id == current_user.id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent profile not found")
    return agent

@router.post("/upload-nin-image", response_model=AgentResponse)
def upload_nin_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_agent)
) -> Any:
    """Upload NIN (National Identification Number) image to Cloudinary"""
    agent = db.query(Agent).filter(Agent.user_id == current_user.id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent profile not found")
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    try:
        if settings.CLOUDINARY_CLOUD_NAME:
            # Upload to Cloudinary in NIN folder
            result = cloudinary.uploader.upload(
                file.file,
                folder="housing_agent/NIN",
                resource_type="auto"
            )
            image_url = result.get('secure_url')
        else:
            raise HTTPException(status_code=500, detail="Cloudinary is not configured")
        
        # Update agent's nin_image field
        agent.nin_image = image_url
        db.commit()
        db.refresh(agent)
        
        return agent
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload NIN image: {str(e)}")