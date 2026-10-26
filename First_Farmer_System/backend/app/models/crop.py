from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base


class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    scientific_name = Column(String(120), nullable=True)
    category = Column(String(50), nullable=False, index=True)  # Cereal, Cash Crop, Vegetable, Fruit, Pulse, Millet
    description = Column(Text, nullable=False)
    suitable_regions = Column(String(255), nullable=False)  # Comma-separated or descriptive
    soil_requirements = Column(String(255), nullable=False)  # Alluvial, Clay, Loamy, Sandy, Black soil, Red soil
    climate_requirements = Column(String(255), nullable=False)  # Temperature, humidity, altitude
    season = Column(String(100), nullable=False, index=True)  # Kharif, Rabi, Zaid, Year-round
    water_requirement = Column(String(50), nullable=False)  # Low, Medium, High
    difficulty_level = Column(String(50), default="Beginner", nullable=False)  # Beginner, Intermediate, Advanced
    image_path = Column(String(255), nullable=True)
    is_published = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    cultivation_guide = relationship("CultivationGuide", back_populates="crop", uselist=False, cascade="all, delete-orphan")
    pest_diseases = relationship("PestDisease", back_populates="crop", cascade="all, delete-orphan")
    harvest_guide = relationship("HarvestGuide", back_populates="crop", uselist=False, cascade="all, delete-orphan")
    post_harvest_guide = relationship("PostHarvestGuide", back_populates="crop", uselist=False, cascade="all, delete-orphan")
    products = relationship("CropProduct", back_populates="crop", cascade="all, delete-orphan")
    bookmarks = relationship("CropBookmark", back_populates="crop", cascade="all, delete-orphan")
    learning_progress = relationship("LearningProgress", back_populates="crop", cascade="all, delete-orphan")
