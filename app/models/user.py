from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_agent = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    agent_profile = relationship("Agent", back_populates="user", uselist=False)
    admin_profile = relationship("Admin", back_populates="user", uselist=False)
    ratings_given = relationship("Rating", back_populates="user")
    reports_submitted = relationship("Report", back_populates="user")
