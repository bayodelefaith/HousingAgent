from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.models.agent import Agent
from app.models.property import Property
from app.models.review_and_report import Rating, Report
from app.schemas.review_and_report import RatingCreate, RatingResponse, ReportCreate, ReportResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/ratings", response_model=RatingResponse)
def rate_agent(
    rating_in: RatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    # Check if agent exists
    agent = db.query(Agent).filter(Agent.id == rating_in.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
        
    # Prevent rating oneself
    if agent.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot rate yourself")

    rating = Rating(
        user_id=current_user.id,
        agent_id=rating_in.agent_id,
        score=rating_in.score,
        review=rating_in.review
    )
    db.add(rating)
    db.commit()
    db.refresh(rating)
    
    # Recalculate agent rating asynchronously in a real app, but here we do it synchronously
    all_ratings = db.query(Rating).filter(Rating.agent_id == agent.id).all()
    if all_ratings:
        avg = sum(r.score for r in all_ratings) / len(all_ratings)
        agent.average_rating = avg
        db.add(agent)
        db.commit()
        
    return rating

@router.post("/reports", response_model=ReportResponse, summary="Report an agent or property")
def create_report(
    report_in: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    if not report_in.agent_id and not report_in.property_id:
        raise HTTPException(status_code=400, detail="Must provide either agent_id or property_id to report")
        
    if report_in.agent_id:
        agent = db.query(Agent).filter(Agent.id == report_in.agent_id).first()
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
            
    if report_in.property_id:
        prop = db.query(Property).filter(Property.id == report_in.property_id).first()
        if not prop:
            raise HTTPException(status_code=404, detail="Property not found")

    report = Report(
        user_id=current_user.id,
        agent_id=report_in.agent_id,
        property_id=report_in.property_id,
        reason=report_in.reason
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
