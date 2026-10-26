from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.guides import (
    CultivationGuideResponse,
    PestDiseaseResponse,
    HarvestGuideResponse,
    PostHarvestGuideResponse,
    CropProductResponse,
)


class CropBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    scientific_name: Optional[str] = Field(None, max_length=120)
    category: str = Field(..., max_length=50)
    description: str
    suitable_regions: str
    soil_requirements: str
    climate_requirements: str
    season: str
    water_requirement: str
    difficulty_level: str = "Beginner"
    image_path: Optional[str] = None
    is_published: bool = True


class CropCreate(CropBase):
    pass


class CropUpdate(BaseModel):
    name: Optional[str] = None
    scientific_name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    suitable_regions: Optional[str] = None
    soil_requirements: Optional[str] = None
    climate_requirements: Optional[str] = None
    season: Optional[str] = None
    water_requirement: Optional[str] = None
    difficulty_level: Optional[str] = None
    image_path: Optional[str] = None
    is_published: Optional[bool] = None


class CropResponse(CropBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CropDetailResponse(CropResponse):
    cultivation_guide: Optional[CultivationGuideResponse] = None
    pest_diseases: List[PestDiseaseResponse] = []
    harvest_guide: Optional[HarvestGuideResponse] = None
    post_harvest_guide: Optional[PostHarvestGuideResponse] = None
    products: List[CropProductResponse] = []

    model_config = ConfigDict(from_attributes=True)


class CropFilterParams(BaseModel):
    search: Optional[str] = None
    category: Optional[str] = None
    season: Optional[str] = None
    soil: Optional[str] = None
    region: Optional[str] = None
    water: Optional[str] = None
