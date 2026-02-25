from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, DateTime, func, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    location = Column(String, index=True, nullable=False)
    property_type = Column(String, index=True) # e.g., rent, sale
    bedrooms = Column(Integer, default=0)
    bathrooms = Column(Integer, default=0)
    is_available = Column(Boolean, default=True)
    
    agent_id = Column(Integer, ForeignKey("agents.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    agent = relationship("Agent", back_populates="properties")
    reports = relationship("Report", back_populates="property_reported")
    images = relationship("PropertyImage", back_populates="property", cascade="all, delete-orphan")

class PropertyImage(Base):
    __tablename__ = "property_images"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    file_path = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    property = relationship("Property", back_populates="images")
