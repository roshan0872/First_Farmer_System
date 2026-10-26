from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.learning import CropBookmark
from app.models.crop import Crop
from app.models.user import User
from app.schemas.learning import BookmarkResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/bookmarks", tags=["Bookmarks"])


@router.get("", response_model=List[BookmarkResponse])
def get_user_bookmarks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bookmarks = db.query(CropBookmark).filter(CropBookmark.user_id == current_user.id).all()
    return bookmarks


@router.post("/{crop_id}", response_model=BookmarkResponse, status_code=status.HTTP_201_CREATED)
def add_bookmark(
    crop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crop with ID {crop_id} not found",
        )

    existing = db.query(CropBookmark).filter(
        CropBookmark.user_id == current_user.id,
        CropBookmark.crop_id == crop_id
    ).first()

    if existing:
        return existing

    bookmark = CropBookmark(user_id=current_user.id, crop_id=crop_id)
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)
    return bookmark


@router.delete("/{crop_id}", status_code=status.HTTP_200_OK)
def remove_bookmark(
    crop_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bookmark = db.query(CropBookmark).filter(
        CropBookmark.user_id == current_user.id,
        CropBookmark.crop_id == crop_id
    ).first()

    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found",
        )

    db.delete(bookmark)
    db.commit()
    return {"message": "Bookmark removed successfully"}
