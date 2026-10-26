from typing import Optional
from pydantic import BaseModel, ConfigDict


class CultivationGuideBase(BaseModel):
    land_preparation: str
    seed_selection: str
    sowing_method: str
    irrigation: str
    nutrient_management: str
    weed_management: str
    growth_stages: str
    beginner_mistakes: Optional[str] = None


class CultivationGuideCreate(CultivationGuideBase):
    crop_id: int


class CultivationGuideResponse(CultivationGuideBase):
    id: int
    crop_id: int

    model_config = ConfigDict(from_attributes=True)


class PestDiseaseBase(BaseModel):
    name: str
    type: str  # "Pest" or "Disease"
    symptoms: str
    conditions: str
    prevention: str
    management: str
    source_reference: Optional[str] = None
    last_reviewed_at: Optional[str] = None


class PestDiseaseCreate(PestDiseaseBase):
    crop_id: int


class PestDiseaseResponse(PestDiseaseBase):
    id: int
    crop_id: int

    model_config = ConfigDict(from_attributes=True)


class HarvestGuideBase(BaseModel):
    maturity_indicators: str
    approximate_harvest_period: str
    harvesting_method: str
    handling_precautions: str
    storage_preparation: str


class HarvestGuideCreate(HarvestGuideBase):
    crop_id: int


class HarvestGuideResponse(HarvestGuideBase):
    id: int
    crop_id: int

    model_config = ConfigDict(from_attributes=True)


class PostHarvestGuideBase(BaseModel):
    cleaning_and_grading: str
    storage_method: str
    preservation_method: str
    processing_method: str
    packaging_method: str
    food_uses: str
    industrial_uses: str
    by_products: str


class PostHarvestGuideCreate(PostHarvestGuideBase):
    crop_id: int


class PostHarvestGuideResponse(PostHarvestGuideBase):
    id: int
    crop_id: int

    model_config = ConfigDict(from_attributes=True)


class CropProductBase(BaseModel):
    product_name: str
    product_category: str
    raw_material: str
    processing_overview: str
    common_uses: str
    storage_considerations: str
    potential_value_addition: str


class CropProductCreate(CropProductBase):
    crop_id: int


class CropProductResponse(CropProductBase):
    id: int
    crop_id: int

    model_config = ConfigDict(from_attributes=True)
