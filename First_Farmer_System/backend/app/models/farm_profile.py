from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base


class FarmProfile(Base):
    __tablename__ = "farm_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    region = Column(String(100), nullable=False)
    soil_type = Column(String(100), nullable=False)
    season = Column(String(50), nullable=False)
    water_availability = Column(String(50), nullable=False)  # Low, Medium, High
    temperature = Column(Float, nullable=True)
    rainfall = Column(Float, nullable=True)
    climate_source = Column(String(100), nullable=True)

    user = relationship("User", back_populates="farm_profiles")
