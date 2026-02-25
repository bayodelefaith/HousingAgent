from typing import Any, List, Optional
import os
import uuid
import shutil
import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.database import get_db
from app.models.user import User
from app.models.agent import Agent
from app.models.property import Property, PropertyImage
from app.schemas.property import PropertyCreate, PropertyResponse, PropertyImageResponse
from app.api.deps import get_current_agent, get_current_user
from app.core.config import settings

# Configure cloudinary
if settings.CLOUDINARY_CLOUD_NAME:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET
    )

router = APIRouter()

@router.post("/{property_id}/images", response_model=List[PropertyImageResponse])
def upload_property_images(
    property_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_agent)
) -> Any:
    property_obj = db.query(Property).filter(Property.id == property_id).first()
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
        
    agent = db.query(Agent).filter(Agent.user_id == current_user.id).first()
    if not agent or property_obj.agent_id != agent.id:
        raise HTTPException(status_code=403, detail="You can only upload images for your own properties")

    uploaded_images = []
    
    for file in files:
        if not file.filename:
            continue
            
        if settings.CLOUDINARY_CLOUD_NAME:
            try:
                result = cloudinary.uploader.upload(
                    file.file, 
                    folder=f"housing_agent/properties/{property_id}"
                )
                image_url = result.get('secure_url')
            except Exception as e:
                print(f"Cloudinary upload failed: {e}")
                continue
        else:
            # Generate unique filename for local
            ext = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4()}{ext}"
            filepath = os.path.join("uploads", "properties", unique_filename)
            
            # Save file to disk
            with open(filepath, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            image_url = f"/uploads/properties/{unique_filename}"
            
        # Store in db
        image_record = PropertyImage(
            property_id=property_id,
            file_path=image_url
        )
        db.add(image_record)
        uploaded_images.append(image_record)
        
    db.commit()
    for img in uploaded_images:
        db.refresh(img)
        
    return uploaded_images

@router.post("/", response_model=PropertyResponse)
def create_property(
    property_in: PropertyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_agent)
) -> Any:
    # Ensure agent is level 2 (Fully Verified)
    agent = db.query(Agent).filter(Agent.user_id == current_user.id).first()
    if not agent:
        raise HTTPException(
            status_code=403, 
            detail="You must be an active agent to post properties."
        )
        
    property_obj = Property(
        **property_in.model_dump(),
        agent_id=agent.id
    )
    db.add(property_obj)
    db.commit()
    db.refresh(property_obj)
    return property_obj

@router.get("/", response_model=List[PropertyResponse])
def list_properties(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    location: Optional[str] = None,
    property_type: Optional[str] = None,
    bedrooms: Optional[int] = None
) -> Any:
    query = db.query(Property).filter(Property.is_available == True)
    
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)
    if location:
        query = query.filter(Property.location.ilike(f"%{location}%"))
    if property_type:
        query = query.filter(Property.property_type.ilike(f"%{property_type}%"))
    if bedrooms is not None:
        query = query.filter(Property.bedrooms >= bedrooms)
        
    properties = query.offset(skip).limit(limit).all()
    return properties

@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(
    property_id: int,
    db: Session = Depends(get_db)
) -> Any:
    property_obj = db.query(Property).filter(Property.id == property_id).first()
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    return property_obj
