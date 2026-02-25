from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Rating(Base):
    __tablename__ = "ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    agent_id = Column(Integer, ForeignKey("agents.id"))
    score = Column(Integer, nullable=False) # e.g. 1 to 5
    review = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="ratings_given")
    agent = relationship("Agent", back_populates="ratings_received")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=True)
    reason = Column(Text, nullable=False)
    status = Column(String, default="OPEN") # OPEN, RESOLVED, DISMISSED
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="reports_submitted")
    agent = relationship("Agent", back_populates="reports_received")
    property_reported = relationship("Property", back_populates="reports")
