from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.session import get_db
from app.models.crop import Crop
from app.models.guides import (
    CultivationGuide,
    PestDisease,
    HarvestGuide,
    PostHarvestGuide,
    CropProduct,
)
from app.schemas.guides import (
    CultivationGuideResponse,
    PestDiseaseResponse,
    HarvestGuideResponse,
    PostHarvestGuideResponse,
    CropProductResponse,
)

router = APIRouter(tags=["Guides"])


# Crop specific guides
@router.get("/crops/{crop_id}/cultivation", response_model=CultivationGuideResponse)
def get_crop_cultivation_guide(crop_id: int, db: Session = Depends(get_db)):
    guide = db.query(CultivationGuide).filter(CultivationGuide.crop_id == crop_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cultivation guide not found for crop {crop_id}",
        )
    return guide


@router.get("/crops/{crop_id}/pests-diseases", response_model=List[PestDiseaseResponse])
def get_crop_pests_diseases(crop_id: int, db: Session = Depends(get_db)):
    items = db.query(PestDisease).filter(PestDisease.crop_id == crop_id).all()
    return items


@router.get("/crops/{crop_id}/harvest", response_model=HarvestGuideResponse)
def get_crop_harvest_guide(crop_id: int, db: Session = Depends(get_db)):
    guide = db.query(HarvestGuide).filter(HarvestGuide.crop_id == crop_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Harvest guide not found for crop {crop_id}",
        )
    return guide


@router.get("/crops/{crop_id}/post-harvest", response_model=PostHarvestGuideResponse)
def get_crop_post_harvest_guide(crop_id: int, db: Session = Depends(get_db)):
    guide = db.query(PostHarvestGuide).filter(PostHarvestGuide.crop_id == crop_id).first()
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Post-harvest guide not found for crop {crop_id}",
        )
    return guide


@router.get("/crops/{crop_id}/products", response_model=List[CropProductResponse])
def get_crop_products(crop_id: int, db: Session = Depends(get_db)):
    items = db.query(CropProduct).filter(CropProduct.crop_id == crop_id).all()
    return items


# Global searchable guides
@router.get("/pests-diseases", response_model=List[PestDiseaseResponse])
def get_all_pests_diseases(
    crop_id: Optional[int] = Query(None, description="Filter by crop ID"),
    search: Optional[str] = Query(None, description="Search by pest/disease name or symptom"),
    type: Optional[str] = Query(None, description="Filter by Pest or Disease"),
    db: Session = Depends(get_db),
):
    query = db.query(PestDisease)
    if crop_id:
        query = query.filter(PestDisease.crop_id == crop_id)
    if type and type.lower() != "all":
        query = query.filter(PestDisease.type.ilike(type))
    if search:
        s = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                PestDisease.name.ilike(s),
                PestDisease.symptoms.ilike(s),
                PestDisease.management.ilike(s),
            )
        )
    return query.all()


@router.get("/products", response_model=List[CropProductResponse])
def get_all_crop_products(
    crop_id: Optional[int] = Query(None, description="Filter by crop ID"),
    search: Optional[str] = Query(None, description="Search product name or use"),
    category: Optional[str] = Query(None, description="Filter by product category"),
    db: Session = Depends(get_db),
):
    query = db.query(CropProduct)
    if crop_id:
        query = query.filter(CropProduct.crop_id == crop_id)
    if category and category.lower() != "all":
        query = query.filter(CropProduct.product_category.ilike(category))
    if search:
        s = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                CropProduct.product_name.ilike(s),
                CropProduct.processing_overview.ilike(s),
                CropProduct.common_uses.ilike(s),
            )
        )
    return query.all()
