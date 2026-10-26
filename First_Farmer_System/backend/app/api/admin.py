from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.crop import Crop
from app.models.guides import (
    CultivationGuide,
    PestDisease,
    HarvestGuide,
    PostHarvestGuide,
    CropProduct,
)
from app.models.learning import CropBookmark, LearningProgress
from app.schemas.admin import AdminStatsResponse
from app.schemas.guides import (
    CultivationGuideCreate,
    CultivationGuideResponse,
    PestDiseaseCreate,
    PestDiseaseResponse,
    HarvestGuideCreate,
    HarvestGuideResponse,
    PostHarvestGuideCreate,
    PostHarvestGuideResponse,
    CropProductCreate,
    CropProductResponse,
)
from app.api.deps import get_current_admin

router = APIRouter(prefix="/admin", tags=["Administration"])


@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    total_users = db.query(User).count()
    total_crops = db.query(Crop).count()
    total_pests = db.query(PestDisease).count()
    total_prods = db.query(CropProduct).count()
    total_bookmarks = db.query(CropBookmark).count()
    total_learning = db.query(LearningProgress).count()

    recent_users_query = db.query(User).order_by(User.created_at.desc()).limit(10).all()
    recent_users = [
        {
            "id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "role": u.role,
            "preferred_language": u.preferred_language,
            "created_at": u.created_at.isoformat(),
        }
        for u in recent_users_query
    ]

    return AdminStatsResponse(
        total_users=total_users,
        total_crops=total_crops,
        total_pests_diseases=total_pests,
        total_products=total_prods,
        total_bookmarks=total_bookmarks,
        total_learning_records=total_learning,
        recent_users=recent_users,
    )


# Cultivation Guide Admin CRUD
@router.post("/cultivation-guides", response_model=CultivationGuideResponse, status_code=status.HTTP_201_CREATED)
def create_or_update_cultivation_guide(
    guide_in: CultivationGuideCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    guide = db.query(CultivationGuide).filter(CultivationGuide.crop_id == guide_in.crop_id).first()
    if guide:
        for k, v in guide_in.model_dump().items():
            setattr(guide, k, v)
    else:
        guide = CultivationGuide(**guide_in.model_dump())
        db.add(guide)
    db.commit()
    db.refresh(guide)
    return guide


# Pest & Disease Admin CRUD
@router.post("/pests-diseases", response_model=PestDiseaseResponse, status_code=status.HTTP_201_CREATED)
def create_pest_disease(
    item_in: PestDiseaseCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    item = PestDisease(**item_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/pests-diseases/{item_id}", status_code=status.HTTP_200_OK)
def delete_pest_disease(
    item_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    item = db.query(PestDisease).filter(PestDisease.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Pest or Disease record not found")
    db.delete(item)
    db.commit()
    return {"message": "Record deleted successfully"}


# Harvest Guide Admin CRUD
@router.post("/harvest-guides", response_model=HarvestGuideResponse, status_code=status.HTTP_201_CREATED)
def create_or_update_harvest_guide(
    guide_in: HarvestGuideCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    guide = db.query(HarvestGuide).filter(HarvestGuide.crop_id == guide_in.crop_id).first()
    if guide:
        for k, v in guide_in.model_dump().items():
            setattr(guide, k, v)
    else:
        guide = HarvestGuide(**guide_in.model_dump())
        db.add(guide)
    db.commit()
    db.refresh(guide)
    return guide


# Post Harvest Guide Admin CRUD
@router.post("/post-harvest-guides", response_model=PostHarvestGuideResponse, status_code=status.HTTP_201_CREATED)
def create_or_update_post_harvest_guide(
    guide_in: PostHarvestGuideCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    guide = db.query(PostHarvestGuide).filter(PostHarvestGuide.crop_id == guide_in.crop_id).first()
    if guide:
        for k, v in guide_in.model_dump().items():
            setattr(guide, k, v)
    else:
        guide = PostHarvestGuide(**guide_in.model_dump())
        db.add(guide)
    db.commit()
    db.refresh(guide)
    return guide


# Crop Product Admin CRUD
@router.post("/products", response_model=CropProductResponse, status_code=status.HTTP_201_CREATED)
def create_crop_product(
    prod_in: CropProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    prod = CropProduct(**prod_in.model_dump())
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod


@router.delete("/products/{product_id}", status_code=status.HTTP_200_OK)
def delete_crop_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    prod = db.query(CropProduct).filter(CropProduct.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(prod)
    db.commit()
    return {"message": "Product deleted successfully"}
