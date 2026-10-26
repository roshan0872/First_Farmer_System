from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.crop import Crop
from app.schemas.recommendation import RecommendationRequest, RecommendationResponse
from app.services.recommendation_service import get_recommendations

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.post("", response_model=RecommendationResponse)
def recommend_crops(
    request_data: RecommendationRequest,
    db: Session = Depends(get_db),
):
    crops = db.query(Crop).filter(Crop.is_published == True).all()
    return get_recommendations(crops, request_data)
