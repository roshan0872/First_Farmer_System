from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.learning import LearningProgress, CropBookmark
from app.models.crop import Crop
from app.models.user import User
from app.schemas.learning import ProgressCreate, ProgressResponse, LearningDashboardStats
from app.api.deps import get_current_user

router = APIRouter(prefix="/progress", tags=["Learning Progress"])


@router.get("", response_model=List[ProgressResponse])
def get_user_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    progress_items = db.query(LearningProgress).filter(
        LearningProgress.user_id == current_user.id
    ).order_by(LearningProgress.last_accessed_at.desc()).all()
    return progress_items


@router.post("", response_model=ProgressResponse)
def update_user_progress(
    progress_in: ProgressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if progress_in.crop_id:
        crop = db.query(Crop).filter(Crop.id == progress_in.crop_id).first()
        if not crop:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop with ID {progress_in.crop_id} not found",
            )

    progress = db.query(LearningProgress).filter(
        LearningProgress.user_id == current_user.id,
        LearningProgress.crop_id == progress_in.crop_id,
        LearningProgress.module_name == progress_in.module_name,
    ).first()

    if progress:
        progress.completion_status = progress_in.completion_status
        progress.progress_percentage = progress_in.progress_percentage
        progress.last_accessed_at = datetime.now(timezone.utc)
    else:
        progress = LearningProgress(
            user_id=current_user.id,
            crop_id=progress_in.crop_id,
            module_name=progress_in.module_name,
            completion_status=progress_in.completion_status,
            progress_percentage=progress_in.progress_percentage,
            last_accessed_at=datetime.now(timezone.utc),
        )
        db.add(progress)

    db.commit()
    db.refresh(progress)
    return progress


@router.get("/stats", response_model=LearningDashboardStats)
def get_learning_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total_crops = db.query(Crop).filter(Crop.is_published == True).count()
    saved_count = db.query(CropBookmark).filter(CropBookmark.user_id == current_user.id).count()
    
    completed_modules = db.query(LearningProgress).filter(
        LearningProgress.user_id == current_user.id,
        LearningProgress.completion_status == "completed"
    ).count()

    in_progress_modules = db.query(LearningProgress).filter(
        LearningProgress.user_id == current_user.id,
        LearningProgress.completion_status == "in_progress"
    ).count()

    # Calculate overall progress percentage across core modules
    # Assuming 4 core modules per crop (cultivation, pest, harvest, post-harvest)
    total_possible_modules = max(1, total_crops * 4)
    overall_pct = min(100, int((completed_modules / total_possible_modules) * 100))

    return LearningDashboardStats(
        total_crops_in_library=total_crops,
        saved_crops_count=saved_count,
        completed_modules_count=completed_modules,
        in_progress_modules_count=in_progress_modules,
        overall_progress_percentage=overall_pct,
    )
