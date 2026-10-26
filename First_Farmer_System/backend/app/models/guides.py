from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base


class CultivationGuide(Base):
    __tablename__ = "cultivation_guides"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id", ondelete="CASCADE"), unique=True, nullable=False)
    land_preparation = Column(Text, nullable=False)
    seed_selection = Column(Text, nullable=False)
    sowing_method = Column(Text, nullable=False)
    irrigation = Column(Text, nullable=False)
    nutrient_management = Column(Text, nullable=False)
    weed_management = Column(Text, nullable=False)
    growth_stages = Column(Text, nullable=False)
    beginner_mistakes = Column(Text, nullable=True)

    crop = relationship("Crop", back_populates="cultivation_guide")


class PestDisease(Base):
    __tablename__ = "pest_diseases"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(120), nullable=False, index=True)
    type = Column(String(50), nullable=False)  # "Pest", "Disease"
    symptoms = Column(Text, nullable=False)
    conditions = Column(Text, nullable=False)  # Contributing conditions
    prevention = Column(Text, nullable=False)
    management = Column(Text, nullable=False)  # Integrated Pest Management
    source_reference = Column(String(255), nullable=True)
    last_reviewed_at = Column(String(100), nullable=True)

    crop = relationship("Crop", back_populates="pest_diseases")


class HarvestGuide(Base):
    __tablename__ = "harvest_guides"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id", ondelete="CASCADE"), unique=True, nullable=False)
    maturity_indicators = Column(Text, nullable=False)
    approximate_harvest_period = Column(String(100), nullable=False)
    harvesting_method = Column(Text, nullable=False)
    handling_precautions = Column(Text, nullable=False)
    storage_preparation = Column(Text, nullable=False)

    crop = relationship("Crop", back_populates="harvest_guide")


class PostHarvestGuide(Base):
    __tablename__ = "post_harvest_guides"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id", ondelete="CASCADE"), unique=True, nullable=False)
    cleaning_and_grading = Column(Text, nullable=False)
    storage_method = Column(Text, nullable=False)
    preservation_method = Column(Text, nullable=False)
    processing_method = Column(Text, nullable=False)
    packaging_method = Column(Text, nullable=False)
    food_uses = Column(Text, nullable=False)
    industrial_uses = Column(Text, nullable=False)
    by_products = Column(Text, nullable=False)

    crop = relationship("Crop", back_populates="post_harvest_guide")


class CropProduct(Base):
    __tablename__ = "crop_products"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id", ondelete="CASCADE"), nullable=False)
    product_name = Column(String(150), nullable=False)
    product_category = Column(String(100), nullable=False)  # Food, Industrial, Health, By-product
    raw_material = Column(String(150), nullable=False)
    processing_overview = Column(Text, nullable=False)
    common_uses = Column(Text, nullable=False)
    storage_considerations = Column(Text, nullable=False)
    potential_value_addition = Column(Text, nullable=False)

    crop = relationship("Crop", back_populates="products")
