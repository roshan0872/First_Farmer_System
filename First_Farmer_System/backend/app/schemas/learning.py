from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.crop import CropResponse


class BookmarkResponse(BaseModel):
    id: int
    user_id: int
    crop_id: int
    created_at: datetime
    crop: Optional[CropResponse] = None

    model_config = ConfigDict(from_attributes=True)


class ProgressCreate(BaseModel):
    crop_id: Optional[int] = None
    module_name: str  # cultivation, pest_management, harvest, post_harvest
    completion_status: str = "in_progress"  # in_progress, completed
    progress_percentage: int = 0


class ProgressResponse(BaseModel):
    id: int
    user_id: int
    crop_id: Optional[int]
    module_name: str
    completion_status: str
    progress_percentage: int
    last_accessed_at: datetime
    crop: Optional[CropResponse] = None

    model_config = ConfigDict(from_attributes=True)


class LearningDashboardStats(BaseModel):
    total_crops_in_library: int
    saved_crops_count: int
    completed_modules_count: int
    in_progress_modules_count: int
    overall_progress_percentage: int
