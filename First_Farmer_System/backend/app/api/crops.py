from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.session import get_db
from app.models.crop import Crop
from app.schemas.crop import CropResponse, CropDetailResponse, CropCreate, CropUpdate
from app.api.deps import get_current_admin

router = APIRouter(prefix="/crops", tags=["Crops"])


@router.get("", response_model=List[CropResponse])
def get_crops(
    search: Optional[str] = Query(None, description="Search crop name, scientific name or description"),
    category: Optional[str] = Query(None, description="Filter by crop category"),
    season: Optional[str] = Query(None, description="Filter by season"),
    soil: Optional[str] = Query(None, description="Filter by soil requirement"),
    region: Optional[str] = Query(None, description="Filter by suitable region"),
    sort: Optional[str] = Query("asc", description="Sort order: asc or desc"),
    db: Session = Depends(get_db),
):
    query = db.query(Crop).filter(Crop.is_published == True)

    if search:
        s = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                Crop.name.ilike(s),
                Crop.scientific_name.ilike(s),
                Crop.description.ilike(s),
                Crop.category.ilike(s),
            )
        )

    if category and category.lower() != "all":
        query = query.filter(Crop.category.ilike(f"%{category.strip()}%"))

    if season and season.lower() != "all":
        query = query.filter(Crop.season.ilike(f"%{season.strip()}%"))

    if soil and soil.lower() != "all":
        query = query.filter(Crop.soil_requirements.ilike(f"%{soil.strip()}%"))

    if region and region.lower() != "all":
        query = query.filter(Crop.suitable_regions.ilike(f"%{region.strip()}%"))

    if sort == "desc":
        query = query.order_by(Crop.name.desc())
    else:
        query = query.order_by(Crop.name.asc())

    return query.all()


@router.get("/{crop_id}", response_model=CropDetailResponse)
def get_crop_detail(crop_id: int, db: Session = Depends(get_db)):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crop with ID {crop_id} not found",
        )
    return crop


@router.post("", response_model=CropResponse, status_code=status.HTTP_201_CREATED)
def create_crop(
    crop_in: CropCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    crop = Crop(**crop_in.model_dump())
    db.add(crop)
    db.commit()
    db.refresh(crop)
    return crop


@router.put("/{crop_id}", response_model=CropResponse)
def update_crop(
    crop_id: int,
    crop_in: CropUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crop with ID {crop_id} not found",
        )
    
    update_data = crop_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(crop, field, val)
    
    db.commit()
    db.refresh(crop)
    return crop


@router.delete("/{crop_id}", status_code=status.HTTP_200_OK)
def delete_crop(
    crop_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crop with ID {crop_id} not found",
        )
    db.delete(crop)
    db.commit()
    return {"message": f"Crop '{crop.name}' deleted successfully"}
