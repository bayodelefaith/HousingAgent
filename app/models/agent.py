from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.db.database import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    first_name = Column(String, default="")
    last_name = Column(String, default="")
    nin = Column(String(11), unique=True, index=True, nullable=True)
    nin_image = Column(String, default="")
    phone_number = Column(String, unique=True, index=True, nullable=True)
    
    # 0: Unverified, 1: Phone Verified, 2: NIN Verified
    verification_level = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    
    average_rating = Column(Float, default=0.0)

    user = relationship("User", back_populates="agent_profile")
    properties = relationship("Property", back_populates="agent")
    verification_requests = relationship("VerificationRequest", back_populates="agent")
    ratings_received = relationship("Rating", back_populates="agent")
    reports_received = relationship("Report", back_populates="agent")
