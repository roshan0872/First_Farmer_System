from typing import Optional, List
from pydantic import BaseModel, Field
from app.schemas.crop import CropResponse


class RecommendationRequest(BaseModel):
    region: str = Field(..., min_length=2, max_length=100)
    soil_type: str = Field(..., min_length=2, max_length=100)
    season: str = Field(..., min_length=2, max_length=50)
    water_availability: str = Field(..., min_length=2, max_length=50)  # Low, Medium, High
    temperature: Optional[float] = None
    rainfall: Optional[float] = None
    preferred_category: Optional[str] = None


class RecommendationMatch(BaseModel):
    crop: CropResponse
    match_score: int  # 0 to 100
    match_level: str  # "Highly Recommended", "Moderately Suitable", "Conditional"
    matched_criteria: List[str]
    unmet_or_partial_criteria: List[str]
    explanation: str
    limitations: List[str]


class RecommendationResponse(BaseModel):
    input_summary: dict
    total_crops_evaluated: int
    matches: List[RecommendationMatch]
    educational_disclaimer: str
